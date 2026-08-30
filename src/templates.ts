import type { AddonId } from "./addons/types.js";

export type Bundler = "vite" | "elur-kit" | null;

export interface TemplateManifest {
    /** Valor usado en --template y en el prompt */
    value: string;
    label: string;
    hint: string;
    /** Carpeta del template dentro del paquete */
    dir: string;
    bundler: Bundler;
    /** CSS de entrada relativo al root del proyecto, si aplica */
    cssEntry?: string;
    /** Config de Vite relativa al root, si aplica */
    viteConfig?: string;
    /** Addons compatibles con este template */
    addons: AddonId[];
}

export const TEMPLATES: TemplateManifest[] = [
    {
        value: "kit",
        label: "Elur Kit (Full-stack)",
        hint: "SSR/SSG, routing, islands, actions, content — meta-framework completo",
        dir: "template-kit",
        bundler: "elur-kit",
        cssEntry: "src/app.css",
        addons: ["tailwind"],
    },
    {
        value: "vite-ts",
        label: "Vite + TypeScript",
        hint: "Recomendado para DX rápida y tipado estricto",
        dir: "template-vite-ts",
        bundler: "vite",
        cssEntry: "src/style.css",
        viteConfig: "vite.config.ts",
        addons: ["tailwind"],
    },
    {
        value: "vite-js",
        label: "Vite + JavaScript",
        hint: "Vite sin compilación de TS",
        dir: "template-vite-js",
        bundler: "vite",
        cssEntry: "src/style.css",
        viteConfig: "vite.config.js",
        addons: ["tailwind"],
    },
    {
        value: "elur-ionic",
        label: "Ionic + Elur (Capacitor)",
        hint: "Template oficial con elur-ionic (Elur + Ionic + Capacitor)",
        dir: "template-elur-ionic",
        bundler: "vite",
        // Tailwind no aplica: Ionic usa Shadow DOM, lo idóneo es CSS con variables de Ionic
        addons: [],
    },
    {
        value: "elur-ionic-tabs",
        label: "Ionic + Elur + Tabs",
        hint: "IonRouterOutlet + createBottomTabBar + guards",
        dir: "template-elur-ionic-tabs",
        bundler: "vite",
        addons: [],
    },
    {
        value: "vanilla-ts",
        label: "Vanilla TypeScript",
        hint: "Sin bundler, puro TSC",
        dir: "template-vanilla-ts",
        bundler: null,
        cssEntry: "src/style.css",
        addons: [],
    },
    {
        value: "vanilla-js",
        label: "Vanilla JavaScript",
        hint: "Cero build, import maps directo en navegador",
        dir: "template-vanilla-js",
        bundler: null,
        cssEntry: "src/style.css",
        addons: [],
    },
];

export function findTemplate(value: string): TemplateManifest | undefined {
    return TEMPLATES.find((t) => t.value === value);
}
