import type { TemplateManifest } from "../templates.js";

export type AddonId = "tailwind";

export interface ScaffoldContext {
    /** Directorio destino del proyecto generado */
    root: string;
    template: TemplateManifest;
    /** package.json del proyecto, mutable por los addons antes de escribirse */
    packageJson: Record<string, any>;
}

export interface Addon {
    id: AddonId;
    label: string;
    hint: string;
    /** true si aplica, o un string explicando por qué no */
    supportedBy(template: TemplateManifest): true | string;
    /**
     * Aplica el addon sobre el proyecto ya copiado.
     * Devuelve notas extra para los "siguientes pasos" del outro.
     */
    apply(ctx: ScaffoldContext): string[] | Promise<string[]>;
}
