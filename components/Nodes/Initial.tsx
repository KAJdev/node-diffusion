/* eslint-disable @next/next/no-img-element */
import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import { Nodes } from ".";
import { Label } from "../Label";

export type Initial = NodeProps<{
  start: Date;
  active: boolean;
}>;

export const Initial = memo(function Initial(node: Initial) {
  const { editNode } = Nodes.use((state) => ({
    editNode: state.editNode,
  }));

  return (
    <div className="rounded p-3 flex flex-col justify-center items-center gap-3 bg-neutral-800 drop-shadow z-10 border border-white/10">
      <Handle
        type="target"
        position={Position.Right}
        className="!border-none !bg-white !p-1"
      />

      {node.data.active ? (
        <button
          className={`font-medium px-3 py-1 w-full bg-red-800 rounded duration-200 hover:bg-red-900`}
        >
          Cancel generation
        </button>
      ) : (
        <button
          className={`font-medium px-3 py-1 w-full bg-green-800 rounded duration-200 hover:bg-green-900`}
        >
          Begin Generation
        </button>
      )}
    </div>
  );
});
