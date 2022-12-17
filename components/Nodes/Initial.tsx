/* eslint-disable @next/next/no-img-element */
import { Trash2 } from "lucide-react";
import { memo } from "react";
import { Handle, Position, NodeProps, NodeToolbar } from "reactflow";
import "reactflow/dist/style.css";
import { Nodes } from ".";
import { Label } from "../Label";

export type Initial = NodeProps<{
  start: Date;
  active: boolean;
}>;

export const Initial = memo(function Initial(node: Initial) {
  const { editNode, deleteNode } = Nodes.use((state) => ({
    editNode: state.editNode,
    deleteNode: state.deleteNode,
  }));

  return (
    <div className="rounded p-3 flex flex-col justify-center items-center gap-3 bg-neutral-800 drop-shadow z-10 border border-white/10">
      <Handle
        type="target"
        position={Position.Right}
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
