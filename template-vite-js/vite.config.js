import { defineConfig } from "vite";
import nixJs from "@deijose/vite-plugin-nix-js";

export default defineConfig({
    plugins: [nixJs()],
});
