/* eslint-disable @next/next/no-img-element */
import { ImageIcon, Lock, Play, Repeat, Trash2, Unlock } from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
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
  repeating: boolean;
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

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!node.data.output.image) {
      setLoaded(false);
    }
  }, [node.data.output.image]);

  return (
    <Panel
      name="Stable Diffusion"
      running={node.data.running}
      selected={node.selected}
    >
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

      <Content>
        {node.data.output.image && (
          <img
            src={node.data.output.image}
            className="rounded max-w-80 max-h-80"
            alt="graph image"
            onLoad={() => setLoaded(true)}
          />
        )}
        {!node.data.output.image && !loaded && (
          <div className="aspect-square max-w-80 max-h-80 flex rounded bg-black/20 justify-center items-center flex-col text-neutral-600">
            <ImageIcon size={32} />
            <h1 className="font-semibold text-lg">Image</h1>
          </div>
        )}
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

    if (!prompt) {
      if (node.data.repeating) {
        // disable repeating
        Nodes.use.getState().editNode(node.id, {
          repeating: false,
        });
      }
      return {
        image: node.data.output.image,
      };
    }

    let data: any = {};
    if (init && init.length > 0) {
      // init is probably a dataurl or a regular image. Need to fetch and convert to base64
      const init_d = await fetch(init);
      const init_b = await init_d.blob();
      const init_b64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(init_b);
      });

      data = await fetch("https://api.prototyped.ai/init", {
        method: "POST",
        body: JSON.stringify({
          steps,
          scale: cfg_scale,
          prompt,
          count: 1,
          init: init_b64,
        }),
      }).then((res) => res.json());
    } else {
      data = await fetch("https://api.prototyped.ai/image", {
        method: "POST",
        body: JSON.stringify({
          steps,
          scale: cfg_scale,
          prompt,
          count: 1,
        }),
      }).then((res) => res.json());
    }

    return {
      image: data[0].image,
    };
  }

  export const Memo = memo(Image);
}
