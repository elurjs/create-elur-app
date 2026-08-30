# create-elur-app

CLI de scaffolding para [Elur](https://github.com/deiver/elur-core), el framework reactivo.

## Uso

```bash
npm create elur-app@latest
```

o directamente con flags (modo no interactivo):

```bash
npm create elur-app@latest my-app -- --template vite-ts --tailwind --install --git
```

## Opciones

| Flag | Descripción |
| --- | --- |
| `-t, --template <tipo>` | `kit`, `vite-ts`, `vite-js`, `elur-ionic`, `elur-ionic-tabs`, `vanilla-ts`, `vanilla-js` |
| `--pm <gestor>` | `npm`, `pnpm`, `yarn`, `bun` o `deno` (por defecto: el que invocó la CLI) |
| `--tailwind` / `--no-tailwind` | Añade Tailwind CSS v4 preconfigurado |
| `--install` / `--no-install` | Instala dependencias al terminar |
| `--git` / `--no-git` | Inicializa un repositorio git |
| `--overwrite` | Sobrescribe el directorio si existe y no está vacío |
| `-h, --help` | Ayuda |
| `-v, --version` | Versión |

## Package manager

En modo interactivo la CLI detecta qué gestores tienes instalados (`npm`, `pnpm`, `yarn`, `bun`, `deno`) y te deja elegir; el que usaste para invocarla aparece preseleccionado. En modo no interactivo usa `--pm`:

```bash
npm create elur-app@latest mi-app -- --template vite-ts --pm pnpm
```

## Templates

- **Elur Kit** — meta-framework full-stack (SSR/SSG, routing, islands, content).
- **Vite + TS / JS** — SPA con Vite y Vitest configurado.
- **Ionic + Elur (Capacitor)** — apps móviles, con variante de tabs.
- **Vanilla TS / JS** — sin bundler.

## Tailwind CSS

Disponible en `vite-ts`, `vite-js` y `kit`:

- En templates **Vite** usa el plugin oficial `@tailwindcss/vite` (v4, sin archivo de config).
- En **Elur Kit** usa el CLI standalone (`dev:css` en watch, integrado al `build`).
- En **Ionic** no está disponible a propósito: Ionic usa Shadow DOM y lo idóneo es CSS con las variables de Ionic.
- En templates **vanilla** no aplica (no hay build step).

## Versiones de dependencias

Las versiones de las deps compartidas viven en un único catálogo, `versions.json`. Los templates usan tokens `{{version:paquete}}` (rango, ej. `^3.6.0`) y `{{version-exact:paquete}}` (versión pelada, para URLs de CDN) que se sustituyen al generar el proyecto. Para actualizar todo contra npm:

```bash
npm run sync:deps   # actualiza versions.json con las últimas versiones
npm test            # verifica que los templates generan proyectos correctos
```

Además, un workflow scheduled (`.github/workflows/sync-deps.yml`) corre esto cada lunes y abre PR automático si hay cambios.

## Desarrollo de esta CLI

```bash
npm install
npm run build      # compila src/ a dist/ con tsup
npm test           # tests unitarios (scaffolding, addons, args)
npm run test:e2e   # E2E real: scaffold + install + build (requiere red)
```

Publicar: crea un tag `v*` y el workflow de GitHub Actions compila, testea y publica en npm (requiere el secret `NPM_TOKEN`).
