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
    Image: Nodes.Image,
    Transformer: Nodes.Transformer,
    RandomNumber: Nodes.RandomNumber,
    Prompt: Nodes.Prompt,
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

  export async function resolveNode(nodeid: string): Promise<any> {
    // get the node
    const node = Nodes.use.getState().nodes.find((node) => node.id === nodeid);

    if (!node) {
      throw new Error(`Node ${nodeid} not found`);
    }

    const { nodes, edges } = Nodes.use.getState();

    const sourceNodes = getIncomers(node, nodes, edges);

    const sourcePromises = sourceNodes.map((node) => resolveNode(node.id));

    await Promise.all(sourcePromises);

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

    // run the node
    const output = await runNode(node);

    // update the node's output
    Nodes.use.getState().editNode(nodeid, { output, running: false });

    return output;
  }
}
