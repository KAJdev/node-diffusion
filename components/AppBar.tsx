import { Save } from "lucide-react";

export function AppBar() {
  return (
    <div className="bg-neutral-900 h-14 border-b border-white/5 w-screen flex flex-row justify-between items-center p-2 px-4">
      <div className="w-1/3"></div>
      <div className="w-1/3 flex justify-center items-center">
        <input
          className="bg-transparent hover:bg-neutral-800 focus:outline-none focus:bg-neutral-800 text-sm text-white duration-100 text-center rounded outline-none px-2 py-1 w-min"
          placeholder="project name"
          defaultValue={"Untitled"}
        />
      </div>
      <div className="w-1/3 flex flex-row items-center justify-end">
        <button className="bg-neutral-800 p-2 rounded text-neutral-400">
          <Save size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
