# Customer Website (`apps/www`)

Next.js 16 app with Tailwind CSS v4 and React 19.

## Routes

-   `/` - Marketing landing page
-   `/login`, `/signup` - Auth pages
-   `/dashboard` - Origins overview with segment/path counts
-   `/dashboard/origin/[id]` - Language list for an origin
-   `/dashboard/origin/[id]/lang/[langCd]` - Translation editor for segments and paths

## Directory Structure

```
src/
├── app/
│   ├── (marketing)/        # Public pages (/)
│   ├── (auth)/             # Auth pages (/login, /signup)
│   └── (dashboard)/        # Customer dashboard
│       └── dashboard/
│           ├── page.tsx                        # /dashboard - origins overview
│           └── origin/[id]/
│               ├── page.tsx                    # /dashboard/origin/:id - language list
│               └── lang/[langCd]/page.tsx      # /dashboard/origin/:id/lang/:langCd - translations
├── actions/                # Server actions
├── components/
│   ├── ui/                 # Reusable UI (Modal, Table, Badge, Lexical editor)
│   └── dashboard/          # Dashboard-specific (EditModal, LangTable, OriginCard)
└── lib/                    # Utilities
```

## Key Components

-   `EditModal` - Modal with Lexical-based editor for editing translations
-   `LangTable`, `SegmentTable`, `PathTable` - Data tables with pagination
-   `PlaceholderEditor` - Lexical editor with placeholder validation (preserves `[HB1]...[/HB1]` formatting)

## Environment Variables

| Variable                | Default | Description                                         |
| ----------------------- | ------- | --------------------------------------------------- |
| `POSTGRES_DB_URL`       | -       | PostgreSQL connection string (required)             |
| `DASHBOARD_ALLOWED_IPS` | -       | Comma-separated IP allowlist for dashboard access   |

## Deployment (Render.com)

1. **Root Directory**: (leave empty - uses repo root)
2. **Build command**: `pnpm install && pnpm build:www`
3. **Start command**: `pnpm start:www`
4. **Build Filters**:
    - Include paths: `apps/www/**`, `packages/db/**`, `packages/lang/**`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`
