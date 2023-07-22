import { useSession } from "next-auth/react";
import { type ReactNode } from "react";
import { ReactChannelIO } from "react-channel-plugin";

import { env } from "@/env.mjs";
import { api } from "@/utils/api";

type ChannelTalkProps = {
  children: ReactNode;
};

export default function ChannelTalkProvider({ children }: ChannelTalkProps) {
  const { data, status } = useSession();
  const { data: memberHash } = api.auth.getChannelHash.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  return (
    <ReactChannelIO
      pluginKey={env.NEXT_PUBLIC_CHANNEL_PLUGIN_KEY ?? ""}
      autoBoot={!!env.NEXT_PUBLIC_CHANNEL_PLUGIN_KEY}
      hideChannelButtonOnBoot={true}
      profile={
        !!data?.user
          ? {
              memberId: data.user.id,
              memberHash,
              name: data.user.name ?? "",
              email: data.user.email ?? "",
            }
          : undefined
      }
    >
      {children}
    </ReactChannelIO>
  );
}
