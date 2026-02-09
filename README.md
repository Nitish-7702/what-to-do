# What To Do - AI-Powered Focus Assistant

**What To Do** is an intelligent productivity application designed to eliminate decision paralysis. Instead of overwhelming users with a massive list of tasks, it uses AI to analyze your current context—energy level, available time, and goals—to suggest the single most impactful "Next Action" you should focus on right now. It features a distraction-free focus timer, gamified history, and a premium subscription model for power users.

## 🛠️ Tech Stack

**Frontend**
- **Framework:** React 18 with TypeScript & Vite
- **Styling:** Tailwind CSS, shadcn/ui
- **Animations:** Framer Motion
- **State/Auth:** React Hooks, Clerk Authentication
- **HTTP Client:** Axios

**Backend**
- **Runtime:** Node.js & Express
- **Language:** TypeScript
- **Database ORM:** Prisma
- **AI Integration:** OpenAI API
- **Payments:** Stripe (Webhooks & Checkout)

**Infrastructure & Database**
- **Database:** PostgreSQL (Neon Tech)
- **Containerization:** Docker & Docker Compose
- **Hosting:** Vercel (Web), Railway/Fly.io (API)

## 🏗️ Architecture

```ascii
+----------------+       +------------------+       +-------------------+
|   Web Client   | ----> |    Express API   | ----> |  PostgreSQL (DB)  |
| (React + Vite) |       | (Node + Prisma)  |       |   (Neon Tech)     |
+----------------+       +------------------+       +-------------------+
       ^                          |
       |                          |
   (Auth/JWT)                     +----> [ OpenAI API ] (Task Intelligence)
       |                          |
    [ Clerk ]                     +----> [ Stripe ] (Payments & Subs)
```

## 🚀 Local Setup

### Option 1: Docker (Recommended)
Prerequisites: Docker Desktop installed.

1.  Clone the repository.
2.  Create a `.env` file in the root directory (see **Environment Variables** below).
3.  Run the application:
    ```bash
    docker-compose up --build
    ```
4.  Access the app:
    - Web: `http://localhost`
    - API: `http://localhost:4000`

### Option 2: Manual Setup
Prerequisites: Node.js 18+, PostgreSQL.

1.  **Database Setup:**
    - Ensure a Postgres instance is running.
    - Update `DATABASE_URL` in `api/.env`.

2.  **API Setup:**
    ```bash
    cd api
    npm install
    npx prisma migrate dev
    npm run dev
    ```

3.  **Web Setup:**
    ```bash
    cd web
    npm install
    npm run dev
    ```

## 🔑 Environment Variables

Create a `.env` file in the project root (for Docker) or separate `.env` files in `api/` and `web/`.

```env
# Shared / API
PORT=4000
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
CLIENT_URL=http://localhost:5173  # or http://localhost for Docker

# Web (if running manually, create web/.env)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:4000
```

## 📦 Deployment Guide

### 1. Database (Neon)
- Create a project on [Neon.tech](https://neon.tech).
- Get the connection string (`DATABASE_URL`).

### 2. API (Fly.io or Railway)
- **Railway:** Connect GitHub repo -> Select `/api` root -> Add variables.
- **Fly.io:** Run `fly launch` inside `/api`.
- **Important:** Run `npx prisma migrate deploy` during the build process (handled in Dockerfile).

### 3. Frontend (Vercel)
- Connect GitHub repo.
- Set Root Directory to `web`.
- Add Environment Variable: `VITE_API_URL` (Your production API URL).
- Deploy!

## 💳 Stripe Testing

This project uses Stripe for managing "Pro" subscriptions.
1.  Use the **Stripe CLI** to forward webhooks locally:
    ```bash
    stripe listen --forward-to localhost:4000/stripe/webhook
    ```
2.  Use the test card numbers provided by Stripe (e.g., `4242 4242 4242 4242`) in the checkout flow.
3.  Check the "Billing" page to see your status update to **Pro** instantly after payment.

## 📸 Screenshots

| Landing Page | Dashboard |
|:---:|:---:|
| ![Landing Page Placeholder](https://via.placeholder.com/400x250?text=Landing+Page) | ![Dashboard Placeholder](https://via.placeholder.com/400x250?text=Dashboard) |

| Focus Timer | Billing & Plans |
|:---:|:---:|
| ![Timer Placeholder](https://via.placeholder.com/400x250?text=Focus+Timer) | ![Billing Placeholder](https://via.placeholder.com/400x250?text=Billing) |
