import { Image } from "./Image";
import { Transformer } from "./Transformer";
import { Initial } from "./Initial";
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
} from "reactflow";

export type NodesState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  editNode: <T>(id: string, newData: Node<T>) => void;
};

export declare namespace Nodes {
  export { Image, Transformer, Initial };
}

export namespace Nodes {
  Nodes.Image = Image;
  Nodes.Transformer = Transformer;
  Nodes.Initial = Initial;

  export const nodeTypes = {
    Image: Nodes.Image,
    Transformer: Nodes.Transformer,
    Initial: Nodes.Initial,
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
    editNode: (id: string, newData: Node<any>) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              ...newData,
            };
          }
          return node;
        }),
      });
    },
  }));
}
