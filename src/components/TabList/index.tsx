import { FaPlus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { type MouseEvent } from "react";
import { type Tab } from "@/types/Tab";

type TabListProps = {
  tabList: Tab[];

  newTab: () => void;
  isCurrentTab: (index: number) => boolean;
  removeTab: (index: number) => (e: MouseEvent<HTMLButtonElement>) => void;
  setTab: (index: number) => () => void;
};

export default function TabList({
  tabList,

  newTab,
  removeTab,
  isCurrentTab,
  setTab,
}: TabListProps) {
  return (
    <div className="hide-scrollbar overflow-x-auto">
      <nav className="tabs w-screen flex-nowrap">
        {tabList.map(({ title }, index) => (
          <div
            tabIndex={0}
            role="button"
            key={index}
            onClick={setTab(index)}
            className={[
              "tab tab-bordered min-w-[150px] flex-1 flex-nowrap justify-between gap-2",
              isCurrentTab(index) ? "tab-active" : "",
            ].join(" ")}
          >
            <span className="truncate">{title || "무제"}</span>

            {tabList.length > 1 && (
              <button
                className="btn btn-square btn-ghost btn-xs"
                onClick={removeTab(index)}
              >
                <FaXmark />
              </button>
            )}
          </div>
        ))}
        <button
          className="btn btn-square btn-ghost btn-sm ml-2"
          onClick={newTab}
        >
          <FaPlus />
        </button>
      </nav>
    </div>
  );
}
