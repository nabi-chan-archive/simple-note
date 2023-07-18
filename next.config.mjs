await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  images: {
    domains: ["avatars.githubusercontent.com"],
  },

  transpilePackages: ["jotai-devtools"],
};

export default config;
