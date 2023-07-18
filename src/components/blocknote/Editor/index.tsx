import { useEditor } from "@/hooks/useEditor";
import { BlockNoteView } from "@blocknote/react";

type EditorProps = {
  currentTabId: string;
};

export default function Editor({ currentTabId }: EditorProps) {
  const { editor } = useEditor({ currentTabId }, []);

  return <BlockNoteView editor={editor} />;
}
