# Nix.js Kit App

A full-stack application built with [Nix.js Kit](https://github.com/deiver/nix-js-kit).

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run SSR server
bun run start

# Typecheck
bun run check

# List routes
bun run routes

# Diagnose issues
bun run doctor
```

## Project Structure

```
src/
  app/              File-based routing
    page.ts         Home page (/)
    layout.ts       Root layout
    about/
      page.ts       About page (/about)
      page.data.ts  Loader for about page
    blog/
      [slug]/
        page.ts     Blog post (/blog/:slug)
        page.data.ts Loader for blog post
  islands/          Client-side islands
    Counter.ts      Interactive counter component
  content/          Content collections
    config.ts       Collection definitions
    blog/
      hello-world.md  Blog post content
public/             Static assets
  styles.css        Global styles
```

## Learn More

- [Nix.js Kit Documentation](https://github.com/deiver/nix-js-kit)
- [Nix.js Microframework](https://github.com/deiver/nix-js-microframework)
