import fs from "node:fs";
import path from "node:path";
import type { Addon, AddonId, ScaffoldContext } from "./types.js";
import { VERSION_CATALOG } from "../versions.js";

function catalogVersion(pkg: string): string {
    const v = VERSION_CATALOG[pkg];
    if (!v) throw new Error(`"${pkg}" no está en versions.json`);
    return v;
}

function mergeDeps(pkg: Record<string, any>, field: "dependencies" | "devDependencies", deps: Record<string, string>) {
    pkg[field] = { ...pkg[field], ...deps };
}

function mergeScripts(pkg: Record<string, any>, scripts: Record<string, string>) {
    pkg.scripts = { ...pkg.scripts, ...scripts };
}

/** Inserta una línea de import después del último import existente */
function addImport(source: string, importLine: string): string {
    const lines = source.split("\n");
    let lastImport = -1;
    for (let i = 0; i < lines.length; i++) {
        if (/^import\s.*;?\s*$/.test(lines[i]!)) lastImport = i;
    }
    lines.splice(lastImport + 1, 0, importLine);
    return lines.join("\n");
}

/** Estrategia Vite: plugin oficial @tailwindcss/vite (Tailwind v4, sin config file) */
function applyVite(ctx: ScaffoldContext): string[] {
    const { root, template, packageJson } = ctx;
    if (!template.viteConfig || !template.cssEntry) {
        throw new Error(`El template ${template.value} no declara viteConfig/cssEntry`);
    }

    mergeDeps(packageJson, "devDependencies", {
        tailwindcss: catalogVersion("tailwindcss"),
        "@tailwindcss/vite": catalogVersion("@tailwindcss/vite"),
    });

    const configPath = path.join(root, template.viteConfig);
    let config = fs.readFileSync(configPath, "utf-8");
    if (!config.includes("@tailwindcss/vite")) {
        config = addImport(config, 'import tailwindcss from "@tailwindcss/vite";');
        if (!config.includes("plugins:")) {
            throw new Error(`No se encontró "plugins:" en ${template.viteConfig}`);
        }
        config = config.replace(/plugins:\s*\[/, "plugins: [tailwindcss(), ");
        fs.writeFileSync(configPath, config);
    }

    const cssPath = path.join(root, template.cssEntry);
    const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf-8") : "";
    if (!css.includes('@import "tailwindcss"')) {
        fs.writeFileSync(cssPath, `@import "tailwindcss";\n\n${css}`);
    }

    return [];
}

/**
 * Estrategia Elur Kit: Tailwind CLI standalone.
 * elur-kit es su propio bundler, así que el CSS se compila aparte:
 * src/app.css (fuente) → public/styles.css (salida servida como asset estático).
 */
function applyKit(ctx: ScaffoldContext): string[] {
    const { root, packageJson } = ctx;

    mergeDeps(packageJson, "devDependencies", {
        tailwindcss: catalogVersion("tailwindcss"),
        "@tailwindcss/cli": catalogVersion("@tailwindcss/cli"),
    });

    const input = "src/app.css";
    const output = "public/styles.css";
    mergeScripts(packageJson, {
        "dev:css": `tailwindcss -i ${input} -o ${output} --watch`,
        build: `tailwindcss -i ${input} -o ${output} --minify && elur-kit build`,
    });

    const cssPath = path.join(root, input);
    if (!fs.existsSync(cssPath)) {
        fs.mkdirSync(path.dirname(cssPath), { recursive: true });
        fs.writeFileSync(cssPath, '@import "tailwindcss";\n');
    }

    return [
        "Tailwind va por CLI: en desarrollo ejecuta `dev:css` en otra terminal (el build ya lo incluye)",
    ];
}

export const tailwindAddon: Addon = {
    id: "tailwind",
    label: "Tailwind CSS",
    hint: "Utility-first CSS, preconfigurado (v4)",
    supportedBy(template) {
        if (!template.addons.includes("tailwind")) {
            if (template.bundler === null) {
                return "requiere un build step (no disponible en templates vanilla)";
            }
            if (template.value.startsWith("elur-ionic")) {
                return "no recomendado: Ionic usa Shadow DOM, lo idóneo es CSS con variables de Ionic";
            }
            return "no soportado en este template";
        }
        return true;
    },
    apply(ctx) {
        switch (ctx.template.bundler) {
            case "vite":
                return applyVite(ctx);
            case "elur-kit":
                return applyKit(ctx);
            default:
                throw new Error(`Tailwind no soporta el bundler de ${ctx.template.value}`);
        }
    },
};

export const ADDONS: { [K in AddonId]: Addon } = {
    tailwind: tailwindAddon,
};
