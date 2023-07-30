import { useAtom } from "jotai";
import { type MouseEvent, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import TAB_ATOM from "@/state/TAB_ATOM";
import { type Tab } from "@/types/Tab";
import { api } from "@/utils/api";

export function useSavedTabList() {
  const trpc = api.useContext();

  const { isLoading, data: dataTabList } = api.tab.savedList.useQuery();
  const invalidateTabListWhenApiSuccess = {
    onSuccess: () => void trpc.tab.getTabList.invalidate(),
  };

  const { mutate: removeTabAsync } = api.tab.removeTab.useMutation(
    invalidateTabListWhenApiSuccess
  );

  const [tabList, setTabList] = useAtom(TAB_ATOM.tabList);
  const [currentTabId, setCurrentTabId] = useAtom(TAB_ATOM.selectedTabId);

  const getIndexFromTabId = (id: string) => {
    return tabList.findIndex((item) => item.id === id) ?? -1;
  };

  const getTabFromId = (id: string) => {
    return tabList.find((item) => item.id === id) as Tab;
  };

  const currentTab = getTabFromId(currentTabId) ?? (tabList[0] as Tab);

  const setCurrentTab = useCallback(
    (tab?: Tab) => {
      if (!tab) throw new Error("No Tab!");
      globalThis?.localStorage.setItem("lastSelectedTab", tab.id);
      setCurrentTabId(tab.id);
    },
    [setCurrentTabId]
  );

  useEffect(() => {
    if (currentTab || !dataTabList?.length) return;
    setCurrentTab(dataTabList[0]);
  }, [currentTab, dataTabList, setCurrentTab]);

  const removeTab = (id: string) => (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const index = getIndexFromTabId(id) ?? 0;

    removeTabAsync(
      { id },
      {
        onSuccess: () => {
          setTabList((prev) => {
            const newArray = prev.filter((item) => item.id !== id);
            setCurrentTab(index - 1 < 0 ? newArray[0] : newArray[index - 1]);
            return newArray;
          });

          toast.success("탭이 삭제되었어요.");
        },
      }
    );
  };

  const setTab = (id: string) => () => {
    setCurrentTab(getTabFromId(id));
  };

  useEffect(() => {
    setTabList(dataTabList ?? []);
  }, [dataTabList, setTabList]);

  return {
    isLoading,

    tabList,
    currentTab,
    currentTabId,

    removeTab,
    setTab,
  };
}
