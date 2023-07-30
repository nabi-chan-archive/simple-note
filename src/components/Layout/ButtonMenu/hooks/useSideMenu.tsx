import { useCycle } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import { BiSupport } from "react-icons/bi";
import { FaPrint, FaSave, FaShare } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";
import { toast } from "react-toastify";

import ChannelTalkButton from "@/components/ChannelTalk/ChannelTalkButton";
import ShareModal from "@/components/share/ShareModal";
import SHARE_ATOM from "@/state/SHARE_ATOM";
import TAB_ATOM from "@/state/TAB_ATOM";
import { type Button } from "@/types/SideMenu";
import { api } from "@/utils/api";

export function useSideMenu() {
  const { status } = useSession();
  const { asPath } = useRouter();
  const trpc = api.useContext();
  const { data: printer } = api.printer.getPrinter.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const { mutate: print, isLoading: isPrinting } =
    api.printer.printArticle.useMutation();
  const { mutate: save } = api.article.save.useMutation();

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

    if (printer && (asPath === "/notes" || asPath === "/notes/saved")) {
      buttonList.push({
        disabled: isPrinting,
        title: "프린트하기",
        icon: <FaPrint />,
        onClick: function (): void {
          print({ id: selectedTabId });
        },
      });
    }

    if (asPath === "/notes") {
      buttonList.push({
        title: "보관하기",
        icon: <FaSave />,
        onClick: function (): void {
          save(
            { tabId: selectedTabId, isSaved: true },
            {
              onSuccess: () => {
                toast.success("보관함에 저장되었습니다.");
                void trpc.tab.getTabList.invalidate();
              },
            }
          );
        },
      });
    }

    if (asPath === "/notes/saved") {
      buttonList.push({
        title: "보관 해제하기",
        icon: <FaUpload />,
        onClick: function (): void {
          save(
            { tabId: selectedTabId, isSaved: false },
            {
              onSuccess: () => {
                toast.success("노트로 이동되었습니다.");
                void trpc.tab.savedList.invalidate();
              },
            }
          );
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
