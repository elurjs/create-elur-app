# Elur-Ionic Tabs App

A mobile/hybrid app with bottom tabs, route guards, overlays, and NavigationManager — built with [Elur](https://elur.dev) + [Ionic](https://ionicframework.com) + [Capacitor](https://capacitorjs.com).

## Features

- **Vite plugin** auto-registers Ionic components and icons from `html` templates
- **Bottom tabs** with `createBottomTabBar` + `createTabsLayout`
- **NavigationManager** — single authority for tabs, hooks, cache invalidation
- **Route guards** — `beforeEnter` with redirect support
- **Reactive overlays** — `createToast()`, `createAlert()`, etc.
- **IonBackButton** with router integration
- **Tab bar hiding** — hidden on login and detail pages via `hiddenPaths`
- **Optional Capacitor** — zero web bundle cost

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```text
src/
├── main.ts           # App entry — router, tabs, navigation manager
├── style.css         # Global styles + Ionic theme
├── stores/
│   └── auth.ts       # Auth store (signal-based)
└── pages/
    ├── HomePage.ts       # Home tab with toast demo
    ├── MapPage.ts        # Map tab with route list
    ├── RouteDetailPage.ts # Detail page (tab bar hidden, back button)
    ├── ProfilePage.ts    # Profile tab with alert + sign out
    └── LoginPage.ts      # Login page (no tabs, no guard)
```

## How tabs work

Navigation is driven by the Elur router, not Ionic's internal tab selection.
Each `ion-tab-button` uses `@click.prevent.stop` to prevent Ionic's `select()`.

```ts
const tabBar = createBottomTabBar([
  { path: "/", label: "Home", icon: "home-outline", activeIcon: "home", exact: true },
  { path: "/map", label: "Map", icon: "map-outline", activeIcon: "map" },
  { path: "/profile", label: "Profile", icon: "person-outline", activeIcon: "person" },
], {
  hiddenPaths: ["/login", "/map/route/*"],
  icons: { home, "home-outline": homeOutline, map, "map-outline": mapOutline, ... },
});

const tabsLayout = createTabsLayout(outlet, tabBar);
```

`createTabsLayout` wraps the outlet and tab bar in `<ion-tabs>` with injected
CSS to ensure the tab bar sits at the bottom.

## Route guards

```ts
const requireAuth = () => (authStore.isAuthenticated.value ? true : "/login");

const outlet = new IonRouterOutlet([
  { path: "/login", component: (ctx) => new LoginPage(ctx) },
  { path: "/", component: (ctx) => new HomePage(ctx), beforeEnter: requireAuth },
  { path: "/map", component: (ctx) => new MapPage(ctx), beforeEnter: requireAuth },
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
