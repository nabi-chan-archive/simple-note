import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

export const customBlockSchema = {
  singleLine: createReactBlockSpec({
    type: "singleLine" as const,
    propSchema: {
      ...defaultProps,
    },
    containsInlineContent: false,
    render() {
      return (
        <hr
          style={{
            height: 2,
            boxSizing: "content-box",
            borderTop: "2px dashed black",
          }}
        />
      );
    },
  }),
  doubleLine: createReactBlockSpec({
    type: "doubleLine" as const,
    propSchema: {
      ...defaultProps,
    },
    containsInlineContent: false,
    render() {
      return (
        <hr
          style={{
            height: 2,
            boxSizing: "content-box",
            borderTop: "2px dashed black",
            borderBottom: "2px dashed black",
          }}
        />
      );
    },
  }),
};
