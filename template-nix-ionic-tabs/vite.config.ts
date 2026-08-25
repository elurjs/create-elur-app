import { defineConfig } from "vite";
import nixJs from "@deijose/vite-plugin-nix-js";
import { nixIonic } from "@deijose/nix-ionic/vite-plugin";

export default defineConfig({
  plugins: [
    nixJs(),
    nixIonic({
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
        "ion-tab-bar",
        "ion-tab-button",
        "ion-badge",
        "ion-toast",
        "ion-alert",
        "ion-loading",
        "ion-action-sheet",
      ],
      allowIcons: [
        "home",
        "home-outline",
        "map",
        "map-outline",
        "person",
        "person-outline",
        "log-in-outline",
        "log-out-outline",
        "arrow-back",
        "navigate-outline",
        "information-circle-outline",
      ],
    }),
  ],
  build: {
    rollupOptions: {
      output: { manualChunks: undefined },
    },
  },
});
