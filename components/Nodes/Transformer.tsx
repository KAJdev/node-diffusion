/* eslint-disable @next/next/no-img-element */
import { Play, Trash2, Lock, Unlock, Repeat } from "lucide-react";
import { memo } from "react";
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
  NumberVariable,
  Output,
  Outputs,
  Panel,
  TextVariable,
  Toolbar,
  ToolButton,
  Variables,
} from "../Node";

export type Transformer = NodeProps<{
  locked: boolean;
  running: boolean;
  repeating: boolean;
  input: {
    prompt: string;
    temperature: number;
    top_p: number;
    frequency_penalty: number;
  };
  output: {
    prediction: string;
  };
}>;

export function Transformer(node: Transformer) {
  const { editNode, deleteNode } = Nodes.use((state) => ({
    editNode: state.editNode,
    deleteNode: state.deleteNode,
  }));

  return (
    <Panel name="GPT-3" running={node.data.running} selected={node.selected}>
      <Toolbar show={node.selected}>
        {!node.data.running && (
          <ToolButton
            onClick={() => {
              Nodes.resolveNode(node.id);
            }}
          >
            <Play size={16} />
          </ToolButton>
        )}
        <ToolButton
          onClick={() => {
            if (node.data.repeating) {
              editNode(node.id, {
                repeating: false,
              });
            } else {
              Nodes.resolveNode(node.id, true);
            }
          }}
          active={node.data.repeating}
        >
          <Repeat size={16} />
        </ToolButton>
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
        <NumberVariable
          name="temperature"
          value={node.data.input.temperature || 0.9}
          label="Temperature"
          nodeID={node.id}
        />
        <NumberVariable
          name="top_p"
          value={node.data.input.top_p || 0.9}
          label="Top P"
          nodeID={node.id}
        />
        <NumberVariable
          name="frequency_penalty"
          value={node.data.input.frequency_penalty || 0.0}
          label="Frequency Penalty"
          nodeID={node.id}
        />
        <TextVariable
          name="prompt"
          value={node.data.input.prompt || ""}
          label="Prompt"
          nodeID={node.id}
        />
      </Variables>

      <Outputs>
        <Output
          label="Prediction"
          name="prediction"
          nodeID={node.id}
          type="string"
          value={node.data.output.prediction || ""}
        />
      </Outputs>
    </Panel>
  );
}

export namespace Transformer {
  export async function run(node: Node): Promise<any> {
    const { prompt, temperature, top_p, frequency_penalty } = node.data.input;

    if (!prompt) {
      if (node.data.repeating) {
        // disable repeating
        Nodes.use.getState().editNode(node.id, {
          repeating: false,
        });
      }
      return {
        prediction: "",
      };
    }

    const response = await fetch("https://api.diffusion.chat/text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        temperature,
        top_p,
        frequency_penalty,
      }),
    });

    const json = await response.json();

    return {
      prediction: json.choices.pop().text,
    };
  }

  export const Memo = memo(Transformer);
}
