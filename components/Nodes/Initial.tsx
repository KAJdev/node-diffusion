/* eslint-disable @next/next/no-img-element */
import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import { Label } from "../Label";

export const Initial = memo(function Initial(node: NodeProps) {
  return (
    <div className="rounded p-3 flex flex-col justify-center items-center gap-3 bg-neutral-800 drop-shadow z-10 border border-white/10">
      <Handle
        type="target"
        position={Position.Right}
        className="!rounded-l !bg-neutral-800 !border-none !h-5 !w-1 !pl-2 z-0"
      />

      <button className="font-medium px-3 py-1 w-full bg-green-800 rounded duration-200 hover:bg-green-900">
        Begin Generation
      </button>
      <button className="font-medium px-3 py-1 w-full bg-red-800 rounded duration-200 hover:bg-red-900">
        Cancel generation
      </button>
    </div>
  );
});
