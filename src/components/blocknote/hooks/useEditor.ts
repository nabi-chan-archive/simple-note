import {
  type BlockNoteEditor,
  type BlockSchema,
  defaultBlockSchema,
} from "@blocknote/core";
import { useBlockNote } from "@blocknote/react";
import { debounce } from "throttle-debounce";

import { customBlockSchema } from "@/components/blocknote/blockSchema";
import { slashCommands } from "@/components/blocknote/slashCommands";
import { api } from "@/utils/api";

type useEditorArgs = {
  currentTabId: string;
};

export function useEditor({ currentTabId }: useEditorArgs, deps: unknown[]) {
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
      initialContent: initialContent ?? [],
      onEditorContentChange: debounce(
        750,
        (editor: BlockNoteEditor<BlockSchema>) => {
          updateArticle({
            tabId: currentTabId,
            content: editor.topLevelBlocks,
          });
        }
      ),
      slashCommands,
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
