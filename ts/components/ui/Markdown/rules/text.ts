import * as React from "react";
import { ReactOutput, SingleASTNode, State } from "simple-markdown";

import MarkdownText from "../MarkdownText";
import { makeReactNativeRule } from "./utils";

function rule() {
  return (
    node: SingleASTNode,
    _: ReactOutput,
    state: State
  ): React.ReactNode => {
    // If we are inside a heading return the plain content
    if (state.withinHeading || state.withinLink) {
      return node.content;
    }

    const words = node.content.split(/[ \n]/);

    return words.map((word: any, i: number) => {
      const text = i !== words.length - 1 ? `${word} ` : word;
      return React.createElement(
        MarkdownText,
        {
          key: i,
          markdown: true,
          inMessage: state.screen === "MESSAGE_DETAIL"
        },
        text
      );
    });
  };
}

export default makeReactNativeRule(rule());
