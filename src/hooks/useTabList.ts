import { type Tab } from "@/types/Tab";
import { api } from "@/utils/api";
import { useState, type ChangeEvent, type MouseEvent, useEffect } from "react";
import cuid from "cuid";
import { useAtom } from "jotai";
import TAB_ATOM from "@/state/TAB_ATOM";

export function useTabList() {
  const lastSelectedTab = globalThis.localStorage?.getItem("lastSelectedTab");

  const trpc = api.useContext();

  const { isLoading, data: dataTabList } = api.tab.getTabList.useQuery();
  const invalidateTabListWhenApiSuccess = {
    onSuccess: () => void trpc.tab.getTabList.invalidate(),
  };

  const { mutateAsync: createTabAsync } = api.tab.createTab.useMutation(
    invalidateTabListWhenApiSuccess
  );
  const { mutateAsync: removeTabAsync } = api.tab.removeTab.useMutation(
    invalidateTabListWhenApiSuccess
  );
  const { mutateAsync: renameTabAsync } = api.tab.renameTab.useMutation(
    invalidateTabListWhenApiSuccess
  );


  useEffect(() => {
    setTabList(dataTabList ?? []);
  }, [dataTabList]);
  const [tabList, setTabList] = useAtom(TAB_ATOM.tabList);
  const [currentTabId, setCurrentTabId] = useAtom(TAB_ATOM.selectedTabId);

  const getIndexFromTabId = (id: string) => {
    return tabList.findIndex((item) => item.id === id) ?? -1;
  };

  const getTabFromId = (id: string) => {
    return tabList.find((item) => item.id === id) as Tab;
  };

  const currentTab = getTabFromId(currentTabId) ?? (tabList[0] as Tab);

  const setCurrentTab = (tab?: Tab) => {
    if (!tab) throw new Error("No Tab!");
    globalThis?.localStorage.setItem("lastSelectedTab", tab.id);
    setCurrentTabId(tab.id);
  };

  const newTab = async () => {
    const id = cuid();
    await createTabAsync({ id, title: "무제" });
    setTabList((prev) => {
      const newArray = [...prev, { id, title: "무제" }];
      setCurrentTab(newArray[newArray.length - 1]);
      return newArray;
    });
  };

  const renameTab =
    (id: string) => async (event: ChangeEvent<HTMLInputElement>) => {
      await renameTabAsync({ id, title: event.target.value });
    };

  const removeTab =
    (id: string) => async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const index = getIndexFromTabId(id) ?? 0;

      await removeTabAsync({ id });
      setTabList((prev) => {
        const newArray = prev.filter((item) => item.id !== id);
        setCurrentTab(index - 1 < 0 ? newArray[0] : newArray[index - 1]);
        return newArray;
      });
    };

  const setTab = (id: string) => () => {
    setCurrentTab(getTabFromId(id));
  };

  const isCurrentTab = (id: string) => {
    return id === currentTabId;
  };

  useEffect(() => {
    if (dataTabList?.length === 0) {
      void createTabAsync({ title: "무제" });
    }
  }, [createTabAsync, dataTabList?.length]);

  return {
    isLoading,

    tabList,
    currentTab,
    currentTabId,

    newTab,
    renameTab,
    removeTab,
    setTab,
    isCurrentTab,
  };
}
