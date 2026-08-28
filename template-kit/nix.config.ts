import { defineConfig } from "@elurjs/kit/config";

export default defineConfig({
  lang: "en",
  cache: {
    dir: ".elur/cache",
    defaultRevalidate: 60,
  },
  security: {
    headers: true,
  },
});
