import { defineConfig } from "@deijose/nix-js-kit/config";

export default defineConfig({
  lang: "en",
  cache: {
    dir: ".nix-js/cache",
    defaultRevalidate: 60,
  },
  security: {
    headers: true,
  },
});
