/* eslint-disable @next/next/no-img-element */
import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import { Label } from "../Label";

export type Image = NodeProps<{
  url: string;

  prompt: string;
  steps: number;
}>;

export const Image = memo(function Image(node: Image) {
  return (
    <div className="rounded p-2 flex flex-col gap-2 bg-neutral-800 drop-shadow z-10 border border-white/10">
      <Handle
        type="source"
        position={Position.Left}
        className="!border-none !bg-white !p-1"
      />
      <Handle
        type="target"
        position={Position.Right}
        className="!border-none !bg-white !p-1"
      />

      <img
        src={node.data.url}
        className="rounded max-w-80 max-h-80"
        alt="graph image"
      />

      <div className="flex flex-col gap-1 text-sm">
        <Label>Prompt</Label>
        <textarea
          className="px-1 py-[1px] rounded nodrag bg-neutral-900/50 focus:outline-none focus:border-indigo-500/50 border-transparent border-[2px]"
          value={node.data.prompt}
        />
      </div>
      <div className="flex flex-row gap-1 justify-between items-center text-sm">
        <Label>Steps</Label>
        <input
          type="number"
          value={node.data.steps}
          className="px-1 py-[1px] rounded w-1/2 nodrag bg-neutral-900/50 focus:outline-none focus:border-indigo-500/50 border-transparent border-[2px]"
        />
      </div>
      <div className="flex flex-row gap-1 justify-between items-center text-sm">
        <Label>CFG Scale</Label>
        <input
          type="number"
          value={node.data.steps}
          className="px-1 py-[1px] rounded w-1/2 nodrag bg-neutral-900/50 focus:outline-none focus:border-indigo-500/50 border-transparent border-[2px]"
        />
      </div>
    </div>
  );
});
