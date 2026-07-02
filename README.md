# Prompt Library

Prompt Library is a full-stack prompt management service which is built with Next.js 15, Drizzle ORM and SQLite.

## Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **ORM**: Drizzle ORM
- **Database**: SQLite
- **AI**: Vercel AI SDK

## Setup

### 1. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and set your OpenAI API key

### 2. Run database migrations

```bashhjkl;,l78
npm run db:migrate
```

This creates a local database file with three tables: `prompts`, `internal_prompts` and `internal_prompt_versions`.

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
