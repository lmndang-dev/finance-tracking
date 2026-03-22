# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured yet.

## Architecture

This is a **Next.js 16.2.1 App Router** project. The AGENTS.md warning applies: this version has breaking changes — read `node_modules/next/dist/docs/01-app/` before writing any App Router code.

Key stack choices:
- **App Router** (`app/` directory) — no Pages Router
- **Tailwind CSS v4** — uses `@import "tailwindcss"` syntax (not `@tailwind base/components/utilities`); configured via `@tailwindcss/postcss` in `postcss.config.mjs`
- **TypeScript** with strict mode and `@/*` path alias resolving to the repo root
- **ESLint v9** with flat config format (`eslint.config.mjs`)

The `app/` directory follows the App Router convention: `layout.tsx` wraps all pages, `page.tsx` files define routes. Fonts are loaded via `next/font/google` and injected as CSS variables in the root layout.
