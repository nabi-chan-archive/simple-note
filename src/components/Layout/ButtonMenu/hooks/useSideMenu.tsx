import ShareModal from "@/components/share/ShareModal";
import SHARE_ATOM from "@/state/SHARE_ATOM";
import TAB_ATOM from "@/state/TAB_ATOM";
import { type Button } from "@/types/SideMenu";
import { api } from "@/utils/api";
import { useCycle } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { FaPrint, FaShare } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import ChannelTalkButton from "@/components/ChannelTalk/ChannelTalkButton";

export function useSideMenu() {
  const { status } = useSession();
  const { asPath } = useRouter();
  const { data: printer } = api.printer.getPrinter.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const { mutate: print } = api.printer.printArticle.useMutation();

  const [isOpen, toggleOpen] = useCycle(false, true);

  const selectedTabId = useAtomValue(TAB_ATOM.selectedTabId);
  const openSharedModal = useSetAtom(SHARE_ATOM.openSharedModal);

  function getSideMenuButtonList() {
    const buttonList: Button[] = [];

    buttonList.push({
      title: "채널톡 열기",
      icon: <BiSupport />,
      customButton: ChannelTalkButton,
      onClick: () => undefined,
    });

    if (status === "authenticated" && asPath === "/notes")
      buttonList.push({
        title: "공유하기",
        icon: <FaShare />,
        onClick: () => openSharedModal({ id: selectedTabId }),
        modal: <ShareModal />,
      });

    if (printer && asPath === "/") {
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

  const modal = (
    <>
      {getSideMenuButtonList().map((button) => (
        <Fragment key={button.title}>{button.modal}</Fragment>
      ))}
    </>
  );

  return {
    isOpen,
    toggleOpen,

    modal,
    buttonList: getSideMenuButtonList(),
  };
}
