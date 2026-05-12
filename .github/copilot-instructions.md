# Project Standards

## Stack

- React
- TypeScript
- Next.js App Router
- TailwindCSS
- shadcn/ui
- React Hook Form
- Zod
- Zustand

## UI Rules

- Always prefer shadcn/ui components.
- Use Calendar + Popover for date selection.
- Use shadcn Button, Dialog, Input, Select, Card.

## Architecture

- Keep components small and reusable.
- Extract business logic into hooks.
- Extract constants into constants.ts.
- Extract helpers into utils.ts.
- Avoid large components.

## Folder Structure

/components
/hooks
/utils
/constants
/types

## Forms

- Use react-hook-form + zod.
- Centralize schemas.

## Styling

- Reuse existing utility patterns.
- Match existing UI patterns.

## TypeScript

- Strict typing.
- Avoid any.

## Expectations

- Separate concerns automatically.
- Create reusable components when appropriate.
- Reuse existing project patterns.
- Avoid single-file implementations.
