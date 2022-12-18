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

export type Prompt = NodeProps<{
  locked: boolean;
  running: boolean;
  resolved: boolean;
  input: {
    prompt: string;
  };
  output: {
    prompt: string;
  };
}>;

export function Prompt(node: Prompt) {
  const { editNode, deleteNode, nodes, edges } = Nodes.use((state) => ({
    editNode: state.editNode,
    deleteNode: state.deleteNode,
    nodes: state.nodes,
    edges: state.edges,
  }));

  useEffect(() => {
    editNode(node.id, {
      output: {
        prompt: node.data.input.prompt,
      },
    });
  }, [editNode, node.data.input.prompt, node.id]);

  return (
    <Panel name="Prompt">
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
          name="prompt"
          value={node.data.output.prompt || ""}
          label="Prompt"
          nodeID={node.id}
        />
      </Variables>

      <Outputs>
        <Output label="Prompt" name="prompt" nodeID={node.id} type="string" />
      </Outputs>
    </Panel>
  );
}

export namespace Prompt {
  export async function run(node: Node): Promise<any> {
    return {
      prompt: node.data.output.prompt,
    };
  }
}
