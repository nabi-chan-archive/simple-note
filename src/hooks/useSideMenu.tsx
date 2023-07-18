import { type Button } from "@/types/SideMenu";
import { useCycle } from "framer-motion";

export function useSideMenu() {
  const [isOpen, toggleOpen] = useCycle(false, true);

  function getSideMenuButtonList() {
    const buttonList: Button[] = [];

    return buttonList;
  }

  return {
    isOpen,
    toggleOpen,

    buttonList: getSideMenuButtonList(),
  };
}
