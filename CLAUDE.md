# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

---

## How to Run

### Prerequisites
- Node.js 18+
- pnpm
- A Supabase project (PostgreSQL host only)
- A Resend account (transactional email)

### 1. Install dependencies
```bash
pnpm install
```

### 2. Configure environment
Copy the values into `.env.local`:
```
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
AUTH_SECRET=<run: openssl rand -base64 32>
RESEND_API_KEY=re_...
RESEND_FROM=FinTrack <no-reply@yourdomain.com>
NEXTAUTH_URL=http://localhost:3000
```
- `DATABASE_URL`: Supabase Dashboard → Project Settings → Database → URI → **Session Pooler** (required for IPv4 networks)
- `AUTH_SECRET`: random 32-byte secret for signing JWTs

### 3. Push schema and generate Prisma client
```bash
npx prisma db push
npx prisma generate
```

### 4. Seed categories and subcategories
```bash
npx prisma db seed
```

### 5. Start development server
```bash
pnpm run dev
```

---

## Commands

```bash
pnpm run dev     # Start development server (http://localhost:3000)
pnpm run build   # Build for production
pnpm run start   # Start production server
pnpm run lint    # Run ESLint
npx prisma studio                          # Open DB GUI at localhost:5555
npx prisma db push                         # Sync schema to database
npx prisma generate                        # Regenerate Prisma client
npx prisma db seed                         # Seed system categories + subcategories
npx tsx prisma/seed-transactions.ts        # Seed test transactions (dev only)
```

No test runner is configured yet.

---

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | Next.js 16.2.1 (App Router) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript (strict mode) |
| Auth sessions | NextAuth.js v5 (beta) — JWT strategy |
| Password hashing | bcryptjs |
| ORM | Prisma 7 (`prisma-client` generator + `@prisma/adapter-pg`) |
| Database | PostgreSQL via Supabase (connection string only, no Supabase Auth) |
| Email | Resend |
| Linting | ESLint v9 (flat config) |

---

## Architecture

### Next.js 16.2.1 breaking changes
- Middleware is now called **Proxy** — file is `proxy.ts`, named export `proxy` (not `middleware`)
- Read `node_modules/next/dist/docs/01-app/` before writing App Router code

### Tailwind CSS v4
- Uses `@import "tailwindcss"` (not `@tailwind base/components/utilities`)
- Theme defined in `app/globals.css` via `@theme inline`
- Color palette: `primary` `#3B3B98`, `secondary` `#4B6584`, `background` `#F5F5F7`, `surface` `#FFFFFF`, `income` `#A8E6CF`, `expense` `#FC5C65`

### Prisma 7
- Generator is `prisma-client` (not `prisma-client-js`) — outputs TypeScript-first client to `app/generated/prisma/`
- Import from `@/app/generated/prisma/client` (not the directory root)
- Requires a driver adapter: `PrismaPg` from `@prisma/adapter-pg`
- Config lives in `prisma.config.ts` (loads `.env.local` then `.env`)
- Seed command is configured in `prisma.config.ts` under `migrations.seed` (not `package.json`)
- `DATABASE_URL` must use the **Session Pooler** (port `5432` on pooler host, not `6543`) for `db push` to work

### Auth architecture
```
auth.config.ts   ← edge-safe config (no Prisma) — used in proxy.ts
auth.ts          ← full config (Credentials provider + Prisma) — used in API routes and server components
proxy.ts         ← reads session via auth wrapper, guards routes
```

**Route protection rules (proxy.ts):**
- Unauthenticated → `/dashboard`, `/admin` redirect to `/login`
- Authenticated → `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password` redirect to `/dashboard`

**Email verification:**
- Users are created immediately on signup with `emailVerified = null`
- Login is blocked until `emailVerified` is set (clicking the verification link)
- Password reset is blocked for unverified accounts

### API routes (`app/api/auth/`)

| Route | Method | Purpose |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handler |
| `/api/auth/signup` | POST | Create user, send verification email |
| `/api/auth/verify` | GET | Consume verification token, set `emailVerified` |
| `/api/auth/check-verified` | POST | Check password then `emailVerified` (used by login page for specific error messages) |
| `/api/auth/forgot-password` | POST | Send password reset email (blocked if unverified) |
| `/api/auth/reset-password` | POST | Consume reset token, update password |

### Pages

| Route | Description |
|---|---|
| `/` | Landing page (redirects to `/dashboard` if logged in) |
| `/login` | Login with email/password, real-time validation |
| `/signup` | Signup with name/email/password, password checklist |
| `/forgot-password` | Request password reset link |
| `/reset-password?token=...` | Set new password via token |
| `/dashboard` | Protected — left sidebar with nav + logout |

### Data model

#### Enums
- `TransactionType` — `INCOME | EXPENSE`
- `RecurringType` — `SUBSCRIPTION | BILL | SALARY | LOAN_PAYMENT | RENT | OTHER`
- `Role` — `USER | ADMIN`

#### Models
| Model | Description |
|---|---|
| `User` | Auth user — owns transactions |
| `PasswordResetToken` | Short-lived token for password reset emails |
| `Category` | System-defined parent categories (10 EXPENSE + 5 INCOME), fixed — never user-editable |
| `Subcategory` | System-defined subcategories under each category, fixed |
| `Transaction` | User financial entry — requires `userId`, `categoryId`, `type`, `amount`, `date`; subcategory/note/recurring are optional |

#### Category system rules
- All categories and subcategories are **system-defined and read-only** — seeded once, never modified by users
- 10 EXPENSE categories: Food & Beverage, Transportation, Shopping, Housing & Bills, Health, Entertainment, Education, Travel, Personal Care, Others
- 5 INCOME categories: Salary, Business, Investment, Gift & Transfer, Others
- "Others" categories have no subcategories — users write a note instead
- `subcategoryId` on `Transaction` is **nullable** — category selection is required, subcategory is optional
- Icons use **Lucide React** icon names stored as strings (e.g. `"utensils"`, `"briefcase"`)
- Render icons dynamically: `const Icon = icons[category.icon as keyof typeof icons]`

### Key files
```
auth.config.ts               Edge-safe NextAuth config
auth.ts                      Full NextAuth config (Node.js only)
proxy.ts                     Route protection middleware
lib/prisma.ts                Singleton Prisma client with PrismaPg adapter
lib/email.ts                 Resend email helpers (verification + password reset)
prisma/schema.prisma         All models: User, PasswordResetToken, Category, Subcategory, Transaction
prisma/seed.ts               Seeds system categories + subcategories (run once)
prisma/seed-transactions.ts  Seeds test transactions for a hardcoded userId (dev only)
prisma.config.ts             Prisma config (loads .env.local, sets seed command)
app/Providers.tsx            SessionProvider wrapper for client components
app/layout.tsx               Root layout with Providers
app/dashboard/Sidebar.tsx    Left nav sidebar with logout button
```
