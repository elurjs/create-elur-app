import { defineConfig } from "vite";
import nixJs from "@deijose/vite-plugin-nix-js";
import { nixIonic } from "@deijose/nix-ionic/vite-plugin";

export default defineConfig({
  plugins: [
    nixJs(),
    nixIonic({
      // Explicit allowlists for lazy-loaded pages and dynamic usage.
      // The plugin scans html`` templates and warns about tags/icons
      // not listed here.
      allowTags: [
        "ion-app",
        "ion-header",
        "ion-toolbar",
        "ion-title",
        "ion-content",
        "ion-buttons",
        "ion-button",
        "ion-back-button",
        "ion-card",
        "ion-card-header",
        "ion-card-title",
        "ion-card-subtitle",
        "ion-card-content",
        "ion-list",
        "ion-item",
        "ion-label",
        "ion-icon",
        "ion-input",
        "ion-toast",
        "ion-alert",
        "ion-loading",
      ],
      allowIcons: [
        "home",
        "home-outline",
        "rocket",
        "code-slash-outline",
      ],
    }),
  ],
  build: {
    rollupOptions: {
      output: { manualChunks: undefined },
    },
  },
});
