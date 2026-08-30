import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * E2E real: corre la CLI compilada, instala deps y construye el proyecto generado.
 * Requiere red. Se activa con ELUR_E2E=1 (npm run test:e2e).
 */
const RUN = process.env.ELUR_E2E === "1";
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(packageRoot, "dist", "index.js");

describe.skipIf(!RUN)("e2e: CLI compilada end-to-end", () => {
    it(
        "vite-ts + tailwind: scaffold, install y build",
        { timeout: 300_000 },
        () => {
            const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "elur-e2e-"));
            try {
                const create = spawnSync(
                    process.execPath,
                    [cli, "e2e-app", "--template", "vite-ts", "--tailwind"],
                    { cwd: tmp, encoding: "utf-8" },
                );
                expect(create.status).toBe(0);
                const root = path.join(tmp, "e2e-app");
                expect(fs.existsSync(path.join(root, "package.json"))).toBe(true);

                const install = spawnSync("npm", ["install"], { cwd: root, encoding: "utf-8" });
                expect(install.status).toBe(0);

                const build = spawnSync("npm", ["run", "build"], { cwd: root, encoding: "utf-8" });
                expect(build.status).toBe(0);
            } finally {
                fs.rmSync(tmp, { recursive: true, force: true });
            }
        },
    );
});
