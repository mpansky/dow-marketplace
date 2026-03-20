# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build` (runs `tsc -b && vite build`)
- **Lint:** `npm run lint`
- **Preview production build:** `npm run preview`

No test framework is configured yet.

## Path Alias

`@/*` maps to `./src/*` (configured in both tsconfig.json and vite.config.ts).

## Architecture

This is a **DoW (Department of Warfighter) Marketplace** — a defense innovation platform that connects military challenges with commercial technology vendors. It's a React 19 + TypeScript SPA using Vite, Tailwind CSS v4, and React Router v7.

### Role-Based System

The app has three user roles that control navigation, dashboards, and available features:
- **PAE** (Program Acquisition Executive) — creates challenges, reviews vendor matches, manages pipeline
- **NDC** (Non-traditional Defense Contractor) — browses challenges, submits solutions, manages vendor profile
- **Admin** — curates AI-generated matches, tracks adoption barriers, generates reports

Authentication is simulated via `RoleSelector` — selecting a role sets a default user and grants access to routes.

### State Management

All app state lives in a single `useReducer`-based context (`src/context/AppContext.tsx`). The `useApp()` hook provides `{ state, dispatch }`. Data is loaded from static fixtures in `src/data/` on mount via the `LOAD_DATA` action.

### Storefront Theming

The app supports multiple "storefronts" (INDOPACOM, CYBERCOM, Global), each with distinct accent colors and priority domains. Themes are applied by setting `data-storefront` attribute on `<html>` via `applyStorefrontTheme()` in `src/lib/themes.ts`. Storefront configs live in the same file.

### Vendor-Challenge Matching

`src/lib/matching.ts` contains a weighted scoring algorithm that matches vendors to challenges based on domain overlap (35%), TRL fit (20%), clearance level (15%), platform breadth (10%), past performance (10%), and health score (10%). This is mock logic — production would use an AI service.

### UI Components

UI primitives in `src/components/ui/` are shadcn/ui components built on Radix UI + class-variance-authority + tailwind-merge. Use these as building blocks rather than raw HTML elements.

### Key Domain Types

All types are in `src/types/index.ts`. Core entities: `Challenge`, `Vendor`, `Submission`, `Match`, `PipelineEntry`, `Barrier`. Label/color constants for enums (domains, platforms, pipeline stages, etc.) are co-located in the same file.

### Routes

Many routes in `App.tsx` use placeholder components (inline stubs returning "Coming soon"). Actual implementations exist for: Dashboard, StorefrontHome, and the role selector. Check the placeholder list in `App.tsx` before building a new page — the route already exists.
