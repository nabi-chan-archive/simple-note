import ChannelService from "@/client/ChannelTalk";
import { env } from "@/env.mjs";
import CHANNEL_ATOM from "@/state/CHANNEL_ATOM";
import { api } from "@/utils/api";
import { useSetAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ChannelTalk() {
  const { data, status } = useSession();
  const updateUnRead = useSetAtom(CHANNEL_ATOM.unReadMessageCount);
  const { data: memberHash } = api.auth.getChannelHash.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  useEffect(() => {
    if (!env.NEXT_PUBLIC_CHANNEL_PLUGIN_KEY) return;
    if (data?.user.id && !memberHash) return;

    ChannelService.loadScript();

    ChannelService.boot(
      {
        pluginKey: env.NEXT_PUBLIC_CHANNEL_PLUGIN_KEY,
        customLauncherSelector: "#open-channel-talk",
        hideChannelButtonOnBoot: true,
        ...(status === "authenticated" && data?.user
          ? {
              memberId: data?.user?.id,
              memberHash,
              profile: {
                name: data?.user?.name,
                email: data?.user?.email,
              },
            }
          : {}),
      },
      (error, user) => {
        if (user?.alert) updateUnRead(user.alert);
      }
    );

    ChannelService.onBadgeChanged(updateUnRead);

    return () => ChannelService.shutdown();
  }, [data?.user, memberHash, status, updateUnRead]);

  return <></>;
}
