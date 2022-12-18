/* eslint-disable @next/next/no-img-element */
import { ImageIcon, Lock, Trash2, Unlock } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { NodeProps, Node } from "reactflow";
import "reactflow/dist/style.css";
import { Nodes } from ".";
import { Content, Output, Outputs, Panel, Toolbar, ToolButton } from "../Node";

export type LoadImage = NodeProps<{
  locked: boolean;
  running: boolean;
  repeating: boolean;
  input: {};
  output: {
    image: string;
  };
}>;

export function LoadImage(node: LoadImage) {
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

  const loadImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png";
    input.onchange = (e) => {
      if (e.target) {
        const file = (e.target as HTMLInputElement).files![0];
        // create blob url
        const url = URL.createObjectURL(file);
        // set image
        editNode(node.id, {
          output: {
            image: url,
          },
        });
      }
    };
    input.click();
  }, [editNode, node.id]);

  return (
    <Panel
      name="Load Image"
      running={node.data.running}
      selected={node.selected}
    >
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

      <Content>
        {node.data.output.image && (
          <img
            src={node.data.output.image}
            className="rounded max-w-80 max-h-80 cursor-pointer hover:opacity-80 duration-200"
            alt="graph image"
            onLoad={() => setLoaded(true)}
            onClick={loadImage}
          />
        )}
        {!node.data.output.image && !loaded && (
          <div
            className="aspect-square max-w-80 max-h-80 flex rounded bg-black/20 justify-center cursor-pointer items-center flex-col text-neutral-600"
            onClick={loadImage}
          >
            <ImageIcon size={32} />
            <h1 className="font-semibold text-lg">Choose Image</h1>
          </div>
        )}
      </Content>
      <Outputs>
        <Output label="Image" nodeID={node.id} name="image" type="image" />
      </Outputs>
    </Panel>
  );
}

export namespace LoadImage {
  export async function run(node: Node): Promise<any> {
    return {
      image: node.data.output.image,
    };
  }

  export const Memo = memo(LoadImage);
}
