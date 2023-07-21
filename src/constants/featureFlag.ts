import { env } from "@/env.mjs";

export const featureFlag = {
  /** @deprecated */
  share:
    env.NEXT_PUBLIC_FEATURE_FLAG_SHARE ||
    env.NEXT_PUBLIC_NODE_ENV === "development",
  googleLogin:
    env.NEXT_PUBLIC_FEATURE_FLAG_GOOGLE_LOGIN ||
    env.NEXT_PUBLIC_NODE_ENV === "development",
};
