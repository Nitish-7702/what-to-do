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

## 🚀 Getting Started (Manual Setup)

Follow these steps to get the project running on your local machine.

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL Database** (Local or Remote like Neon.tech)

### 2. Installation
This project is set up as a monorepo using npm workspaces. You can install dependencies for both the API and Web client from the root directory.

```bash
# Clone the repository
git clone https://github.com/Nitish-7702/what-to-do.git
cd what-to-do

# Install all dependencies (root, api, and web)
npm install
```

### 3. Environment Configuration
You need to set up environment variables for both the API and the Web client.

**API Configuration (`api/.env`)**
Create a file named `.env` in the `api` directory:
```env
PORT=3001
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
CLIENT_URL=http://localhost:3000
```

**Web Configuration (`web/.env`)**
Create a file named `.env` in the `web` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3001
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
VITE_CLERK_AFTER_SIGN_IN_URL=/
VITE_CLERK_AFTER_SIGN_UP_URL=/
```

### 4. Database Setup
Initialize the Prisma client and push the schema to your database.

```bash
cd api

# Generate Prisma Client
npx prisma generate

# Run Migrations (creates tables in your DB)
npx prisma migrate dev --name init

# (Optional) Seed the database if a seed script exists
# npx prisma db seed

cd ..
```

### 5. Running the Application
You can run both the API and Web client simultaneously from the root directory.

```bash
# Run both services
npm run dev
```

Alternatively, run them in separate terminals:

**Terminal 1 (API):**
```bash
cd api
npm run dev
# Server starts on http://localhost:3001
```

**Terminal 2 (Web):**
```bash
cd web
npm run dev
# Client starts on http://localhost:3000
```

## 🐳 Docker Setup (Optional)

If you prefer using Docker, ensure Docker Desktop is installed.

1.  Create the `.env` files as described above (or a combined root `.env` if using the docker-compose config).
2.  Run the stack:
    ```bash
    docker-compose up --build
    ```
3.  Access the app:
    - Web: `http://localhost:3000`
    - API: `http://localhost:3001`

## 📦 Deployment Guide

### Database (Neon)
1.  Create a project on [Neon.tech](https://neon.tech).
2.  Get the connection string and use it as `DATABASE_URL`.

### API (Railway/Fly.io)
1.  Connect your GitHub repo.
2.  Set the Root Directory to `api` (or configure build command to build `api`).
3.  Add all variables from `api/.env` to the deployment platform's environment variables.
4.  Update `CLIENT_URL` to your production frontend URL.

### Web (Vercel)
1.  Import the repo into Vercel.
2.  Set the Root Directory to `web`.
3.  Add all variables from `web/.env` to Vercel environment variables.
4.  Update `VITE_API_URL` to your production API URL.

## 📸 Screenshots
*(Placeholders for future screenshots)*
- **Dashboard:** Overview of your current focus.
- **Onboarding:** Setting up your profile and goals.
- **Focus Mode:** The distraction-free timer interface.
