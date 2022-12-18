import { Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  getConnectedEdges,
  Handle,
  NodeToolbar,
  Position,
  useUpdateNodeInternals,
} from "reactflow";
import { Label } from "./Label";
import { Nodes } from "./Nodes";

export function Panel({
  children,
  name,
  running,
  selected,
}: {
  children?: React.ReactNode;
  name: string;
  running?: boolean;
  selected?: boolean;
}) {
  return (
    <div
      className={`rounded flex flex-col bg-neutral-800 w-[20rem] z-10 ${
        running
          ? "border-animate drop-shadow-2xl animate-pulse duration-150"
          : selected
          ? "ring"
          : "ring-[1px] ring-white/20 drop-shadow"
      }`}
    >
      <div className="p-2 border-b border-white/10">
        <h1 className="opacity-80 font-medium">{name}</h1>
      </div>
      {children}
    </div>
  );
}

export function Variables({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col mt-2">
      <div className="bg-white/5 px-2 py-1">
        <h2 className="font-medium">Variables</h2>
      </div>
      <div className="p-2 flex flex-col gap-2">{children}</div>
    </div>
  );
}

export function Outputs({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col mt-2">
      <div className="bg-white/5 px-2 py-1">
        <h2 className="font-medium">Outputs</h2>
      </div>
      <div className="p-2 flex flex-col gap-2">{children}</div>
    </div>
  );
}

export function Content({ children }: { children?: React.ReactNode }) {
  return <div className="p-2 flex flex-col gap-2 relative">{children}</div>;
}

export function Toolbar({
  children,
  show,
}: {
  children?: React.ReactNode;
  show: boolean;
}) {
  return (
    <NodeToolbar isVisible={show}>
      <div className="bg-neutral-800 rounded flex flex-row overflow-hidden">
        {children}
      </div>
    </NodeToolbar>
  );
}

export function ToolButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-2 hover:bg-white/10 active:bg-white/20 ${
        active && "bg-white/10"
      } text-white/80 duration-200 border-r border-white/10 first-of-type:border-l-transparent last-of-type:border-r-transparent`}
    >
      {children}
    </button>
  );
}

export function NumberVariable({
  value,
  nodeID,
  label,
  name,
}: {
  value: number;
  nodeID: string;
  label: string;
  name: string;
}) {
  const { nodes, editNode, edges } = Nodes.use((state) => {
    return {
      nodes: state.nodes,
      editNode: state.editNode,
      edges: state.edges,
    };
  });

  const node = nodes.find((node) => node.id === nodeID);

  const updateNodeInternals = useUpdateNodeInternals();

  const labelRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (labelRef.current && handleRef.current) {
      // move the location of the handle to be relative to the label
      handleRef.current.style.position = "abolute";
      handleRef.current.style.top = `0.6rem`;
      handleRef.current.style.left = `-1rem`;

      // update the node internals
      updateNodeInternals(nodeID);
    }
  }, [labelRef, handleRef, updateNodeInternals, nodeID]);

  // get connections
  const edgeConnections = node ? getConnectedEdges([node], edges) : [];

  // check if its connected
  const isConnected =
    edgeConnections.find(
      (edge) => edge.targetHandle === `input-${name}` && edge.target === nodeID
    ) !== undefined;

  return (
    <div
      className="flex flex-row gap-1 justify-between items-center text-sm relative"
      ref={labelRef}
    >
      <Label>
        <Handle
          type="target"
          position={Position.Left}
          className={`!bg-transparent !border-[2px] !border-white !w-[12px] !h-[12px] !p-[1px] flex items-center justify-center`}
          ref={handleRef}
          id={`input-${name}`}
        >
          {isConnected && (
            <div className="w-full h-full rounded-full bg-white" />
          )}
        </Handle>
        {label}
      </Label>
      <input
        type="number"
        value={value}
        className={`px-1 py-[1px] rounded w-1/2 nodrag bg-neutral-900/50 focus:outline-none focus:border-indigo-500/50 border-[2px] ${
          isConnected
            ? "bg-transparent resize-none border-white/10 border"
            : "bg-neutral-900/50 border-transparent border-[2px]"
        }`}
        disabled={isConnected}
        onChange={(e) => {
          if (node) {
            editNode(nodeID, {
              input: {
                ...node.data.input,
                [name]: Number(e.target.value),
              },
            });
          }
        }}
      />
    </div>
  );
}

export function TextVariable({
  value,
  nodeID,
  label,
  name,
}: {
  value: string;
  nodeID: string;
  label: string;
  name: string;
}) {
  const { nodes, editNode, edges } = Nodes.use((state) => {
    return {
      nodes: state.nodes,
      editNode: state.editNode,
      edges: state.edges,
    };
  });

  const node = nodes.find((node) => node.id === nodeID);

  const updateNodeInternals = useUpdateNodeInternals();

  const labelRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (labelRef.current && handleRef.current) {
      // move the location of the handle to be relative to the label
      handleRef.current.style.position = "abolute";
      handleRef.current.style.top = `0.6rem`;
      handleRef.current.style.left = `-1rem`;

      // update the node internals
      updateNodeInternals(nodeID);
    }
  }, [labelRef, handleRef, updateNodeInternals, nodeID]);

  useEffect(() => {
    if (textareaRef.current) {
      const styles = window.getComputedStyle(textareaRef.current);
      textareaRef.current.style.height = "auto";

      const newHeight =
        textareaRef.current.scrollHeight +
        parseInt(styles.paddingTop) +
        parseInt(styles.paddingBottom);

      textareaRef.current.style.height = newHeight + "px";
    }
  }, [value, textareaRef]);

  // get connections
  const edgeConnections = node ? getConnectedEdges([node], edges) : [];

  // check if its connected
  const isConnected =
    edgeConnections.find(
      (edge) => edge.targetHandle === `input-${name}` && edge.target === nodeID
    ) !== undefined;

  return (
    <div
      className="flex flex-col gap-1 justify-between text-sm relative"
      ref={labelRef}
    >
      <Label>
        <Handle
          type="target"
          position={Position.Left}
          className={`!bg-transparent !border-[2px] !border-white !w-[12px] !h-[12px] !p-[1px] flex items-center justify-center`}
          ref={handleRef}
          id={`input-${name}`}
        >
          {isConnected && (
            <div className="w-full h-full rounded-full bg-white" />
          )}
        </Handle>
        {label}
      </Label>
      <textarea
        ref={textareaRef}
        className={`px-1 py-[1px] rounded nodrag overflow-y-hidden ${
          isConnected
            ? "bg-transparent resize-none border-white/10 border"
            : "bg-neutral-900/50 border-transparent border-[2px]"
        } focus:outline-none focus:border-indigo-500/50`}
        value={value}
        disabled={isConnected}
        onChange={(e) => {
          if (node) {
            editNode(nodeID, {
              input: {
                ...node.data.input,
                [name]: e.target.value,
              },
            });
          }
        }}
      />
    </div>
  );
}

export function ImageVariable({
  nodeID,
  label,
  name,
}: {
  nodeID: string;
  label: string;
  name: string;
}) {
  const { nodes, editNode, edges } = Nodes.use((state) => {
    return {
      nodes: state.nodes,
      editNode: state.editNode,
      edges: state.edges,
    };
  });

  const node = nodes.find((node) => node.id === nodeID);

  const updateNodeInternals = useUpdateNodeInternals();

  const labelRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (labelRef.current && handleRef.current) {
      // move the location of the handle to be relative to the label
      handleRef.current.style.position = "abolute";
      handleRef.current.style.top = `0.6rem`;
      handleRef.current.style.left = `-1rem`;

      // update the node internals
      updateNodeInternals(nodeID);
    }
  }, [labelRef, handleRef, updateNodeInternals, nodeID]);

  // get connections
  const edgeConnections = node ? getConnectedEdges([node], edges) : [];

  // check if its connected
  const isConnected =
    edgeConnections.find(
      (edge) => edge.targetHandle === `input-${name}` && edge.target === nodeID
    ) !== undefined;

  return (
    <div
      className="flex flex-row gap-1 justify-between items-center text-sm relative"
      ref={labelRef}
    >
      <Label>
        <Handle
          type="target"
          position={Position.Left}
          className={`!bg-transparent !border-[2px] !border-white !w-[12px] !h-[12px] !p-[1px] flex items-center justify-center`}
          ref={handleRef}
          id={`input-${name}`}
        >
          {isConnected && (
            <div className="w-full h-full rounded-full bg-white" />
          )}
        </Handle>
        {label}
      </Label>
    </div>
  );
}

export function Output({
  nodeID,
  label,
  name,
  type,
  value,
}: {
  nodeID: string;
  label: string;
  name: string;
  type: string;
  value?: any;
}) {
  const { nodes, editNode } = Nodes.use((state) => {
    return {
      nodes: state.nodes,
      editNode: state.editNode,
    };
  });

  const node = nodes.find((node) => node.id === nodeID);

  const updateNodeInternals = useUpdateNodeInternals();

  const labelRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (labelRef.current && handleRef.current) {
      // move the location of the handle to be relative to the label
      handleRef.current.style.position = "abolute";
      handleRef.current.style.top = `0.6rem`;
      handleRef.current.style.left = `${labelRef.current.offsetWidth - 10}px`;

      // update the node internals
      updateNodeInternals(nodeID);
    }
  }, [labelRef, handleRef, updateNodeInternals, nodeID]);

  return (
    <div
      className="flex flex-col gap-1 justify-between text-sm relative"
      ref={labelRef}
    >
      <Label>
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-white !border-none !p-1.5"
          ref={handleRef}
          id={`output-${name}`}
        />
        {label}{" "}
        {type && (
          <span className="text-xs text-neutral-400 bg-black/10 rounded px-1 py-0.5 border border-white/5 ml-1">
            {type}
          </span>
        )}
      </Label>
      {value && (
        <div className="text-xs border border-white/5 rounded p-1 text-white/75 break-all">
          {value.toString().replace(/^[\r\n\s]+|[\r\n\s]+$/g, "")}
        </div>
      )}
    </div>
  );
}
