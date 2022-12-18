/* eslint-disable @next/next/no-img-element */
import { Play, Trash2, Unlock, Lock } from "lucide-react";
import { memo, useEffect } from "react";
import {
  Handle,
  Position,
  NodeProps,
  NodeToolbar,
  getIncomers,
  getConnectedEdges,
  useUpdateNodeInternals,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { Nodes } from ".";
import { Label } from "../Label";
import {
  Output,
  Outputs,
  Panel,
  TextVariable,
  Toolbar,
  ToolButton,
  Variables,
} from "../Node";

export type RegexReplace = NodeProps<{
  locked: boolean;
  running: boolean;
  repeating: boolean;
  input: {
    expression: string;
    replacement: string;
    text: string;
  };
  output: {
    final: string;
  };
}>;

export function RegexReplace(node: RegexReplace) {
  const { editNode, deleteNode, nodes, edges } = Nodes.use((state) => ({
    editNode: state.editNode,
    deleteNode: state.deleteNode,
    nodes: state.nodes,
    edges: state.edges,
  }));

  return (
    <Panel
      name="Regex Replace"
      running={node.data.running}
      selected={node.selected}
    >
      <Toolbar show={node.selected}>
        <ToolButton
          onClick={() =>
            editNode(node.id, {
              locked: !node.data.locked,
            })
          }
          active={node.data.locked}
        >
          {node.data.locked ? <Lock size={16} /> : <Unlock size={16} />}
        </ToolButton>
        <ToolButton onClick={() => deleteNode(node.id)}>
          <Trash2 size={16} />
        </ToolButton>
      </Toolbar>

      <Variables>
        <TextVariable
          name="expression"
          value={node.data.input.expression || ""}
          label="Regular Expression"
          nodeID={node.id}
        />
        <TextVariable
          name="replacement"
          value={node.data.input.replacement || ""}
          label="Replacement"
          nodeID={node.id}
        />
        <TextVariable
          name="text"
          value={node.data.input.text || ""}
          label="Text"
          nodeID={node.id}
        />
      </Variables>

      <Outputs>
        <Output
          label="Result"
          name="final"
          nodeID={node.id}
          type="string"
          value={node.data.output.final}
        />
      </Outputs>
    </Panel>
  );
}

export namespace RegexReplace {
  export async function run(node: Node): Promise<any> {
    return {
      final: node.data.input.text.replace(
        new RegExp(node.data.input.expression, "g"),
        node.data.input.replacement
      ),
    };
  }

  export const Memo = memo(RegexReplace);
}
