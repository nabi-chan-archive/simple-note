import { atom } from "jotai";

import { type Tab } from "@/types/Tab";

const tabList = atom<Tab[]>([]);
tabList.debugLabel = "tabList";

const selectedTabId = atom<string>("");
selectedTabId.debugLabel = "selectedTabId";

const TAB_ATOM = {
  tabList,
  selectedTabId,
};
export default TAB_ATOM;
