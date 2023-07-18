import { FaPlus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { type MouseEvent } from "react";
import { type Tab } from "@/types/Tab";

type TabListProps = {
  tabList: Tab[];

  newTab: () => void;
  isCurrentTab: (id: string) => boolean;
  removeTab: (id: string) => (e: MouseEvent<HTMLButtonElement>) => void;
  setTab: (id: string) => () => void;
};

export default function TabList({
  tabList,

  newTab,
  removeTab,
  isCurrentTab,
  setTab,
}: TabListProps) {
  return (
    <nav className="hide-scrollbar tabs w-full flex-nowrap overflow-x-auto">
      {tabList.map(({ title, id }) => {
        return (
          <div
            tabIndex={0}
            role="button"
            key={id}
            onClick={setTab(id)}
            className={[
              "tab tab-bordered min-w-[150px] flex-1 flex-nowrap justify-between gap-2",
              tabList.length === 1 || isCurrentTab(id) ? "tab-active" : "",
            ].join(" ")}
          >
            <span className="truncate">{title || "무제"}</span>

            {tabList.length > 1 && (
              <button
                className="btn btn-square btn-ghost btn-xs"
                onClick={(e) => void removeTab(id)(e)}
              >
                <FaXmark />
              </button>
            )}
          </div>
        );
      })}
      <button
        className="btn btn-square btn-ghost btn-sm ml-2"
        onClick={() => void newTab()}
      >
        <FaPlus />
      </button>
    </nav>
  );
}
