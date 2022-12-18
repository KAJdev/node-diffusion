import { Dice2, FileType2, ImagePlus, TextCursorInput } from "lucide-react";

export type Bar = {
  onCreateNode: (newNode: { type: string; data: any }) => void;
};

export function Bar({ onCreateNode }: Bar) {
  return (
    <div className="absolute bottom-[15px] left-[50%] -translate-x-[50%] bg-neutral-800 rounded flex flex-row overflow-hidden">
      <Button
        onClick={() =>
          onCreateNode({
            type: "Image",
            data: {
              input: {
                init: "",
                prompt: "",
                steps: 30,
                cfg_scale: 7,
              },
              output: {
                image: "",
              },
            },
          })
        }
      >
        <ImagePlus size={18} strokeWidth={2} />
      </Button>
      <Button
        onClick={() =>
          onCreateNode({
            type: "Transformer",
            data: {
              input: {
                prompt: "",
                temperature: 0,
                top_p: 0,
                frequency_penalty: 0,
              },
              output: {
                prediction: "",
              },
            },
          })
        }
      >
        <FileType2 size={18} strokeWidth={2} />
      </Button>
      <Button
        onClick={() =>
          onCreateNode({
            type: "RandomNumber",
            data: {
              input: {
                min: 0,
                max: 1,
              },
              output: {
                number: 0.5,
              },
            },
          })
        }
      >
        <Dice2 size={18} strokeWidth={2} />
      </Button>
      <Button
        onClick={() =>
          onCreateNode({
            type: "Concat",
            data: {
              input: {
                first: "",
                second: "",
              },
              output: {
                final: "",
              },
            },
          })
        }
      >
        <TextCursorInput size={18} strokeWidth={2} />
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
