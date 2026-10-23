# AGENTS.md

## Tech Stack (Non-Negotiable)

- **UI Components**: [shadcn/ui, Radix UI] — always use these, never raw HTML/JS equivalents
- **Styling**: [Tailwind CSS only — no inline styles, no CSS modules, no styled-components]
  <!-- - **State**: [Zustand / React Query — not useState for server data] -->
  <!-- - **Forms**: [React Hook Form + Zod — never manual onChange chains] -->

## Hard Rules

- NEVER implement a UI pattern in vanilla JS/HTML if a component from the tech stack above covers it.
- Before writing any new component, search the codebase for an existing one that does the same job.
- If a library above isn't imported yet in the file, add the import — don't work around it.

## Coding Rules

- Inspect existing files before implementing.
- Follow current project patterns.
- Avoid monolithic files.
- Split screen/page, components, hooks, services, types, and constants when useful.
- Reuse existing components and utilities before creating new ones.
- Do not introduce new libraries unless explicitly requested.
- Keep components focused and readable.
- Move business logic out of UI components.
- Avoid duplicated logic.
- Prefer simple solutions over over-engineering.

## Implementation Flow

1. Find similar existing features.
2. Match their folder structure and naming style.
3. Implement with minimal new abstractions.
4. Keep changes scoped to the requested feature.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
