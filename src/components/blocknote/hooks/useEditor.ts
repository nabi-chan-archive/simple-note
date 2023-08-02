import {
  defaultBlockSchema,
  type BlockNoteEditor,
  type BlockSchema,
} from "@blocknote/core";
import { useBlockNote } from "@blocknote/react";
import { debounce } from "throttle-debounce";

import { api } from "@/utils/api";

import { customBlockSchema } from "../blockSchema";
import { slashCommands } from "../slashCommands";

type useEditorArgs = {
  disabled?: boolean;
  currentTabId: string;
};

export function useEditor(
  { disabled, currentTabId }: useEditorArgs,
  deps: unknown[]
) {
  const { data: initialContent } = api.article.getArticle.useQuery(
    {
      tabId: currentTabId,
    },
    {
      enabled: !!currentTabId,
    }
  );
  const { mutate: updateArticle } = api.article.updateArticle.useMutation();

  const editor = useBlockNote(
    {
      editable: !disabled,
      initialContent: initialContent,
      onEditorContentChange: debounce(
        750,
        (editor: BlockNoteEditor<BlockSchema>) => {
          updateArticle({
            tabId: currentTabId,
            content: editor.topLevelBlocks,
          });
        }
      ),
      slashMenuItems: [...slashCommands],
      blockSchema: {
        ...defaultBlockSchema,
        ...customBlockSchema,
      },
    },
    [initialContent, ...deps]
  );

  return {
    editor,
  };
}
