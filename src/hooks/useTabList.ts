import { type Tab } from "@/types/Tab";
import { useState, type ChangeEvent, type MouseEvent } from "react";

export function useTabList() {
  const lastSelectedTab = globalThis.localStorage?.getItem("lastSelectedTab");
  const initialTabList = globalThis.localStorage?.getItem("tabList");

  const [tabList, setTabList] = useState<Tab[]>(() =>
    initialTabList ? (JSON.parse(initialTabList) as Tab[]) : [{ title: "무제" }]
  );
  const [currentTabIndex, setCurrentTabIndex] = useState(
    lastSelectedTab ? Number(lastSelectedTab) : 0
  );

  const currentTab = tabList[currentTabIndex];

  const setCurrentTab = (index: number) => {
    // globalThis?.localStorage.setItem("lastSelectedTab", String(index));
    setCurrentTabIndex(index);
  };

  const newTab = () => {
    setTabList((tabs) => {
      const newTab = [...tabs, { title: "" }];
      // globalThis.localStorage.setItem("tabList", JSON.stringify(newTab));
      return newTab;
    });
    setCurrentTab(tabList.length);
  };

  const renameTab =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      setTabList((tabList) => {
        const newTabList = [...tabList];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        newTabList[index]!.title = event.target.value;

        // globalThis.localStorage.setItem("tabList", JSON.stringify(newTabList));
        return newTabList;
      });
    };

  const removeTab = (index: number) => (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setTabList((tabList) => {
      const newTabList = [...tabList];
      newTabList.splice(index, 1);

      // globalThis.localStorage.setItem("tabList", JSON.stringify(newTabList));
      return newTabList;
    });
    setCurrentTab(currentTabIndex - 1 < 0 ? 0 : currentTabIndex - 1);
  };

  const setTab = (index: number) => () => {
    setCurrentTab(index);
  };

  const isCurrentTab = (index: number) => {
    return index === currentTabIndex;
  };

  if (!initialTabList) {
    // globalThis.localStorage?.setItem("tabList", JSON.stringify(tabList));
  }

  return {
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
