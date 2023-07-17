import { api } from "@/utils/api";
import {
  useState,
  type ChangeEvent,
  type MouseEvent,
  useMemo,
  useEffect,
} from "react";

export function useTabList() {
  const lastSelectedTab = globalThis.localStorage?.getItem("lastSelectedTab");

  const trpc = api.useContext();

  const { isLoading, data: dataTabList } = api.tab.getTabList.useQuery();
  const invalidateTabListWhenApiSuccess = {
    onSuccess: () => void trpc.tab.getTabList.invalidate(),
  };

  const { mutate: createTabAsync } = api.tab.createTab.useMutation(
    invalidateTabListWhenApiSuccess
  );
  const { mutate: removeTabAsync } = api.tab.removeTab.useMutation(
    invalidateTabListWhenApiSuccess
  );
  const { mutate: renameTabAsync } = api.tab.renameTab.useMutation(
    invalidateTabListWhenApiSuccess
  );

  const tabList = useMemo(() => {
    return dataTabList ?? [];
  }, [dataTabList]);

  const [currentTabIndex, setCurrentTabIndex] = useState(
    lastSelectedTab ? Number(lastSelectedTab) : 0
  );

  const currentTab = tabList[currentTabIndex];

  const setCurrentTab = (index: number) => {
    globalThis?.localStorage.setItem("lastSelectedTab", String(index));
    setCurrentTabIndex(index);
  };

  const newTab = () => {
    createTabAsync({ title: "무제" });
    setCurrentTab(tabList.length);
  };

  const renameTab =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const currentItem = tabList[index];
      if (!currentItem) throw new Error("Unexpected TabItem");
      renameTabAsync({ id: currentItem.id, title: event.target.value });
    };

  const removeTab = (index: number) => (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const currentItem = tabList[index];
    if (!currentItem) throw new Error("Unexpected TabItem");
    removeTabAsync({ id: currentItem.id });
    setCurrentTab(currentTabIndex - 1 < 0 ? 0 : currentTabIndex - 1);
  };

  const setTab = (index: number) => () => {
    setCurrentTab(index);
  };

  const isCurrentTab = (index: number) => {
    return index === currentTabIndex;
  };

  useEffect(() => {
    if (dataTabList?.length === 0) {
      createTabAsync({ title: "무제" });
    }
  }, [createTabAsync, dataTabList?.length]);

  return {
    isLoading,

    tabList,
    currentTab,
    currentTabIndex,

    newTab,
    renameTab,
    removeTab,
    setTab,
    isCurrentTab,
  };
}
