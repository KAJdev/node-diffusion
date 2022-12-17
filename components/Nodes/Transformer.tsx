/* eslint-disable @next/next/no-img-element */
import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import { Label } from "../Label";

export type Transformer = NodeProps<{
  prompt: string;
  temperature: number;
}>;

export const Transformer = memo(function Transformer(node: Transformer) {
  return (
    <div className="rounded p-2 flex flex-col min-w-[15rem] gap-2 bg-neutral-800 drop-shadow z-10 border border-white/10">
      <Handle
        type="source"
        position={Position.Top}
        className="!rounded-b !bg-neutral-800 !border-none !w-5 !h-3"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="!rounded-t !bg-neutral-800 !border-none !w-5 !h-3"
      />

      <div className="flex flex-col gap-1 text-sm">
        <Label>Prompt</Label>
        <textarea
          className="px-1 py-[1px] rounded bg-neutral-900/50 focus:outline-none focus:border-indigo-500/50 border-transparent border-[2px]"
          value={node.data.prompt}
        />
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <Label>Prediction</Label>
        <textarea
          className="px-1 py-[1px] rounded bg-neutral-900/50 focus:outline-none focus:border-indigo-500/50 border-transparent border-[2px]"
          value={node.data.prompt}
          contentEditable={false}
        />
      </div>
    </div>
  );
});
