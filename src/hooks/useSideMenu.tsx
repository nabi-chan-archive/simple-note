import TAB_ATOM from "@/state/TAB_ATOM";
import { type Button } from "@/types/SideMenu";
import { api } from "@/utils/api";
import { useCycle } from "framer-motion";
import { useAtomValue } from "jotai";
import { FaPrint } from "react-icons/fa";

export function useSideMenu() {
  const { data: printer } = api.printer.getPrinter.useQuery();
  const { mutate: print } = api.printer.printArticle.useMutation();
  const selectedTabId = useAtomValue(TAB_ATOM.selectedTabId);
  const [isOpen, toggleOpen] = useCycle(false, true);

  function getSideMenuButtonList() {
    const buttonList: Button[] = [];

    if (printer) {
      buttonList.push({
        title: "프린트하기",
        icon: <FaPrint />,
        onClick: function (): void {
          print({ id: selectedTabId });
        },
      });
    }

    return buttonList;
  }

  return {
    isOpen,
    toggleOpen,

    buttonList: getSideMenuButtonList(),
  };
}
