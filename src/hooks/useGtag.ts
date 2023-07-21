import { useRouter } from "next/router";
import { useEffect } from "react";

import { env } from "@/env.mjs";

export const pageView = (url: URL) => {
  window.gtag("config", env.NEXT_PUBLIC_GA_TRACKING_ID ?? "", {
    page_path: url,
  });
};

export const event = (
  action: Gtag.EventNames,
  { event_category, event_label, value }: Gtag.EventParams
) => {
  window.gtag("event", action, {
    event_category,
    event_label,
    value,
  });
};

// route가 변경될 때 gtag에서
export const useGTag = () => {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    const handleRouteChange = (url: URL) => {
      pageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("hashChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("hashChangeComplete", handleRouteChange);
    };
  }, [router.events]);
};
