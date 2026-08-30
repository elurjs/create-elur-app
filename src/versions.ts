import catalog from "../versions.json";

/**
 * Catálogo central de versiones. Fuente única de verdad:
 * los templates usan tokens {{version:pkg}} / {{version-exact:pkg}}
 * y se sustituyen al generar el proyecto. Se actualiza con `npm run sync:deps`.
 */
export const VERSION_CATALOG: Record<string, string> = catalog;

const TOKEN = /\{\{version(-exact)?:([@a-z0-9._/-]+)\}\}/gi;

/**
 * Reemplaza tokens de versión en contenido de texto.
 * - {{version:pkg}}        → el rango del catálogo, ej. "^3.6.0"
 * - {{version-exact:pkg}}  → solo la versión, ej. "3.6.0" (para URLs de CDN)
 */
export function substituteVersions(content: string): string {
    return content.replace(TOKEN, (_match, exact: string | undefined, pkgName: string) => {
        const range = VERSION_CATALOG[pkgName];
        if (!range) {
            throw new Error(`"${pkgName}" no está en versions.json — añádelo al catálogo`);
        }
        return exact ? range.replace(/^[~^]/, "") : range;
    });
}
