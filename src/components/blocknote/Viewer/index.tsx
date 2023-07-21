import {
  type PartialBlock,
  type BlockSchema,
  defaultBlockSchema,
} from "@blocknote/core";
import { useBlockNote, BlockNoteView } from "@blocknote/react";

import { customBlockSchema } from "../blockSchema";
import { slashCommands } from "../slashCommands";

type ViewerProps = {
  initialContent: PartialBlock<BlockSchema>[];
};

export default function Viewer({ initialContent }: ViewerProps) {
  const editor = useBlockNote(
    {
      editable: false,
      initialContent: initialContent ?? [],
      slashCommands,
      blockSchema: {
        ...defaultBlockSchema,
        ...customBlockSchema,
      },
    },
    [initialContent]
  );

  return <BlockNoteView editor={editor} />;
}
