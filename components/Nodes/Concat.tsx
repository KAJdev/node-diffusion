/* eslint-disable @next/next/no-img-element */
import { Play, Trash2, Unlock, Lock } from "lucide-react";
import { memo, useEffect } from "react";
import {
  Handle,
  Position,
  NodeProps,
  NodeToolbar,
  getIncomers,
  getConnectedEdges,
  useUpdateNodeInternals,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { Nodes } from ".";
import { Label } from "../Label";
import {
  Output,
  Outputs,
  Panel,
  TextVariable,
  Toolbar,
  ToolButton,
  Variables,
} from "../Node";

export type Concat = NodeProps<{
  locked: boolean;
  running: boolean;
  repeating: boolean;
  input: {
    first: string;
    second: string;
  };
  output: {
    final: string;
  };
}>;

export function Concat(node: Concat) {
  const { editNode, deleteNode, nodes, edges } = Nodes.use((state) => ({
    editNode: state.editNode,
    deleteNode: state.deleteNode,
    nodes: state.nodes,
    edges: state.edges,
  }));

  return (
    <Panel name="Concat" running={node.data.running} selected={node.selected}>
      <Toolbar show={node.selected}>
        <ToolButton
          onClick={() =>
            editNode(node.id, {
              locked: !node.data.locked,
            })
          }
          active={node.data.locked}
        >
          {node.data.locked ? <Lock size={16} /> : <Unlock size={16} />}
        </ToolButton>
        <ToolButton onClick={() => deleteNode(node.id)}>
          <Trash2 size={16} />
        </ToolButton>
      </Toolbar>

      <Variables>
        <TextVariable
          name="first"
          value={node.data.input.first || ""}
          label="String A"
          nodeID={node.id}
        />
        <TextVariable
          name="second"
          value={node.data.input.second || ""}
          label="String B"
          nodeID={node.id}
        />
      </Variables>

      <Outputs>
        <Output
          label="Concatenated String"
          name="final"
          nodeID={node.id}
          type="string"
        />
      </Outputs>
    </Panel>
  );
}

export namespace Concat {
  export async function run(node: Node): Promise<any> {
    return {
      final: node.data.input.first + node.data.input.second,
    };
  }

  export const Memo = memo(Concat);
}
