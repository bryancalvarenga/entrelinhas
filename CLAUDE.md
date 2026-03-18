# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Entrelinhas** is a full-stack social network focused on well-being — no public likes, no follower counts, no infinite feeds, no algorithmic ranking. Text-based, minimalist, and intentional.

- **Frontend:** Next.js (App Router) in `apps/web/` — scaffolded with mock data, not yet connected to API
- **Backend:** NestJS in `apps/api/` — implemented with Prisma + PostgreSQL
- **Language:** Portuguese (pt-BR)

## Commands

**Frontend** (`apps/web/`):
```bash
cd apps/web
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run lint     # ESLint
```

**Backend** (`apps/api/`):
```bash
cd apps/api
npm install
npm run dev          # NestJS with watch mode (port 3001)
npm run build        # Compile TypeScript
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:migrate   # Run migrations (needs DATABASE_URL in .env)
npm run db:studio    # Open Prisma Studio
```

Copy `apps/api/.env.example` to `apps/api/.env` and set `DATABASE_URL` and `JWT_SECRET` before starting.

No root-level workspace — each app has its own `package.json`.

## Backend Architecture (`apps/api/`)

**Stack:** NestJS + Prisma + PostgreSQL + JWT (stateless)

**Module structure** (`src/`):

| Module | Responsibility |
|---|---|
| `auth` | Register, login, JWT signing. Register creates User + Profile + WellbeingSettings atomically. |
| `onboarding` | One-time POST to set name, username, bio, interests, intentions. Guarded — cannot repeat. |
| `profiles` | Public profile by username (no follower count). GET/PATCH for authenticated user's own profile. |
| `posts` | Create, get by ID (public, no touch count), delete (author only). |
| `replies` | List replies for a post (public). Create reply (authenticated). Triggers `new_reply` notification. |
| `touches` | Private "Isso me tocou" interaction. Returns only `{ touched: boolean }`. No counter ever exposed. |
| `saved-posts` | Private collection. Save/unsave/list. Completely isolated from public endpoints. |
| `follows` | Follow/unfollow by username. Returns only `{ following: boolean }`. Triggers `new_follower` notification. Used internally by feed. |
| `feed` | GET /feed — authenticated. Posts from followed users + interest-matching complement. Hard cap: 12 (limitedFeed=true) or 20. No popularity sorting. |
| `notifications` | Types: `new_reply`, `new_follower` only. No touch notifications. List unread, mark read. |
| `wellbeing` | User's well-being settings: reducedNotifications, hideInteractions, limitedFeed, silentMode, darkMode. |
| `database` | Global `PrismaService`. Injected across all modules. |

**JWT payload:** `{ sub: userId, profileId }` — both IDs available in `req.user` on protected routes.

## Prisma Schema (`apps/api/prisma/schema.prisma`)

Key models and their privacy rules:

- **`Touch`** — composite PK `[profileId, postId]`. Never queried in public endpoints. `_count` never selected.
- **`Follow`** — composite PK `[followerId, followingId]`. Count never returned publicly.
- **`SavedPost`** — composite PK `[profileId, postId]`. Only accessible by the owner.
- **`WellbeingSettings`** — PK is `userId`. Created with defaults on register.
- **`Post`** — `repliesCount` is always `_count.replies` (derived), never stored. `touchedCount` does not exist.

Enums: `Interest`, `PostIntention`, `OnboardingIntention`, `NotificationType`.

## Frontend Architecture (`apps/web/`)

Uses **Next.js App Router** with route groups:

- `app/(app)/` — protected routes: `feed/`, `new/`, `post/[id]/`, `profile/`, `profile/[username]/`, `search/`, `settings/`
- `app/onboarding/` — onboarding wizard (3 steps)
- `app/page.tsx` — landing/login page

**Key conventions:**
- Path alias `@/*` maps to `apps/web/*`
- UI: shadcn/ui (New York style, neutral base, Lucide icons) in `components/ui/`
- Types in `lib/types.ts`, mock data in `lib/mock-data.ts` (to be replaced by API calls)
- Theming via OKLCH color tokens in `styles/globals.css`, dark mode via `next-themes`
- Forms: `react-hook-form` + `zod`

## Product Rules (non-negotiable)

- **No touch/like counters** — ever, in any endpoint or UI element
- **No follower/following counts** in public profiles
- **No popularity-based sorting** in feed or search
- **No infinite scroll** — feed has a hard session cap
- **No touch notifications** — author never knows their post was touched
- **Notifications limited** to `new_reply` and `new_follower` only

## Key Docs

- `docs/context.md` — product vision, core features, entities
- `docs/architecture.md` — tech stack and module priorities
- `docs/rules.md` — technical and product constraints
