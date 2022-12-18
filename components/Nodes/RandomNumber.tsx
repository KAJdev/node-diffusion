/* eslint-disable @next/next/no-img-element */
import { Dice2, Trash2, Lock, Unlock } from "lucide-react";
import { memo } from "react";
import { Handle, Position, NodeProps, NodeToolbar, Node } from "reactflow";
import "reactflow/dist/style.css";
import { Nodes } from ".";
import { Label } from "../Label";

import {
  NumberVariable,
  Output,
  Outputs,
  Panel,
  Toolbar,
  ToolButton,
  Variables,
} from "../Node";

export type RandomNumber = NodeProps<{
  locked: boolean;
  running: boolean;
  repeating: boolean;
  input: {
    min: number;
    max: number;
  };
  output: {
    number: number;
  };
}>;

export function RandomNumber(node: RandomNumber) {
  const { editNode, deleteNode } = Nodes.use((state) => ({
    editNode: state.editNode,
    deleteNode: state.deleteNode,
  }));

  return (
    <Panel
      name="Random Number"
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
        <NumberVariable
          label="Min"
          value={node.data.input.min || 0}
          nodeID={node.id}
          name="min"
        />
        <NumberVariable
          label="Max"
          value={node.data.input.max || 1}
          nodeID={node.id}
          name="max"
        />
      </Variables>

      <Outputs>
        <Output label="Number" nodeID={node.id} name="number" type="float" />
      </Outputs>
    </Panel>
  );
}

export namespace RandomNumber {
  export async function run(node: Node): Promise<any> {
    const { min, max } = node.data.input;
    return {
      number: Math.random() * (max - min) + min,
    };
  }

  export const Memo = memo(RandomNumber);
}
