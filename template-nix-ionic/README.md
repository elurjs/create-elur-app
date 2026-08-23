# Nix-Ionic App

A mobile-first starter template powered by **[Nix.js](https://www.npmjs.com/package/@deijose/nix-js)** + **[Ionic](https://ionicframework.com/)** + **[Capacitor](https://capacitorjs.com/)**.

## Quick Start

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

## Deploy to Android

```bash
# First build the web app
npm run build

# Sync with Capacitor
npx cap sync android

# Open Android Studio
npx cap open android
```

## Project Structure

```
src/
├── main.ts          # Entry point — Ionic setup & router
├── style.css        # Global styles
└── pages/
    └── HomePage.ts  # Your first page (IonPage)
```

## Modular Loading

This template uses **nix-ionic v1.4.14** modular component loading.
Import only the bundles your app needs in `main.ts`:

```ts
import { layoutComponents } from "@deijose/nix-ionic/bundles/layout";
import { navigationComponents } from "@deijose/nix-ionic/bundles/navigation";
import { formComponents }   from "@deijose/nix-ionic/bundles/forms";
import { overlayComponents } from "@deijose/nix-ionic/bundles/overlays";
import { home, homeOutline } from "ionicons/icons";

setupNixIonic({
    components: [...layoutComponents, ...navigationComponents, ...formComponents],
    icons: { home, "home-outline": homeOutline },
});
```

Available bundles: `layout`, `navigation`, `forms`, `lists`, `feedback`, `buttons`, `overlays`, `all`.

## Tabs and Bottom Navigation

For tab-based apps, use the built-in helper:

```ts
import { createBottomTabBar } from "@deijose/nix-ionic";
```

It provides active-path sync without manual `window.location` listeners.

## Learn More

- [Nix.js Docs](https://github.com/DeijoseDevelop/nix-js)
- [Nix-Ionic on npm](https://www.npmjs.com/package/@deijose/nix-ionic)
- [Ionic Components](https://ionicframework.com/docs/components)
- [Capacitor Docs](https://capacitorjs.com/docs)
