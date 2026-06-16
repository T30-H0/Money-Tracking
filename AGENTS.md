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
