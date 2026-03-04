# 🏠 Rental Housing Platform — Implementation Plan

> **Stack:** React + Vite · Node.js + Express · PostgreSQL (Neon) · Prisma · Better Auth · REST API

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Database Schema](#2-database-schema)
3. [Authentication](#3-authentication)
4. [REST API Design](#4-rest-api-design)
5. [Project Setup](#5-project-setup)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Implementation Phases](#7-implementation-phases)
8. [Tech Decisions](#8-tech-decisions)
9. [Core Workflows](#9-core-workflows)

---

## 1. Project Overview

A full-stack rental housing platform split into two separate applications — a React frontend and an Express backend — connected over a REST API. Neon is used as the hosted PostgreSQL provider; Prisma handles all database access. Better Auth runs in the Express layer for session management.

```
Client (React + Vite)  →  REST API  →  Express Server  →  Prisma  →  Neon (Postgres)
```

### Monorepo Structure

```
rental-platform/
├── packages/
│   ├── client/         # React + Vite — tenant & admin UI
│   ├── server/         # Node.js + Express — REST API
│   └── shared/         # Shared TypeScript types & Zod schemas
├── package.json        # Root workspace config
└── .env.example
```

### Detailed Directory Layout

```
packages/client/src/
├── pages/              # Route pages (listings, dashboard, visits, admin)
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks (useListings, useVisits, etc.)
├── services/           # Axios API call wrappers
├── store/              # Zustand stores (compare, shortlist)
└── types/              # Re-exported from shared package

packages/server/src/
├── routes/             # Express routers (listings, visits, move-in, tickets, admin)
├── controllers/        # Business logic handlers
├── middleware/         # Auth guards, error handler, file upload
├── lib/                # Prisma client, Better Auth config
└── types/              # Server-side extended types

packages/shared/src/
├── types.ts            # All shared TypeScript interfaces
└── schemas.ts          # Zod validation schemas
```

---

## 2. Database Schema

> Neon acts as the hosted serverless PostgreSQL provider. `DATABASE_URL` points to the Neon connection string. Prisma manages all migrations.

### Enums

```prisma
enum Role            { TENANT  ADMIN }
enum ListingStatus   { DRAFT  REVIEW  PUBLISHED  ARCHIVED }
enum FurnishedType   { UNFURNISHED  SEMI_FURNISHED  FULLY_FURNISHED }
enum VisitStatus     { REQUESTED  SCHEDULED  VISITED  DECISION  CANCELLED }
enum VisitDecision   { INTERESTED  NOT_INTERESTED  APPLIED }
enum MoveInStatus    { IN_PROGRESS  COMPLETED  CANCELLED }
enum ChecklistType   { DOCUMENT_UPLOAD  AGREEMENT_CONFIRMATION  INVENTORY_REVIEW  PAYMENT  OTHER }
enum ExtensionStatus { PENDING  APPROVED  REJECTED }
enum TicketStatus    { OPEN  IN_PROGRESS  RESOLVED  CLOSED }
enum Priority        { LOW  MEDIUM  HIGH  URGENT }
```

### User Model

```prisma
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  name            String?
  emailVerified   Boolean  @default(false)
  image           String?
  role            Role     @default(TENANT)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Better Auth relations
  sessions        Session[]
  accounts        Account[]

  // Tenant relations
  visits          Visit[]
  shortlists      Shortlist[]
  tickets         SupportTicket[]
  ticketMessages  TicketMessage[]
  moveIns         MoveIn[]
  extensionReqs   ExtensionRequest[]

  // Admin relations
  reviewedListings Listing[] @relation("ReviewedBy")
}

model Session {
  id        String   @id
  userId    String
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id           String  @id @default(cuid())
  userId       String
  providerId   String
  accountId    String
  accessToken  String?
  refreshToken String?
  user         User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
}
```

### Listing Model

```prisma
model Listing {
  id            String        @id @default(cuid())
  title         String
  description   String
  status        ListingStatus @default(DRAFT)

  // Location
  address       String
  city          String
  state         String
  pincode       String

  // Pricing (stored in paise)
  rentAmount    Int
  deposit       Int

  // Details
  bedrooms      Int
  bathrooms     Int
  area          Float
  furnished     FurnishedType @default(UNFURNISHED)
  availableFrom DateTime

  // JSON arrays
  amenities     String[]
  rules         String[]

  images        ListingImage[]
  visits        Visit[]
  shortlists    Shortlist[]
  moveIns       MoveIn[]

  reviewedById  String?
  reviewedBy    User?    @relation("ReviewedBy", fields: [reviewedById], references: [id])
  publishedAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model ListingImage {
  id        String  @id @default(cuid())
  listingId String
  url       String
  caption   String?
  order     Int     @default(0)
  listing   Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)
}
```

### Operations Models

```prisma
model Visit {
  id          String         @id @default(cuid())
  listingId   String
  tenantId    String
  status      VisitStatus    @default(REQUESTED)
  proposedAt  DateTime
  scheduledAt DateTime?
  visitedAt   DateTime?
  decision    VisitDecision?
  notes       String?
  listing     Listing @relation(fields: [listingId], references: [id])
  tenant      User    @relation(fields: [tenantId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Shortlist {
  id        String   @id @default(cuid())
  tenantId  String
  listingId String
  createdAt DateTime @default(now())
  tenant    User     @relation(fields: [tenantId], references: [id])
  listing   Listing  @relation(fields: [listingId], references: [id])

  @@unique([tenantId, listingId])
}

model MoveIn {
  id          String       @id @default(cuid())
  tenantId    String
  listingId   String
  status      MoveInStatus @default(IN_PROGRESS)
  moveInDate  DateTime
  checklist   MoveInChecklistItem[]
  inventory   InventoryItem[]
  extensionRequests ExtensionRequest[]
  tenant      User    @relation(fields: [tenantId], references: [id])
  listing     Listing @relation(fields: [listingId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model MoveInChecklistItem {
  id          String        @id @default(cuid())
  moveInId    String
  type        ChecklistType
  label       String
  completed   Boolean       @default(false)
  fileUrl     String?
  completedAt DateTime?
  moveIn      MoveIn @relation(fields: [moveInId], references: [id], onDelete: Cascade)
}

model InventoryItem {
  id        String  @id @default(cuid())
  moveInId  String
  name      String
  condition String?
  quantity  Int     @default(1)
  notes     String?
  moveIn    MoveIn  @relation(fields: [moveInId], references: [id], onDelete: Cascade)
}

model ExtensionRequest {
  id            String          @id @default(cuid())
  moveInId      String
  tenantId      String
  requestedTill DateTime
  reason        String
  status        ExtensionStatus @default(PENDING)
  moveIn        MoveIn @relation(fields: [moveInId], references: [id])
  tenant        User   @relation(fields: [tenantId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model SupportTicket {
  id        String       @id @default(cuid())
  tenantId  String
  subject   String
  status    TicketStatus @default(OPEN)
  priority  Priority     @default(MEDIUM)
  messages  TicketMessage[]
  tenant    User         @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model TicketMessage {
  id        String   @id @default(cuid())
  ticketId  String
  authorId  String
  content   String
  fileUrl   String?
  ticket    SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  author    User          @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}
```

---

## 3. Authentication

> Better Auth runs entirely in the Express server. It exposes auth routes at `/api/auth/*` and uses Prisma to persist sessions in the database. The React client uses the Better Auth client SDK.

### Server Setup

```typescript
// packages/server/src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: { expiresIn: 60 * 60 * 24 * 7 }, // 7 days
});

// Mount in Express:
// app.use('/api/auth/*', toNodeHandler(auth));
```

### Auth Middleware

```typescript
// packages/server/src/middleware/requireAuth.ts
import { auth } from "../lib/auth";

export async function requireAuth(req, res, next) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  req.user = session.user;
  next();
}

export async function requireAdmin(req, res, next) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || session.user.role !== "ADMIN")
    return res.status(403).json({ error: "Forbidden" });
  req.user = session.user;
  next();
}
```

### React Client

```typescript
// packages/client/src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
});

// Usage:
// const { data: session } = authClient.useSession();
// authClient.signIn.email({ email, password });
// authClient.signOut();
```

### Auth Flow

| Step            | Endpoint                  | Details                                        |
| --------------- | ------------------------- | ---------------------------------------------- |
| Register        | `POST /api/auth/sign-up`  | Better Auth handles hashing + session creation |
| Login           | `POST /api/auth/sign-in`  | Returns session token                          |
| Session check   | `GET /api/auth/session`   | Returns current user + role                    |
| Protected route | Any `/api/*`              | `requireAuth` middleware validates session     |
| Admin route     | Any `/api/admin/*`        | `requireAdmin` checks `role === ADMIN`         |
| Sign out        | `POST /api/auth/sign-out` | Deletes session from DB                        |

---

## 4. REST API Design

### Listings

| Method  | Endpoint                     | Auth   | Description                                                                     |
| ------- | ---------------------------- | ------ | ------------------------------------------------------------------------------- |
| `GET`   | `/api/listings`              | Public | Browse with filters: `city`, `minRent`, `maxRent`, `availableFrom`, `furnished` |
| `GET`   | `/api/listings/:id`          | Public | Full detail with images, amenities, rules                                       |
| `GET`   | `/api/listings/compare?ids=` | Tenant | Side-by-side comparison of 2–3 listings                                         |
| `POST`  | `/api/listings`              | Admin  | Create listing (starts as DRAFT)                                                |
| `PATCH` | `/api/listings/:id`          | Admin  | Update listing fields                                                           |
| `PATCH` | `/api/listings/:id/status`   | Admin  | Change status: DRAFT → REVIEW → PUBLISHED → ARCHIVED                            |

### Visits

| Method  | Endpoint                         | Auth   | Description                                             |
| ------- | -------------------------------- | ------ | ------------------------------------------------------- |
| `POST`  | `/api/visits`                    | Tenant | Request visit with `listingId` + `proposedAt` + `notes` |
| `GET`   | `/api/visits/me`                 | Tenant | All visits for current tenant                           |
| `PATCH` | `/api/visits/:id/decision`       | Tenant | Set INTERESTED / NOT_INTERESTED / APPLIED               |
| `PATCH` | `/api/visits/:id/cancel`         | Tenant | Cancel a visit                                          |
| `GET`   | `/api/admin/visits`              | Admin  | All visits, filterable by status                        |
| `PATCH` | `/api/admin/visits/:id/schedule` | Admin  | Set `scheduledAt`, move to SCHEDULED                    |
| `PATCH` | `/api/admin/visits/:id/confirm`  | Admin  | Mark as VISITED                                         |

### Shortlist

| Method | Endpoint                    | Auth   | Description                   |
| ------ | --------------------------- | ------ | ----------------------------- |
| `POST` | `/api/shortlist/:listingId` | Tenant | Toggle shortlist (add/remove) |
| `GET`  | `/api/shortlist/me`         | Tenant | All shortlisted listings      |

### Move-In & Operations

| Method  | Endpoint                             | Auth         | Description                         |
| ------- | ------------------------------------ | ------------ | ----------------------------------- |
| `POST`  | `/api/move-in`                       | Admin        | Create move-in for tenant + listing |
| `GET`   | `/api/move-in/me`                    | Tenant       | Active move-in for current tenant   |
| `GET`   | `/api/move-in/:id/checklist`         | Tenant       | All checklist items                 |
| `PATCH` | `/api/move-in/:id/checklist/:itemId` | Tenant       | Mark complete, attach `fileUrl`     |
| `GET`   | `/api/move-in/:id/inventory`         | Tenant       | Inventory list                      |
| `POST`  | `/api/move-in/:id/inventory`         | Tenant/Admin | Add inventory item                  |
| `POST`  | `/api/move-in/:id/extension`         | Tenant       | Request stay extension              |
| `PATCH` | `/api/admin/extension/:id`           | Admin        | Approve or reject extension         |

### Support Tickets

| Method  | Endpoint                        | Auth         | Description                                |
| ------- | ------------------------------- | ------------ | ------------------------------------------ |
| `POST`  | `/api/tickets`                  | Tenant       | Create ticket with subject + first message |
| `GET`   | `/api/tickets/me`               | Tenant       | All tickets for current tenant             |
| `GET`   | `/api/tickets/:id`              | Tenant/Admin | Ticket detail with threaded messages       |
| `POST`  | `/api/tickets/:id/messages`     | Tenant/Admin | Add reply to thread                        |
| `PATCH` | `/api/admin/tickets/:id/status` | Admin        | Change status                              |
| `GET`   | `/api/admin/tickets`            | Admin        | All tickets sorted by priority             |

---

## 5. Project Setup

### Monorepo Init

```json
// package.json (root)
{
  "name": "rental-platform",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "dev": "concurrently \"npm run dev -w server\" \"npm run dev -w client\"",
    "db:push": "npm run db:push -w server",
    "db:migrate": "npm run db:migrate -w server"
  }
}
```

### Dependencies

```bash
# packages/server
npm install express better-auth @prisma/client
npm install zod cors helmet morgan dotenv multer
npm install -D typescript @types/express @types/node ts-node-dev prisma

# packages/client
npm create vite@latest client -- --template react-ts
npm install axios react-router-dom zustand @tanstack/react-query
npm install better-auth react-hook-form zod date-fns
npm install -D tailwindcss @shadcn/ui
```

### Environment Variables

```env
# packages/server/.env
DATABASE_URL=postgresql://[user]:[password]@[project].neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=your-secret-32-chars-min
BETTER_AUTH_URL=http://localhost:4000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
UPLOADTHING_SECRET=your-uploadthing-secret
RESEND_API_KEY=your-resend-api-key

# packages/client/.env
VITE_API_URL=http://localhost:4000
```

> ⚠️ **Neon Note:** Use the connection string directly from the Neon dashboard. A connection pooler string (ends with `?sslmode=require`) is usually optimal.

### Prisma Commands

```bash
npx prisma init          # Creates schema.prisma + .env placeholder
npx prisma db push       # Push schema to Neon (dev/prototyping)
npx prisma migrate dev   # Create migration files (production workflow)
npx prisma generate      # Regenerate Prisma Client after schema changes
npx prisma studio        # Visual DB browser at localhost:5555
```

---

## 6. Frontend Architecture

### Route Structure

```
/login                        → LoginPage             (Public)
/register                     → RegisterPage          (Public)
/listings                     → ListingsBrowsePage    (Public)
/listings/:id                 → ListingDetailPage     (Public)
/listings/compare             → CompareListingsPage   (Tenant)
/dashboard                    → TenantDashboard       (Tenant)
/visits                       → VisitTrackerPage      (Tenant)
/shortlist                    → ShortlistPage         (Tenant)
/move-in/:id/checklist        → ChecklistPage         (Tenant)
/move-in/:id/inventory        → InventoryPage         (Tenant)
/tickets                      → TicketsListPage       (Tenant)
/tickets/:id                  → TicketThreadPage      (Tenant/Admin)
/admin                        → AdminDashboard        (Admin)
/admin/listings               → AdminListingsPage     (Admin)
/admin/listings/:id/review    → ListingReviewPage     (Admin)
/admin/tickets                → AdminTicketsPage      (Admin)
```

### State Management

| State Type   | Tool                  | Used For                                               |
| ------------ | --------------------- | ------------------------------------------------------ |
| Server state | TanStack Query        | All API fetching, caching, mutations                   |
| Client state | Zustand               | Compare basket (2–3 listings), optimistic shortlist UI |
| Form state   | React Hook Form + Zod | All forms with validation                              |
| Auth state   | Better Auth client    | Session, sign in/out                                   |

### Key Component Breakdown

#### Tenant Dashboard

- `StatsBar` — active visits count, shortlisted count, open tickets
- `RecentVisits` — last 3 visits with status pill badge
- `MoveInProgress` — checklist progress ring (X/Y complete)
- `RecentTickets` — open tickets with priority badge

#### Listings Browse

- `FilterBar` — city input, rent range slider, date picker, furnished toggle
- `ListingGrid` — card grid with thumbnail, price, bedrooms, shortlist icon
- `CompareDrawer` — sticky bottom tray when 1+ listings added (max 3)

#### Visit Tracker

- `VisitCard` — property thumbnail + address
- `StatusStepper` — 4-step bar: Requested → Scheduled → Visited → Decision
- `ActionRow` — cancel (if REQUESTED/SCHEDULED), decision selector (if VISITED)

#### Move-In Checklist

- `ProgressHeader` — filled ring showing X of Y complete
- `ChecklistSection` — grouped by type: DOCUMENT_UPLOAD, AGREEMENT, INVENTORY_REVIEW
- `InventoryTable` — editable table with name, quantity, condition
- `ExtensionForm` — date picker + reason textarea

#### Admin Listings Board

- `KanbanBoard` — three columns: Draft | Under Review | Published
- `ListingCard` — quick status change buttons
- `ListingReviewModal` — full property preview + Approve / Reject actions

---

## 7. Implementation Phases

### Phase 1 — Foundation `Week 1`

- [ ] Initialize monorepo with workspaces
- [ ] Set up Express with TypeScript, cors, helmet, morgan
- [ ] Create Vite React app with Tailwind + Shadcn/ui
- [ ] Write Prisma schema and run first migration against Neon
- [ ] Configure Better Auth in Express (email + Google OAuth)
- [ ] Build login / register pages in React client
- [ ] Set up TanStack Query provider and Axios instance
- [ ] Create shared Zod schemas for all models

### Phase 2 — Listings & Browse `Week 2`

- [ ] `GET /api/listings` with filters
- [ ] `GET /api/listings/:id` full detail
- [ ] Listings browse page with FilterBar + ListingGrid
- [ ] Property detail page: gallery, amenities, rules, availability
- [ ] Shortlist toggle + shortlist page
- [ ] Compare page (2–3 properties side-by-side)
- [ ] Admin: create/edit listing form
- [ ] Admin: listing status workflow (Draft → Review → Published)
- [ ] Admin listings board with Kanban columns

### Phase 3 — Visits `Week 3`

- [ ] `POST /api/visits` — request visit from property page
- [ ] `GET /api/visits/me` — tenant visit list
- [ ] Visit tracker with StatusStepper component
- [ ] Visit decision flow (INTERESTED / NOT_INTERESTED / APPLIED)
- [ ] Cancel visit
- [ ] Admin: schedule + confirm visit endpoints
- [ ] Admin visits management table with status filter
- [ ] Email notification on visit scheduled (Resend)

### Phase 4 — Move-In & Operations `Week 4`

- [ ] Move-in creation by admin
- [ ] Move-in checklist API (GET + PATCH per item)
- [ ] File upload for checklist documents (Uploadthing)
- [ ] Inventory list CRUD
- [ ] Checklist UI with progress ring + section groups
- [ ] Extension request form + admin approval flow
- [ ] Support ticket creation + list page
- [ ] Threaded ticket message view with file attachments
- [ ] Admin ticket queue with priority sorting

### Phase 5 — Dashboards & Polish `Week 5`

- [ ] Tenant dashboard with real stat counters
- [ ] Admin dashboard: pending reviews, open tickets, recent activity
- [ ] Global loading states + skeleton screens
- [ ] Error boundaries + empty state components
- [ ] Mobile responsiveness pass
- [ ] Role-based redirect after login
- [ ] Final QA across all workflows

---

## 8. Tech Decisions

| Concern             | Choice                | Reason                                                            |
| ------------------- | --------------------- | ----------------------------------------------------------------- |
| Database hosting    | Neon (Postgres)       | Serverless Postgres, compute scaling, branching, free tier        |
| ORM                 | Prisma                | Type-safe queries, migrations, excellent TS integration           |
| Auth                | Better Auth + Express | Runs in Node, Prisma adapter, supports OAuth, no vendor lock-in   |
| File uploads        | Uploadthing           | Simple Express integration, handles S3 backing automatically      |
| API fetching        | TanStack Query        | Caching, background refetch, built-in loading/error state         |
| Global client state | Zustand               | Lightweight — used only for compare basket + optimistic shortlist |
| Forms               | React Hook Form + Zod | Shared Zod schemas between client and server validation           |
| Email               | Resend + React Email  | Developer-friendly transactional emails with React templates      |
| Date handling       | date-fns              | Lightweight, tree-shakeable                                       |
| Admin tables        | TanStack Table        | Headless, flexible sorting/filtering                              |
| Styling             | Tailwind + Shadcn/ui  | Fast UI with consistent design tokens + accessible components     |

---

## 9. Core Workflows

### Listing Lifecycle

```
DRAFT → REVIEW → PUBLISHED → ARCHIVED
  ↑         ↑         ↑
Admin     Admin     Admin
creates  submits  approves
```

| Status    | Who Triggers   | Action                                        |
| --------- | -------------- | --------------------------------------------- |
| DRAFT     | Admin creates  | Fill fields, upload images, submit for review |
| REVIEW    | Admin submits  | Senior admin reviews content                  |
| PUBLISHED | Admin approves | Visible on browse page to all tenants         |
| ARCHIVED  | Admin archives | Hidden from browse, data retained             |

### Visit Lifecycle

```
REQUESTED → SCHEDULED → VISITED → DECISION
                                      ↓
                           INTERESTED / NOT_INTERESTED / APPLIED
```

| Status    | Actor           | Details                             |
| --------- | --------------- | ----------------------------------- |
| REQUESTED | Tenant          | Submits with preferred date/time    |
| SCHEDULED | Admin           | Confirms slot, tenant gets email    |
| VISITED   | Admin           | Marks complete after physical visit |
| DECISION  | Tenant          | Sets outcome                        |
| CANCELLED | Tenant or Admin | Can cancel before VISITED           |

### Move-In Checklist Workflow

1. Admin creates `MoveIn` record linked to tenant + listing
2. System auto-creates checklist items: ID proof, agreement confirmation, inventory review, payment
3. Tenant works through checklist — uploads documents, confirms agreement
4. Each item patched individually with `completed: true` + optional `fileUrl`
5. When all items complete → `MoveIn.status` moves to `COMPLETED`
6. Tenant can request extension at any point — admin approves/rejects

### Support Ticket Workflow

1. Tenant creates ticket with subject + first message
2. Admin sees ticket in queue sorted by priority `URGENT → HIGH → MEDIUM → LOW`
3. Admin replies → status moves to `IN_PROGRESS`
4. Both parties add threaded messages with optional file attachments
5. Admin marks `RESOLVED` → moves to `CLOSED` after confirmation
