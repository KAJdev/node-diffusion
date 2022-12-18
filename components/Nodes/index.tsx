import { Image } from "./Image";
import { Transformer } from "./Transformer";
import { RandomNumber } from "./RandomNumber";
import { Prompt } from "./Prompt";
import create from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  getIncomers,
  getConnectedEdges,
} from "reactflow";

export type NodesState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  editNode: (id: string, newData: any) => void;
  deleteNode: (id: string) => void;
  setEdgeAnimationState: (id: string, state: boolean) => void;
};

export declare namespace Nodes {
  export { Image, Transformer, RandomNumber, Prompt };
}

export namespace Nodes {
  Nodes.Image = Image;
  Nodes.Transformer = Transformer;
  Nodes.RandomNumber = RandomNumber;
  Nodes.Prompt = Prompt;

  export const nodeTypes = {
    Image: Nodes.Image.Memo,
    Transformer: Nodes.Transformer.Memo,
    RandomNumber: Nodes.RandomNumber.Memo,
    Prompt: Nodes.Prompt.Memo,
  };

  export const use = create<NodesState>((set, get) => ({
    nodes: [],
    edges: [],
    onNodesChange: (changes: NodeChange[]) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection: Connection) => {
      set({
        edges: addEdge(connection, get().edges),
      });
    },
    addNode: (node: Node) => {
      set({
        nodes: [...get().nodes, node],
      });
    },
    editNode: (id: string, newData: any) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            };
          }
          return node;
        }),
      });
    },
    deleteNode: (id: string) => {
      set({
        nodes: get().nodes.filter((node) => node.id !== id),
        edges: get().edges.filter(
          (edge) => edge.source !== id && edge.target !== id
        ),
      });
    },
    setEdgeAnimationState: (id: string, state: boolean) => {
      set({
        edges: get().edges.map((edge) => {
          if (edge.id === id) {
            return {
              ...edge,
              animated: state,
            };
          }
          return edge;
        }),
      });
    },
  }));

  export async function runNode(node: Node): Promise<any> {
    switch (node.type) {
      case "Image":
        return Nodes.Image.run(node);
      case "Transformer":
        return Nodes.Transformer.run(node);
      case "RandomNumber":
        return Nodes.RandomNumber.run(node);
      case "Prompt":
        return Nodes.Prompt.run(node);
      default:
        throw new Error(`Node type ${node.type} not found`);
    }
  }

  export async function resolveNode(
    nodeid: string,
    repeat?: boolean
  ): Promise<any> {
    const node = Nodes.use.getState().nodes.find((node) => node.id === nodeid);

    if (!node) {
      throw new Error(`Node ${nodeid} not found`);
    }

    // set node repeating to true
    if (repeat) {
      Nodes.use.getState().editNode(nodeid, { repeating: true });

      while (true) {
        await resolveSingleNode(nodeid);

        // check if node is still repeating
        const node = Nodes.use
          .getState()
          .nodes.find((node) => node.id === nodeid);

        if (!node || !node.data.repeating) {
          break;
        }
      }
    } else {
      resolveSingleNode(nodeid);
    }
  }

  export async function resolveSingleNode(nodeid: string): Promise<any> {
    // get the node
    const node = Nodes.use.getState().nodes.find((node) => node.id === nodeid);

    if (!node) {
      throw new Error(`Node ${nodeid} not found`);
    }

    const { nodes, edges } = Nodes.use.getState();

    let sourceNodes: Node[] = [];
    try {
      sourceNodes = getIncomers(node, nodes, edges);
    } catch (e) {
      if (e instanceof RangeError) {
        console.log(
          `Node loop detected. Please check your connections and try again.`
        );
      }
      return;
    }

    // check if we are in an infinite loop
    if (sourceNodes.find((node) => node.id === nodeid)) {
      console.log(
        `Node loop detected. Please check your connections and try again.`
      );
      return;
    }

    const sourcePromises = sourceNodes.map((node) => resolveNode(node.id));

    if (sourcePromises.length) {
      await Promise.all(sourcePromises);
    }

    // probably need to refetch sources here, in case they changed
    const newSources = Nodes.use.getState();
    const sourceNodes2 = getIncomers(node, newSources.nodes, newSources.edges);
    const sourceEdges2 = getConnectedEdges([node], newSources.edges);

    // populate the node's input with the output of the sources
    const input = sourceEdges2.reduce((acc, edge) => {
      const sourceNode = sourceNodes2.find((node) => node.id === edge.source);
      if (sourceNode) {
        // @ts-ignore
        acc[edge.targetHandle.split("-").pop()] =
          // @ts-ignore
          sourceNode.data.output[edge.sourceHandle.split("-").pop()];
      }
      return acc;
    }, {});

    // set the node's input
    Nodes.use.getState().editNode(nodeid, {
      input: {
        ...node.data.input,
        ...input,
      },
      running: true,
    });

    // animate the edges
    sourceEdges2.forEach((edge) => {
      Nodes.use.getState().setEdgeAnimationState(edge.id, true);
    });

    // get the node again
    const node2 = Nodes.use.getState().nodes.find((node) => node.id === nodeid);

    // run the node
    const output =
      node2 && !node2.data.locked ? await runNode(node2) : node.data.output;

    // stop animating the edges
    sourceEdges2.forEach((edge) => {
      Nodes.use.getState().setEdgeAnimationState(edge.id, false);
    });

    // update the node's output
    Nodes.use.getState().editNode(nodeid, { output, running: false });

    return output;
  }
}
