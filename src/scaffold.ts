import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun" | "deno";

export const ALL_PACKAGE_MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun", "deno"];

/** Detecta el PM desde el user agent de `npm create` / `pnpm create` / etc. */
export function detectPackageManager(): PackageManager {
    const ua = process.env.npm_config_user_agent ?? "";
    if (ua.startsWith("pnpm")) return "pnpm";
    if (ua.startsWith("yarn")) return "yarn";
    if (ua.startsWith("bun")) return "bun";
    return "npm";
}

let installedCache: PackageManager[] | undefined;

/** PMs realmente instalados en la máquina del usuario (npm siempre como fallback) */
export function installedPackageManagers(): PackageManager[] {
    if (installedCache) return installedCache;
    installedCache = ALL_PACKAGE_MANAGERS.filter((pm) => {
        const result = spawnSync(pm, ["--version"], { stdio: "ignore" });
        return result.status === 0;
    });
    if (!installedCache.includes("npm")) installedCache.unshift("npm");
    return installedCache;
}

export function installDependencies(root: string, pm: PackageManager): boolean {
    const result = spawnSync(pm, ["install"], { cwd: root, stdio: "inherit" });
    return result.status === 0;
}

export function gitInit(root: string): boolean {
    const result = spawnSync("git", ["init", "--quiet"], { cwd: root, stdio: "ignore" });
    return result.status === 0;
}

/** Reglas de nombre de paquete npm + caracteres seguros para filesystem */
export function validateProjectName(name: string): true | string {
    if (!name || name.trim().length === 0) return "El nombre no puede estar vacío";
    if (name.length > 214) return "El nombre es demasiado largo (máx. 214 caracteres)";
    if (name !== name.toLowerCase()) return "El nombre debe estar en minúsculas (regla de npm)";
    if (name.startsWith(".") || name.startsWith("_")) return "El nombre no puede empezar con . ni _";
    if (/[~'!*()\s]/.test(name)) return "El nombre contiene caracteres inválidos (espacios, ~'!*())";
    if (name.includes("..") || name.includes("/") || name.includes("\\")) {
        return "El nombre no puede contener rutas (/, \\, ..)";
    }
    if (!/^[a-z0-9@][a-z0-9._-]*$/.test(name) && !name.startsWith("@")) {
        return "Usa solo letras, números, guiones, puntos y guiones bajos";
    }
    return true;
}

export function isDirEmpty(dir: string): boolean {
    if (!fs.existsSync(dir)) return true;
    return fs.readdirSync(dir).filter((f) => f !== ".git").length === 0;
}

/** Vacía un directorio preservando .git si existe */
export function emptyDir(dir: string): void {
    for (const entry of fs.readdirSync(dir)) {
        if (entry === ".git") continue;
        fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
    }
}

/** Extensiones de texto donde se sustituyen tokens de versión (el resto se copia en binario) */
const TEXT_EXTENSIONS = new Set([
    ".json", ".html", ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
    ".css", ".md", ".yml", ".yaml", ".txt", ".svg", ".map",
]);

/**
 * Copia recursiva: salta node_modules, renombra _gitignore → .gitignore
 * y aplica `transform` al contenido de los archivos de texto.
 */
export function copyTemplate(src: string, dest: string, transform?: (content: string) => string): void {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        for (const file of fs.readdirSync(src)) {
            if (file === "node_modules") continue;
            copyTemplate(path.join(src, file), path.join(dest, file), transform);
        }
    } else {
        const target = path.basename(dest) === "_gitignore"
            ? path.join(path.dirname(dest), ".gitignore")
            : dest;
        if (transform && TEXT_EXTENSIONS.has(path.extname(target).toLowerCase())) {
            fs.writeFileSync(target, transform(fs.readFileSync(src, "utf-8")));
        } else {
            fs.copyFileSync(src, target);
        }
    }
}
