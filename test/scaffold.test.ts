import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateProject } from "../src/generate.js";
import { TEMPLATES, findTemplate } from "../src/templates.js";
import { ADDONS } from "../src/addons/tailwind.js";
import { validateProjectName, isDirEmpty, emptyDir, installedPackageManagers } from "../src/scaffold.js";
import { VERSION_CATALOG, substituteVersions } from "../src/versions.js";
import { parseCliArgs } from "../src/args.js";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let tmp: string;
beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "elur-test-"));
});
afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
});

async function scaffold(templateValue: string, tailwind = false) {
    const template = findTemplate(templateValue);
    if (!template) throw new Error(`template ${templateValue} no existe`);
    const root = path.join(tmp, "my-app");
    const notes = await generateProject({
        root,
        template,
        templateDir: path.join(packageRoot, template.dir),
        name: "my-app",
        tailwind,
    });
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf-8"));
    return { root, pkg, notes };
}

describe("scaffolding de templates", () => {
    for (const t of TEMPLATES) {
        it(`genera ${t.value} con nombre reescrito y .gitignore`, async () => {
            const { root, pkg } = await scaffold(t.value);
            expect(pkg.name).toBe("my-app");
            expect(fs.existsSync(path.join(root, "package.json"))).toBe(true);
            // _gitignore se renombra a .gitignore cuando el template lo trae
            const templateDir = path.join(packageRoot, t.dir);
            if (fs.existsSync(path.join(templateDir, "_gitignore"))) {
                expect(fs.existsSync(path.join(root, ".gitignore"))).toBe(true);
                expect(fs.existsSync(path.join(root, "_gitignore"))).toBe(false);
            }
        });
    }
});

describe("addon Tailwind", () => {
    it("vite-ts: plugin en vite.config, import en CSS y deps", async () => {
        const { root, pkg } = await scaffold("vite-ts", true);
        expect(pkg.devDependencies.tailwindcss).toMatch(/^\^?4/);
        expect(pkg.devDependencies["@tailwindcss/vite"]).toBeDefined();

        const viteConfig = fs.readFileSync(path.join(root, "vite.config.ts"), "utf-8");
        expect(viteConfig).toContain('import tailwindcss from "@tailwindcss/vite";');
        expect(viteConfig).toContain("tailwindcss()");

        const css = fs.readFileSync(path.join(root, "src/style.css"), "utf-8");
        expect(css.startsWith('@import "tailwindcss";')).toBe(true);
    });

    it("vite-js: mismo contrato que vite-ts", async () => {
        const { root, pkg } = await scaffold("vite-js", true);
        expect(pkg.devDependencies["@tailwindcss/vite"]).toBeDefined();
        const viteConfig = fs.readFileSync(path.join(root, "vite.config.js"), "utf-8");
        expect(viteConfig).toContain("tailwindcss()");
    });

    it("kit: estrategia CLI standalone con scripts y app.css", async () => {
        const { root, pkg, notes } = await scaffold("kit", true);
        expect(pkg.devDependencies["@tailwindcss/cli"]).toBeDefined();
        expect(pkg.scripts["dev:css"]).toContain("--watch");
        expect(pkg.scripts.build).toContain("tailwindcss -i src/app.css -o public/styles.css --minify");
        expect(pkg.scripts.build).toContain("elur-kit build");
        expect(fs.readFileSync(path.join(root, "src/app.css"), "utf-8")).toContain(
            '@import "tailwindcss";',
        );
        expect(notes.length).toBeGreaterThan(0);
    });

    it("sin --tailwind no toca nada", async () => {
        const { root, pkg } = await scaffold("vite-ts", false);
        expect(pkg.devDependencies?.tailwindcss).toBeUndefined();
        const viteConfig = fs.readFileSync(path.join(root, "vite.config.ts"), "utf-8");
        expect(viteConfig).not.toContain("tailwindcss");
    });

    it("declara soporte por capacidades, no por nombre", () => {
        const { supportedBy } = ADDONS.tailwind;
        expect(supportedBy(findTemplate("vite-ts")!)).toBe(true);
        expect(supportedBy(findTemplate("kit")!)).toBe(true);
        expect(supportedBy(findTemplate("elur-ionic")!)).toMatch(/Shadow DOM/);
        expect(supportedBy(findTemplate("elur-ionic-tabs")!)).toMatch(/Shadow DOM/);
        expect(supportedBy(findTemplate("vanilla-ts")!)).toMatch(/build step/);
        expect(supportedBy(findTemplate("vanilla-js")!)).toMatch(/build step/);
    });
});

describe("catálogo de versiones", () => {
    it("sustituye tokens de package.json con los rangos del catálogo", async () => {
        const { pkg } = await scaffold("vite-ts");
        expect(pkg.dependencies["@elurjs/core"]).toBe(VERSION_CATALOG["@elurjs/core"]);
        expect(pkg.devDependencies.vite).toBe(VERSION_CATALOG.vite);
        expect(JSON.stringify(pkg)).not.toContain("{{version");
    });

    it("sustituye versión exacta en import maps de CDN", async () => {
        const { root } = await scaffold("vanilla-js");
        const html = fs.readFileSync(path.join(root, "index.html"), "utf-8");
        const exact = VERSION_CATALOG["@elurjs/core"]!.replace(/^[~^]/, "");
        expect(html).toContain(`@elurjs/core@${exact}/+esm`);
        expect(html).not.toContain("{{version");
    });

    it("no quedan tokens sin sustituir en ningún archivo de texto generado", async () => {
        const { root } = await scaffold("kit", true);
        const walk = (dir: string): string[] =>
            fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
                e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
            );
        const textExt = /\.(json|html|js|ts|css|md|yml|yaml|txt|svg)$/;
        for (const file of walk(root).filter((f) => textExt.test(f))) {
            expect(fs.readFileSync(file, "utf-8"), file).not.toMatch(/\{\{version/);
        }
    });

    it("falla explícito si un token no está en el catálogo", () => {
        expect(() => substituteVersions('{"x": "{{version:no-existe}}"}')).toThrow(/versions\.json/);
    });
});

describe("validateProjectName", () => {
    it("acepta nombres válidos", () => {
        for (const n of ["my-app", "elur-app", "app2", "a.b.c", "@scope-app"]) {
            expect(validateProjectName(n)).toBe(true);
        }
    });
    it("rechaza nombres inválidos", () => {
        for (const n of ["", "MyApp", "my app", ".hidden", "_priv", "../evil", "a/b", "x~y"]) {
            expect(validateProjectName(n)).not.toBe(true);
        }
    });
});

describe("directorios", () => {
    it("isDirEmpty con dir inexistente y vacío", () => {
        expect(isDirEmpty(path.join(tmp, "nope"))).toBe(true);
        const empty = path.join(tmp, "empty");
        fs.mkdirSync(empty);
        expect(isDirEmpty(empty)).toBe(true);
    });
    it("emptyDir preserva .git", () => {
        const dir = path.join(tmp, "proj");
        fs.mkdirSync(path.join(dir, ".git"), { recursive: true });
        fs.writeFileSync(path.join(dir, "file.txt"), "x");
        emptyDir(dir);
        expect(fs.existsSync(path.join(dir, ".git"))).toBe(true);
        expect(fs.existsSync(path.join(dir, "file.txt"))).toBe(false);
    });
});

describe("parseCliArgs", () => {
    it("parsea nombre posicional y flags", () => {
        const args = parseCliArgs(["my-app", "--template", "vite-ts", "--tailwind", "--install", "--git"]);
        expect(args.name).toBe("my-app");
        expect(args.template).toBe("vite-ts");
        expect(args.tailwind).toBe(true);
        expect(args.install).toBe(true);
        expect(args.git).toBe(true);
    });
    it("soporta negaciones --no-*", () => {
        const args = parseCliArgs(["my-app", "-t", "kit", "--no-tailwind", "--no-install", "--no-git"]);
        expect(args.tailwind).toBe(false);
        expect(args.install).toBe(false);
        expect(args.git).toBe(false);
    });
    it("flags ausentes quedan undefined (modo interactivo decide)", () => {
        const args = parseCliArgs([]);
        expect(args.name).toBeUndefined();
        expect(args.template).toBeUndefined();
        expect(args.tailwind).toBeUndefined();
        expect(args.install).toBeUndefined();
    });
    it("parsea --pm", () => {
        expect(parseCliArgs(["app", "-t", "kit", "--pm", "bun"]).pm).toBe("bun");
        expect(parseCliArgs([]).pm).toBeUndefined();
    });
});

describe("package managers", () => {
    it("detecta los instalados y npm siempre está", () => {
        const installed = installedPackageManagers();
        expect(installed).toContain("npm");
        expect(installed.length).toBeGreaterThan(0);
    });
});
