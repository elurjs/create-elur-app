import fs from "node:fs";
import path from "node:path";
import { copyTemplate } from "./scaffold.js";
import { substituteVersions } from "./versions.js";
import { ADDONS } from "./addons/tailwind.js";
import type { TemplateManifest } from "./templates.js";

export interface GenerateOptions {
    root: string;
    template: TemplateManifest;
    templateDir: string;
    name: string;
    tailwind: boolean;
}

/**
 * Copia el template, renombra el paquete y aplica addons.
 * Devuelve notas extra para los "siguientes pasos".
 */
export async function generateProject(opts: GenerateOptions): Promise<string[]> {
    copyTemplate(opts.templateDir, opts.root, substituteVersions);

    const pkgPath = path.join(opts.root, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    packageJson.name = opts.name;

    const notes: string[] = [];
    if (opts.tailwind) {
        notes.push(
            ...await ADDONS.tailwind.apply({ root: opts.root, template: opts.template, packageJson }),
        );
    }

    fs.writeFileSync(pkgPath, JSON.stringify(packageJson, null, 2) + "\n");
    return notes;
}
