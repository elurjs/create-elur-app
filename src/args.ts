import { parseArgs } from "node:util";

export interface CliArgs {
    name?: string;
    template?: string;
    pm?: string;
    tailwind?: boolean;
    install?: boolean;
    git?: boolean;
    overwrite: boolean;
    help: boolean;
    version: boolean;
}

export const HELP = `
create-elur-app — Scaffolding para Elur

Uso:
  npm create elur-app@latest [nombre] -- [opciones]

Opciones:
  -t, --template <tipo>   kit | vite-ts | vite-js | elur-ionic | elur-ionic-tabs | vanilla-ts | vanilla-js
      --pm <gestor>       npm | pnpm | yarn | bun | deno (por defecto: el que invocó la CLI)
      --tailwind          Añade Tailwind CSS preconfigurado (donde aplique)
      --no-tailwind       Sin Tailwind
      --install           Instala dependencias al terminar
      --no-install        No instala dependencias
      --git               Inicializa un repositorio git
      --no-git            No inicializa git
      --overwrite         Sobrescribe el directorio si ya existe y no está vacío
  -h, --help              Muestra esta ayuda
  -v, --version           Muestra la versión

Sin --template ni nombre, la CLI entra en modo interactivo.
`;

export function parseCliArgs(argv: string[]): CliArgs {
    const { values, positionals } = parseArgs({
        args: argv,
        allowPositionals: true,
        options: {
            template: { type: "string", short: "t" },
            pm: { type: "string" },
            tailwind: { type: "boolean" },
            "no-tailwind": { type: "boolean" },
            install: { type: "boolean" },
            "no-install": { type: "boolean" },
            git: { type: "boolean" },
            "no-git": { type: "boolean" },
            overwrite: { type: "boolean" },
            help: { type: "boolean", short: "h" },
            version: { type: "boolean", short: "v" },
        },
    });

    const bool = (yes: boolean | undefined, no: boolean | undefined): boolean | undefined =>
        no ? false : yes;

    return {
        name: positionals[0],
        template: values.template,
        pm: values.pm,
        tailwind: bool(values.tailwind, values["no-tailwind"]),
        install: bool(values.install, values["no-install"]),
        git: bool(values.git, values["no-git"]),
        overwrite: values.overwrite ?? false,
        help: values.help ?? false,
        version: values.version ?? false,
    };
}
