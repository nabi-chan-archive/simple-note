import { useEditor } from "@/hooks/useEditor";
import { api } from "@/utils/api";
import { BlockNoteView } from "@blocknote/react";
import { type Tab } from "@/types/Tab";
import { type ChangeEvent, useState } from "react";

type EditorProps = {
  currentTab: Tab;
};

export default function Editor({ currentTab }: EditorProps) {
  const trpc = api.useContext();

  const [beforeTab, setBeforeTab] = useState<Tab | null>(null);
  const [title, setTitle] = useState(currentTab.title);

  const { editor } = useEditor({ currentTabId: currentTab.id }, []);
  const { mutateAsync: updateTitle } = api.tab.renameTab.useMutation();

  if (!beforeTab || beforeTab.id !== currentTab.id) {
    setTitle(currentTab.title);
    setBeforeTab(currentTab);
  }

  const updateTabName = async (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    await updateTitle({ id: currentTab.id, title: e.target.value || "무제" });
    await trpc.tab.getTabList.invalidate();
  };

  return (
    <div className="-mx-4 flex flex-col gap-2 pb-24">
      <input
        type="text"
        className="input input-ghost w-full text-2xl font-bold"
        placeholder="제목을 입력해주세요"
        value={title}
        onChange={(e) => void updateTabName(e)}
      />
      <div className="px-4">
        <BlockNoteView editor={editor} />
      </div>
    </div>
  );
}
