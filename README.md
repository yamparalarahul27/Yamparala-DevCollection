# Proteus — Component Collection

A gallery of UI components, interaction experiments, and visual effects by
Yamparala Rahul, built with [Next.js](https://nextjs.org) (App Router),
React 19, Tailwind CSS 4, and React Three Fiber for the WebGL pieces.

Every component lives on its own route (buttons, inputs, charts, shaders,
scroll effects, …), and the homepage lists them all with search, category
filters, and last-updated dates derived from git history.

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on [http://localhost:3001](http://localhost:3001).

Other scripts:

```bash
npm run lint    # ESLint
npm run build   # production build (also runs TypeScript checks)
npm run start   # serve the production build
```

## Project layout

```
src/
  app/                  one route per component demo, plus the homepage
    api/component-source/  serves a component's source for the "view code" dock action
  components/           the reusable component implementations (+ CSS modules)
  lib/
    componentRegistry.ts  single source of truth for every component
public/               static assets (icons, reference images, Proteus assets)
```

## Adding a component

1. Build the component in `src/components/` (or inline in its page) and add a
   demo page at `src/app/<route>/page.tsx`, typically wrapped in
   `ComponentShell` so it gets the floating dock and code/prompt sheets.
2. Add one entry to `src/lib/componentRegistry.ts` with the route, title,
   description, card color, category, status, and the source files that make
   up the component.

The homepage card, dock navigation entry, and "view source" support are all
derived from that single registry entry — nothing else to update.

## Deployment

The site deploys as a standard Next.js app (e.g. on
[Vercel](https://vercel.com)). `next.config.ts` includes the component source
files in the `/api/component-source` function bundle so the "view code"
feature works in serverless deployments.
