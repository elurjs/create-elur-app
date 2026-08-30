import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { parseCliArgs, HELP } from "./args.js";
import { resolveOptions, confirmOverwrite, outro } from "./prompt.js";
import {
    isDirEmpty,
    emptyDir,
    installDependencies,
    gitInit,
} from "./scaffold.js";
import { generateProject } from "./generate.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { version: string };
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
    let args;
    try {
        args = parseCliArgs(process.argv.slice(2));
    } catch (e) {
        console.error(pc.red(`\nFlag inválido: ${(e as Error).message}\n`));
        console.log(HELP);
        process.exit(1);
    }

    if (args.help) {
        console.log(HELP);
        return;
    }
    if (args.version) {
        console.log(pkg.version);
        return;
    }

    const opts = await resolveOptions(args);
    const root = path.resolve(process.cwd(), opts.name);

    if (!isDirEmpty(root)) {
        const ok = await confirmOverwrite(opts.name, args);
        if (!ok) {
            p.cancel("Operación cancelada. El directorio no se tocó.");
            process.exit(0);
        }
        emptyDir(root);
    }

    const templateDir = path.join(packageRoot, opts.template.dir);
    if (!fs.existsSync(templateDir)) {
        p.cancel(`No se encontró el template ${opts.template.dir} en el paquete.`);
        process.exit(1);
    }

    const addonNotes: string[] = [];
    const s = p.spinner();
    try {
        s.start(`Copiando ${opts.template.label}...`);
        addonNotes.push(
            ...await generateProject({
                root,
                template: opts.template,
                templateDir,
                name: opts.name,
                tailwind: opts.tailwind,
            }),
        );
        s.stop(pc.green("Proyecto generado"));
    } catch (e) {
        s.stop(pc.red("Error al generar el proyecto"));
        console.error(e);
        process.exit(1);
    }

    const pm = opts.pm;
    let installed = false;
    if (opts.install) {
        p.log.step(`Instalando dependencias con ${pm}...`);
        installed = installDependencies(root, pm);
        if (!installed) {
            p.log.warn(`Falló la instalación. Ejecuta ${pc.cyan(`${pm} install`)} manualmente.`);
        }
    }

    if (opts.git) {
        if (gitInit(root)) {
            p.log.success("Repositorio git inicializado");
        } else {
            p.log.warn("git no está disponible, se omitió git init");
        }
    }

    outro(opts, installed, addonNotes);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
