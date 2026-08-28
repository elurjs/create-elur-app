# Elur-Ionic App

A mobile/hybrid app built with [Elur](https://elur.dev) + [Ionic](https://ionicframework.com) + [Capacitor](https://capacitorjs.com).

## Features

- **Vite plugin** auto-registers Ionic components and icons from `html` templates
- **IonRouterOutlet** with cache policies and lifecycle hooks
- **Reactive overlays** — `createToast()`, `createAlert()`, `createModal()`, etc.
- **IonBackButton** with router integration
- **Optional Capacitor** — zero web bundle cost

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```text
src/
├── main.ts           # App entry — imports virtual registration module
├── style.css         # Global styles + Ionic theme overrides
├── pages/
│   ├── HomePage.ts   # Home page with toast overlay demo
│   └── AboutPage.ts  # About page with back button
└── types/
    └── css.d.ts      # CSS module type declarations
```

## How auto-registration works

The Vite plugin (`@elurjs/ionic/vite-plugin`) scans your `html` templates
for `<ion-*>` tags and `<ion-icon name="...">` attributes, then generates a
virtual module that imports and registers only what you use:

```ts
// main.ts
import "virtual:elur-ionic/registration";
```

If you use tags or icons in lazy-loaded pages, add them to `allowTags` and
`allowIcons` in `vite.config.ts` so they're registered before first use.

## Adding a new page

```ts
import { html } from "@elurjs/core";
import { IonPage } from "@elurjs/ionic";
import type { PageContext } from "@elurjs/ionic";

export class SettingsPage extends IonPage {
  constructor(ctx: PageContext) {
    super(ctx.lc);
  }

  override ionViewWillEnter() {
    // Runs on every activation — even from cache
  }

  override render() {
    return html`
      <ion-header>
        <ion-toolbar>
          <ion-title>Settings</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <p>Settings content</p>
      </ion-content>
    `;
  }
}
```

Then add it to the router in `main.ts`:

```ts
const outlet = new IonRouterOutlet([
  { path: "/", component: (ctx) => new HomePage(ctx) },
  { path: "/settings", component: (ctx) => new SettingsPage(ctx) },
]);
```

## Capacitor (optional native)

```bash
npx cap add android
npx cap sync
npx cap open android
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests |
