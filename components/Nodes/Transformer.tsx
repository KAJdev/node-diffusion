/* eslint-disable @next/next/no-img-element */
import { Trash2 } from "lucide-react";
import { memo } from "react";
import { Handle, Position, NodeProps, NodeToolbar } from "reactflow";
import "reactflow/dist/style.css";
import { Nodes } from ".";
import { Label } from "../Label";

export type Transformer = NodeProps<{
  prompt: string;
  temperature: number;

  prediction: string;
}>;

export const Transformer = memo(function Transformer(node: Transformer) {
  const { editNode, deleteNode } = Nodes.use((state) => ({
    editNode: state.editNode,
    deleteNode: state.deleteNode,
  }));

  return (
    <div className="rounded p-2 flex flex-col min-w-[15rem] gap-2 bg-neutral-800 drop-shadow z-10 border border-white/10">
      <Handle
        type="source"
        position={Position.Top}
        className="!border-none !bg-white !p-1"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="!border-none !bg-white !p-1"
      />

      <NodeToolbar isVisible={node.selected}>
        <div className="bg-neutral-800 rounded flex flex-row overflow-hidden">
          <button
            onClick={() => deleteNode(node.id)}
            className="p-2 hover:bg-white/10 active:bg-white/20 text-red-400/80 duration-200 border-r border-white/10 first-of-type:border-l-transparent last-of-type:border-r-transparent"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </NodeToolbar>

      <div className="flex flex-col gap-1 text-sm">
        <Label>Prompt</Label>
        <textarea
          className="px-1 py-[1px] rounded bg-neutral-900/50 nodrag focus:outline-none focus:border-indigo-500/50 border-transparent border-[2px]"
          value={node.data.prompt}
          onChange={(e) => {
            editNode(node.id, {
              prompt: e.target.value,
            });
          }}
        />
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <Label>Prediction</Label>
        <textarea
          className="px-1 py-[1px] rounded bg-neutral-900/50 nodrag focus:outline-none focus:border-indigo-500/50 border-transparent border-[2px]"
          value={node.data.prediction}
          contentEditable={false}
          onChange={(e) => {}}
        />
      </div>
    </div>
  );
});
