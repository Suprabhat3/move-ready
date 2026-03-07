<div align="center">
  <img src="frontend/src/assets/logo.png" alt="MoveReady Logo" width="120" />
  <h1>🏠 MoveReady</h1>
  <p><strong>The new standard in rental housing management.</strong></p>
  <p>A full-stack platform that simplifies the rental journey — from discovery to digital move-ins.</p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#workflows">Core Workflows</a>
  </p>
</div>

---

## ✨ Features

MoveReady overhauls the traditional rental process, directly connecting tenants with curated properties and handling operations dynamically online.

- 🔍 **Smart Search:** Find verified listings perfectly matched to your desired city, budget, and amenities.
- 📅 **Visit Tracking:** Schedule visits effortlessly. The status stepper keeps you updated from Request to Final Decision.
- 📝 **Digital Move-in:** Clear checklists for smoother onboarding: digital document upload, fast approval, and inventory reviews.
- 👤 **Rental Management:** Complete tenant dashboard to manage stays, request extensions, and browse shortlisted properties simultaneously.
- 💬 **Support Tickets:** 24/7 dedicated support queues with threaded, prioritized messages till resolution.
- ⚡ **Real-time Approvals:** Direct owner verification, immediate alerts, and straightforward status dashboards.

## 🛠 Tech Stack

MoveReady is designed as a modern, type-safe monorepo separated into a dynamic React client and a robust Express backend.

### **Frontend**

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 + Tailwind-Vite plugin
- **State Management:** TanStack Query (Server State), Zustand (Client State)
- **Forms:** React Hook Form + Zod
- **Routing:** React Router DOM
- **Icons:** Lucide React

### **Backend**

- **Framework:** Node.js + Express
- **Database:** PostgreSQL (Hosted on Supabase)
- **ORM:** Prisma
- **Authentication:** Better Auth
- **Uploads:** Uploadthing
- **Emails:** Resend + React Email

## 🏗 Architecture

```
rental-platform/
├── packages/
│   ├── client/         # React + Vite — tenant & admin UI
│   ├── server/         # Node.js + Express — REST API
│   └── shared/         # Shared TypeScript types & Zod schemas
├── package.json        # Root workspace config
└── .env.example
```

Client requests are routed through the Express REST API. The backend uses Prisma to interact securely with the Supabase Postgres Database. Better Auth sessions run entirely in the Node.js layer, backed by Prisma.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (v9+)
- A Supabase Project (for PostgreSQL Database)
- A Better Auth configuration secret

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/moveready.git
    cd moveready
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Environment Variables:**
    Copy the `.env.example` files to `.env` in both the `packages/server` and `packages/client` directories.

    _Server `.env` example:_

    ```env
    DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
    BETTER_AUTH_SECRET=your-secret-32-chars-min
    BETTER_AUTH_URL=http://localhost:4000
    ```

    _Client `.env` example:_

    ```env
    VITE_API_URL=http://localhost:4000
    ```

    > ⚠️ **Note on Supabase:** Use the **Session Pooler** connection string (port `5432`, mode `session`) from the dashboard settings for Prisma migrations.

4.  **Database Setup:**

    ```bash
    pnpm --filter server run db:push
    # Or to generate a migration history:
    # pnpm --filter server run db:migrate
    ```

5.  **Run Development Servers:**
    ```bash
    pnpm run dev
    ```
    This concurrently spins up both the Vite client (typically `localhost:5173`) and the Express REST API (typically `localhost:4000`).

## 🔄 Core Workflows

### 🏠 Listing Lifecycle

Listings progress through strict states to maintain high quality on the platform.
`DRAFT` → `REVIEW` → `PUBLISHED` → `ARCHIVED`

### 🗓️ Visit Lifecycle

Tenants request visits, admins confirm schedules, and outcomes are tracked.
`REQUESTED` → `SCHEDULED` → `VISITED` → `DECISION (Interested, Applied, Not Interested)`

### 📦 Digital Move-In

When an application is accepted, an Admin initializes a `<MoveIn>` object.
The Tenant then works through dynamically generated Checklists (`Document Upload`, `Agreement Confirmation`, `Inventory Review`, `Payment`).
Completion of the final item updates the overarching move-in state.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
