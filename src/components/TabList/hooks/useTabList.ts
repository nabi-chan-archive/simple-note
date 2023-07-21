import cuid from "cuid";
import { useAtom } from "jotai";
import {
  type ChangeEvent,
  type MouseEvent,
  useEffect,
  useCallback,
  useState,
} from "react";
import { toast } from "react-toastify";

import TAB_ATOM from "@/state/TAB_ATOM";
import { type Tab } from "@/types/Tab";
import { api } from "@/utils/api";

export function useTabList() {
  const lastSelectedTab = globalThis.localStorage?.getItem("lastSelectedTab");

  const trpc = api.useContext();

  const [isFirstTabCreated, setIsFirstTabCreated] = useState(false);
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

  const newTab = useCallback(() => {
    const id = cuid();
    createTabAsync(
      { id, title: "무제", order: tabList.length },
      {
        onSuccess: () => {
          setTabList((prev) => {
            const newArray = [...prev, { id, title: "무제" }];
            setCurrentTab(newArray[newArray.length - 1]);
            return newArray;
          });

          toast.success("새 탭이 생성되었어요.");
        },
      }
    );
  }, [createTabAsync, setCurrentTab, setTabList, tabList.length]);

  useEffect(() => {
    if (dataTabList && !dataTabList?.length && !isFirstTabCreated) {
      setIsFirstTabCreated(true);
      newTab();
    }
  }, [dataTabList, isFirstTabCreated, newTab]);

  const renameTab = (id: string) => (event: ChangeEvent<HTMLInputElement>) => {
    renameTabAsync({ id, title: event.target.value });
  };

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

  const isCurrentTab = useCallback(
    (id: string) => {
      return id === currentTabId;
    },
    [currentTabId]
  );

  if (!currentTabId && lastSelectedTab && dataTabList?.length) {
    if (!dataTabList.find(({ id }) => id === lastSelectedTab)) {
      setCurrentTab(dataTabList[0]);
    } else {
      setCurrentTabId(lastSelectedTab);
    }
  }

  if (!currentTabId && !lastSelectedTab && dataTabList?.length) {
    setCurrentTab(dataTabList[0]);
  }

  useEffect(() => {
    setTabList(dataTabList ?? []);
  }, [dataTabList, setTabList]);

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
