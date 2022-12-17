import { FileType2, ImagePlus, Plus } from "lucide-react";
import { Node } from "reactflow";

export type Bar = {
  onCreateNode: (newNode: Node) => void;
};

export function Bar({ onCreateNode }: Bar) {
  return (
    <div className="absolute bottom-[15px] left-[50%] -translate-x-[50%] bg-neutral-800 rounded flex flex-row overflow-hidden">
      <Button
        onClick={() =>
          onCreateNode({
            id: Math.random().toString(),
            position: { x: 100, y: 100 },
            type: "Initial",
            data: {},
          })
        }
      >
        <Plus size={18} strokeWidth={2} />
      </Button>
      <Button
        onClick={() =>
          onCreateNode({
            id: Math.random().toString(),
            position: { x: 100, y: 100 },
            type: "Image",
            data: {
              url: "https://place.dog/512/512",
              prompt: "a dog",
              steps: 30,
              cfg_scale: 7,
            },
          })
        }
      >
        <ImagePlus size={18} strokeWidth={2} />
      </Button>
      <Button
        onClick={() =>
          onCreateNode({
            id: Math.random().toString(),
            position: { x: 100, y: 100 },
            type: "Transformer",
            data: {
              prompt: "a dog",
              temperature: 30,
              prediction: "",
            },
          })
        }
      >
        <FileType2 size={18} strokeWidth={2} />
      </Button>
    </div>
  );
}

function Button({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={`p-2 hover:bg-white/10 active:bg-white/20 duration-200 border-r border-white/10 first-of-type:border-l-transparent last-of-type:border-r-transparent ${
        active && "bg-black/10 text-indigo-400"
      }`}
      onClick={onClick ?? undefined}
    >
      {children}
    </button>
  );
}
