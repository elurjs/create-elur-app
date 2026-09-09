import * as p from "@clack/prompts";
import pc from "picocolors";
import type { CliArgs } from "./args.js";
import { TEMPLATES, findTemplate, type TemplateManifest } from "./templates.js";
import { ADDONS } from "./addons/tailwind.js";
import { validateProjectName, detectPackageManager, installedPackageManagers, ALL_PACKAGE_MANAGERS, type PackageManager } from "./scaffold.js";

export interface ResolvedOptions {
    name: string;
    template: TemplateManifest;
    pm: PackageManager;
    tailwind: boolean;
    install: boolean;
    git: boolean;
}

function bail(message: string): never {
    p.cancel(message);
    process.exit(1);
}

function assertNotCancelled<T>(value: T | symbol): T {
    if (p.isCancel(value)) {
        p.cancel("Operación cancelada. ¡Hasta pronto!");
        process.exit(0);
    }
    return value as T;
}

export async function resolveOptions(args: CliArgs): Promise<ResolvedOptions> {
    // Modo no interactivo: nombre + template por flags, el resto con defaults
    const nonInteractive = Boolean(args.name && args.template);

    p.intro(pc.blue("❄️  create-elur-app"));

    // --- Nombre ---
    let name = args.name;
    if (name) {
        const check = validateProjectName(name);
        if (check !== true) bail(`Nombre de proyecto inválido: ${check}`);
    } else {
        name = assertNotCancelled(await p.text({
            message: "Nombre de tu proyecto:",
            placeholder: "elur-app",
            defaultValue: "elur-app",
            validate: (v) => {
                const check = validateProjectName(v ?? "");
                return check === true ? undefined : check;
            },
        }));
    }

    // --- Template ---
    let template: TemplateManifest | undefined;
    if (args.template) {
        template = findTemplate(args.template);
        if (!template) {
            bail(
                `Template desconocido: "${args.template}".\nVálidos: ${TEMPLATES.map((t) => t.value).join(", ")}`,
            );
        }
    } else {
        template = assertNotCancelled(await p.select({
            message: "¿Qué variante quieres usar?",
            options: TEMPLATES.map((t) => ({
                value: t,
                label: t.label,
                hint: t.hint,
            })),
        }));
    }

    // --- Tailwind ---
    const support = ADDONS.tailwind.supportedBy(template);
    let tailwind = false;
    if (args.tailwind === true) {
        if (support !== true) {
            p.log.warn(`Tailwind omitido: ${support}`);
        } else {
            tailwind = true;
        }
    } else if (args.tailwind === undefined && !nonInteractive && support === true) {
        tailwind = assertNotCancelled(await p.confirm({
            message: "¿Añadir Tailwind CSS preconfigurado?",
            initialValue: false,
        }));
    } else if (args.tailwind === undefined && !nonInteractive && typeof support === "string") {
        p.note(support, `Tailwind no disponible en ${template.label}`);
    }

    // --- Package manager ---
    let pm: PackageManager;
    if (args.pm) {
        if (!ALL_PACKAGE_MANAGERS.includes(args.pm as PackageManager)) {
            bail(`Package manager desconocido: "${args.pm}".\nVálidos: ${ALL_PACKAGE_MANAGERS.join(", ")}`);
        }
        if (!installedPackageManagers().includes(args.pm as PackageManager)) {
            p.log.warn(`${args.pm} no está instalado en esta máquina; se usará en los comandos pero la instalación puede fallar`);
        }
        pm = args.pm as PackageManager;
    } else if (nonInteractive) {
        pm = detectPackageManager();
    } else {
        const detected = detectPackageManager();
        pm = assertNotCancelled(await p.select({
            message: "¿Qué package manager quieres usar?",
            options: installedPackageManagers().map((m) => ({
                value: m,
                label: m === detected ? `${m} (detectado)` : m,
            })),
            initialValue: detected,
        }));
    }

    // --- Instalar dependencias ---
    let install = args.install ?? false;
    if (args.install === undefined && !nonInteractive) {
        install = assertNotCancelled(await p.confirm({
            message: "¿Instalar dependencias ahora?",
            initialValue: true,
        }));
    }

    // --- Git ---
    let git = args.git ?? false;
    if (args.git === undefined && !nonInteractive) {
        git = assertNotCancelled(await p.confirm({
            message: "¿Inicializar repositorio git?",
            initialValue: true,
        }));
    }

    return { name: name!, template, pm, tailwind, install, git };
}

/** Pregunta (o decide por flag) qué hacer con un directorio no vacío. Devuelve true si se puede continuar. */
export async function confirmOverwrite(dir: string, args: CliArgs): Promise<boolean> {
    if (args.overwrite) return true;
    const nonInteractive = Boolean(args.name && args.template);
    if (nonInteractive) return false;

    const action = assertNotCancelled(await p.confirm({
        message: `El directorio ${pc.cyan(dir)} no está vacío. ¿Vaciarlo y continuar?`,
        initialValue: false,
    }));
    return action;
}

export function outro(opts: ResolvedOptions, installed: boolean, addonNotes: string[]) {
    const pm = opts.pm;
    const devCmd = pm === "npm" ? "npm run dev" : pm === "deno" ? "deno task dev" : `${pm} dev`;
    const lines = [
        `cd ${opts.name}`,
        ...(installed ? [] : [`${pm} install`]),
        devCmd,
    ];
    for (const note of addonNotes) p.log.info(note);
    p.note(lines.map((l) => pc.cyan(l)).join("\n"), "Siguientes pasos");
    p.outro(pc.green("¡Proyecto creado con éxito! 🎉"));
}
