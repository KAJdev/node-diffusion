import {
  Dice2,
  File,
  FileType2,
  ImagePlus,
  Regex,
  TextCursorInput,
  View,
} from "lucide-react";
import { useReactFlow } from "reactflow";

export type Bar = {
  onCreateNode: (newNode: { type: string; data: any; position: any }) => void;
};

export function Bar({ onCreateNode }: Bar) {
  const flow = useReactFlow();

  return (
    <div className="absolute left-[15px] top-[4.75rem] bg-neutral-800 rounded flex flex-col overflow-hidden">
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
            position: flow.project({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            }),
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
            position: flow.project({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            }),
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
            position: flow.project({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            }),
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
            position: flow.project({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            }),
          })
        }
      >
        <TextCursorInput size={18} strokeWidth={2} />
      </Button>
      <Button
        onClick={() =>
          onCreateNode({
            type: "RegexReplace",
            data: {
              input: {
                expression: "",
                replacement: "",
                text: "",
              },
              output: {
                final: "",
              },
            },
            position: flow.project({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            }),
          })
        }
      >
        <Regex size={18} strokeWidth={2} />
      </Button>
      <Button
        onClick={() =>
          onCreateNode({
            type: "LoadImage",
            data: {
              input: {},
              output: {
                image: "",
              },
            },
            position: flow.project({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            }),
          })
        }
      >
        <File size={18} strokeWidth={2} />
      </Button>
      <Button
        onClick={() =>
          onCreateNode({
            type: "Interrogate",
            data: {
              input: {
                image: "",
              },
              output: {
                prompt: "",
              },
            },
            position: flow.project({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            }),
          })
        }
      >
        <View size={18} strokeWidth={2} />
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
      className={`p-2 hover:bg-white/10 active:bg-white/20 duration-200 border-t border-white/10 first-of-type:border-t-transparent ${
        active && "bg-black/10 text-indigo-400"
      }`}
      onClick={onClick ?? undefined}
    >
      {children}
    </button>
  );
}
