import { type Button } from "@/types/SideMenu";
import { api } from "@/utils/api";
import { useCycle } from "framer-motion";
import { FaPrint } from "react-icons/fa";

export function useSideMenu() {
  const { data: printer } = api.printer.getPrinter.useQuery();
  const [isOpen, toggleOpen] = useCycle(false, true);

  function getSideMenuButtonList() {
    const buttonList: Button[] = [];

    if (printer) {
      buttonList.push({
        title: "프린트하기",
        icon: <FaPrint />,
        onClick: function (): void {
          throw new Error("Function not implemented.");
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
