/* eslint-disable @next/next/no-img-element */
import { ImageIcon, Lock, Play, Repeat, Trash2, Unlock } from "lucide-react";
import React from "react";
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

export type Interrogate = NodeProps<{
  locked: boolean;
  running: boolean;
  repeating: boolean;
  input: {
    image: string;
  };
  output: {
    prompt: string;
  };
}>;

export function Interrogate(node: Interrogate) {
  const { editNode, deleteNode } = Nodes.use((state) => ({
    editNode: state.editNode,
    deleteNode: state.deleteNode,
  }));

  const [loaded, setLoaded] = useState(false);

  return (
    <Panel
      name="CLIP Interrogation"
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

      <Variables>
        <ImageVariable nodeID={node.id} label="Image" name="image" />
      </Variables>
      <Outputs>
        <Output
          label="Prompt"
          nodeID={node.id}
          name="prompt"
          type="string"
          value={node.data.output.prompt}
        />
      </Outputs>
    </Panel>
  );
}

export namespace Interrogate {
  export async function run(node: Node): Promise<any> {
    const { image } = node.data.input;

    if (!image) {
      if (node.data.repeating) {
        // disable repeating
        Nodes.use.getState().editNode(node.id, {
          repeating: false,
        });
      }
      return {
        prompt: node.data.output.prompt,
      };
    }

    // image is probably a dataurl or a regular image. Need to fetch and convert to base64
    const img_d = await fetch(image);
    const img_b = await img_d.blob();
    const img_b64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(img_b);
    });

    const data = await fetch("https://api.prototyped.ai/interrogate", {
      method: "POST",
      body: JSON.stringify({
        image: img_b64,
      }),
    }).then((res) => res.json());

    return {
      prompt: data.prompt,
    };
  }

  export const Memo = memo(Interrogate);
}
