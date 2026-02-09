# PERN Monorepo Scaffold

This is a monorepo setup for a full-stack PERN (Postgres, Express, React, Node) application.

## Structure

- **/api**: Node.js, Express, TypeScript, Prisma, Zod.
- **/web**: Vite, React, TypeScript, TailwindCSS, shadcn/ui.
- **/infra**: Docker Compose configuration for PostgreSQL.

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- npm (v7+)

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Infrastructure (Database)**
    ```bash
    npm run db:up
    ```

3.  **Setup Environment Variables**
    
    Copy `.env.example` to `.env` in `/api`:
    ```bash
    cp api/.env.example api/.env
    ```
    
    *Note: The default database URL matches the docker-compose configuration.*

4.  **Initialize Database**
    ```bash
    cd api
    npx prisma migrate dev --name init
    cd ..
    ```

5.  **Run Development Servers**
    ```bash
    npm run dev
    ```
    - API: [http://localhost:3001](http://localhost:3001)
    - Web: [http://localhost:3000](http://localhost:3000)

## Commands

- `npm run dev`: Start both API and Web in development mode.
- `npm run build`: Build both packages.
- `npm run lint`: Lint both packages.
- `npm run db:up`: Start Postgres container.
- `npm run db:down`: Stop Postgres container.

## Architecture Highlights

- **Monorepo**: Managed via npm workspaces.
- **Validation**: Zod used for environment variables and request validation.
- **ORM**: Prisma for type-safe database access.
- **Styling**: TailwindCSS + shadcn/ui structure ready.
- **Routing**: React Router v6 with a layout shell.
