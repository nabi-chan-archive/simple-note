import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    FEATURE_FLAG_SHARE: z.boolean().optional(),
    CHANNEL_SECRET: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    NEXT_PUBLIC_FEATURE_FLAG_SHARE: z.boolean().optional(),
    NEXT_PUBLIC_FEATURE_FLAG_GOOGLE_LOGIN: z.boolean().optional(),
    NEXT_PUBLIC_NODE_ENV: z.enum(["development", "test", "production"]),
    NEXT_PUBLIC_CHANNEL_PLUGIN_KEY: z.string().optional(),
    NEXT_PUBLIC_GA_TRACKING_ID: z.string().optional(),
  },
  runtimeEnv: {
    // feature flag
    NEXT_PUBLIC_FEATURE_FLAG_SHARE: process.env.FEATURE_FLAG_SHARE,
    FEATURE_FLAG_SHARE: process.env.FEATURE_FLAG_SHARE,
    NEXT_PUBLIC_FEATURE_FLAG_GOOGLE_LOGIN:
      process.env.NEXT_PUBLIC_FEATURE_FLAG_GOOGLE_LOGIN,
    // ENV
    NEXT_PUBLIC_BASE_URL:
      process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_CHANNEL_PLUGIN_KEY: process.env.NEXT_PUBLIC_CHANNEL_PLUGIN_KEY,
    NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    CHANNEL_SECRET: process.env.CHANNEL_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
