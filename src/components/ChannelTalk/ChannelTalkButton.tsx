import { useAtomValue, useSetAtom } from "jotai";
import { useChannelIOApi, useChannelIOEvent } from "react-channel-plugin";

import CHANNEL_ATOM from "@/state/CHANNEL_ATOM";
import { type CustomButtonProps } from "@/types/SideMenu";

export default function ChannelTalkButton({
  btnClassName,
  children,
}: CustomButtonProps) {
  const unReadCount = useAtomValue(CHANNEL_ATOM.unReadMessageCount);
  const { showMessenger } = useChannelIOApi();

  const updateUnRead = useSetAtom(CHANNEL_ATOM.unReadMessageCount);

  useChannelIOEvent("onBadgeChanged", (data) => {
    updateUnRead(data);
  });

  return (
    <div className="indicator">
      {unReadCount ? (
        <span className="badge indicator-item badge-primary right-[3px] top-[3px] h-3 w-3 px-0" />
      ) : null}
      <button onClick={showMessenger} className={btnClassName}>
        {children}
      </button>
    </div>
  );
}
