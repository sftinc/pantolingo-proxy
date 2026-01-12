# Translation Proxy (`apps/translate`)

Express-based translation proxy that translates websites on-the-fly.

## Architecture

The translation proxy processes each request through this pipeline:

**Cache -> Fetch -> Parse -> Extract -> Translate -> Apply -> Rewrite -> Return**

**Key Flow**:

-   Requests hit Express -> Host determines target language from database (`host` table)
-   Static assets (`.js`, `.css`, `.png`, etc.) are proxied directly with optional caching
-   HTML content flows through the full translation pipeline
-   PostgreSQL stores: host configuration, translations, and pathname mappings

## Core Modules

-   `server.ts`: Express server entry point, database connection
-   `index.ts`: Main request handler, orchestrates the pipeline
-   `config.ts`: Constants and fallback configuration
-   `fetch/`: DOM manipulation (parsing, extraction, application, rewriting)
-   `translation/`: Translation engine (OpenRouter API, deduplication, patterns)

## HTML Placeholder System

Inline HTML elements are converted to placeholders during translation to preserve formatting:

| Type | Tags                                    | Example              |
| ---- | --------------------------------------- | -------------------- |
| `HB` | `<b>`, `<strong>`                       | `[HB1]bold[/HB1]`    |
| `HE` | `<em>`, `<i>`                           | `[HE1]italic[/HE1]`  |
| `HA` | `<a>`                                   | `[HA1]link[/HA1]`    |
| `HS` | `<span>`                                | `[HS1]styled[/HS1]`  |
| `HG` | `<u>`, `<sub>`, `<sup>`, `<mark>`, etc. | `[HG1]text[/HG1]`    |
| `HV` | `<br>`, `<hr>`, `<img>`, `<wbr>` (void) | `[HV1]` (no closing) |

Defined in `config.ts` (`HTML_TAG_MAP`, `VOID_TAGS`). Logic in `fetch/dom-placeholders.ts`.

## Translation Engine

-   Uses OpenRouter API (configured in `translation/translate.ts`)
-   Prompts defined in `translation/prompts.ts` (SEGMENT_PROMPT for text, PATHNAME_PROMPT for URLs)
-   Skip patterns in `translation/skip-patterns.ts` (PII, numeric, code detection)

## Environment Variables

| Variable             | Default | Description                                    |
| -------------------- | ------- | ---------------------------------------------- |
| `POSTGRES_DB_URL`    | -       | PostgreSQL connection string (required)        |
| `OPENROUTER_API_KEY` | -       | API key for OpenRouter (required)              |
| `PORT`               | `8787`  | Port the translation proxy listens on          |
| `GOOGLE_PROJECT_ID`  | -       | Reserved for future Google Translate API       |

## Deployment (Render.com)

1. **Root Directory**: (leave empty - uses repo root)
2. **Build command**: `pnpm install && pnpm build:translate`
3. **Start command**: `node apps/translate/dist/server.js`
4. **Build Filters**:
    - Include paths: `apps/translate/**`, `packages/db/**`, `packages/lang/**`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`
