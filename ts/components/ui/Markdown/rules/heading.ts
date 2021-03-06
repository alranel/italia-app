import * as React from "react";
import { ReactOutput, SingleASTNode, State } from "simple-markdown";

import MarkdownHeading from "../MarkdownHeading";
import { makeReactNativeRule } from "./utils";

function rule() {
  return (
    node: SingleASTNode,
    output: ReactOutput,
    state: State
  ): React.ReactNode => {
    const newState = { ...state, withinHeading: true };
    return React.createElement(
      MarkdownHeading,
      {
        key: state.key,
        level: node.level,
        inMessage: state.screen === "MESSAGE_DETAIL"
      },
      output(node.content, newState)
    );
  };
}

export default makeReactNativeRule(rule());
