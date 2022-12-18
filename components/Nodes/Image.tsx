/* eslint-disable @next/next/no-img-element */
import { Lock, Play, Trash2, Unlock } from "lucide-react";
import { memo, useMemo, useRef } from "react";
import {
  Handle,
  Position,
  NodeProps,
  NodeToolbar,
  getIncomers,
  getConnectedEdges,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { Nodes } from ".";
import { Label } from "../Label";
import {
  Content,
  ImageVariable,
  NumberVariable,
  Output,
  Outputs,
  Panel,
  TextVariable,
  Toolbar,
  ToolButton,
  Variables,
} from "../Node";

export type Image = NodeProps<{
  locked: boolean;
  running: boolean;
  resolved: boolean;
  input: {
    init: string;
    prompt: string;
    steps: number;
    cfg_scale: number;
  };
  output: {
    image: string;
  };
}>;

export function Image(node: Image) {
  const { editNode, deleteNode } = Nodes.use((state) => ({
    editNode: state.editNode,
    deleteNode: state.deleteNode,
  }));

  return (
    <Panel name="Stable Diffusion">
      <Toolbar show={node.selected}>
        <ToolButton
          onClick={() => {
            Nodes.resolveNode(node.id);
          }}
        >
          <Play size={16} />
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

      <Content>
        <img
          src={node.data.output.image}
          className="rounded max-w-80 max-h-80"
          alt="graph image"
        />
      </Content>

      <Variables>
        <ImageVariable nodeID={node.id} label="Initial Image" name="init" />
        <NumberVariable
          value={node.data.input.steps || 30}
          nodeID={node.id}
          label="Steps"
          name="steps"
        />
        <NumberVariable
          value={node.data.input.cfg_scale || 7}
          nodeID={node.id}
          label="CFG Scale"
          name="cfg_scale"
        />
        <TextVariable
          value={node.data.input.prompt || ""}
          nodeID={node.id}
          label="Prompt"
          name="prompt"
        />
      </Variables>
      <Outputs>
        <Output label="Image" nodeID={node.id} name="image" type="image" />
      </Outputs>
    </Panel>
  );
}

export namespace Image {
  export async function run(node: Node): Promise<any> {
    const { input } = node.data;
    const { init, steps, cfg_scale, prompt } = input;

    const data = await fetch("https://api.diffusion.chat/image", {
      method: "POST",
      body: JSON.stringify({
        steps,
        scale: cfg_scale,
        prompt,
        count: 1,
      }),
    }).then((res) => res.json());

    return {
      image: data[0].image,
    };
  }
}
