import { useAtomValue } from "jotai";

import CHANNEL_ATOM from "@/state/CHANNEL_ATOM";
import { type CustomButtonProps } from "@/types/SideMenu";

export default function ChannelTalkButton({
  btnClassName,
  children,
}: CustomButtonProps) {
  const unReadCount = useAtomValue(CHANNEL_ATOM.unReadMessageCount);

  return (
    <div className="indicator">
      {unReadCount ? (
        <span className="badge indicator-item badge-primary right-[3px] top-[3px] h-3 w-3 px-0" />
      ) : null}
      <button id="open-channel-talk" className={btnClassName}>
        {children}
      </button>
    </div>
  );
}
