# Repository Guidelines

## Project Structure & Module Organization

`src/app` contains App Router pages, layouts, and route handlers. Put domain logic in `src/features/<domain>` such as `src/features/auth` or `src/features/posts`. Shared UI belongs in `src/components/{ui,shared,dynamic}`, reusable utilities in `src/lib`, hooks in `src/hooks`, and provider/context setup in `src/providers` and `src/contexts`. Generated API clients live in `src/generated/api`; regenerate them instead of hand-editing when possible. Static assets are in `public/`, scripts in `scripts/`, and long-form project docs in `docs/`.

## Build, Test, and Development Commands

- `npm run dev` — start local Next.js development.
- `npm run dev:https:local` — local HTTPS for OAuth/cookie debugging.
- `npm run build` — production build.
- `npm run lint` — run ESLint on `src/`.
- `npm test -- --runInBand` — run Jest once.
- `npm run test:coverage` — coverage report.
- `npx tsc --noEmit` — strict TypeScript validation.
- `npm run gen:api` — regenerate `src/generated/api` from OpenAPI.

## Coding Style & Naming Conventions

Use TypeScript with strict mode, 2-space indentation, and Prettier formatting. ESLint is the default lint gate, and imports should prefer the `@/*` alias. Use PascalCase for components/providers (`AuthProvider.tsx`), `use*.ts` for hooks, and camelCase file names for services and utilities. Keep feature-specific logic inside its feature directory before promoting code to shared modules.

## Testing Guidelines

Jest, Testing Library, and MSW are available for unit and component tests. Name tests after the target module, for example `proxy.test.ts` or `useAuth.test.tsx`. Any change touching auth, proxy, API services, or route handlers should include regression coverage or a documented reason why coverage was not added.

## GitHub Issue & PR Workflow (Required)

All code changes must follow **Issue → Branch → Work & Commit → PR → Merge**. Create the GitHub issue first, branch from the latest `main`, and include the issue number in the branch name: `<type>/<issue-number>-<short-description>` (example: `fix/38-auth-token-expiry`). Open a PR with `Closes #N` in the body, and share the PR URL in the final handoff. Do not branch without an issue or push directly to `main`. See `docs/workflows/github-issue-pr-workflow.md` for the full template.

## Commit & Review Guidelines

Recent history uses prefixes like `fix:`, `chore:`, and `[refactor]`, often with issue references. Prefer intent-first commit summaries and, when useful, Lore-style trailers such as `Constraint:`, `Confidence:`, `Scope-risk:`, and `Tested:`. PRs should summarize user impact, affected paths, commands run, linked issues, and screenshots or recordings for visible UI changes.

## Security & Configuration Tips

Never commit secrets, local certificates, or `.omx/` runtime state. For auth-related work, review `src/proxy.ts`, `src/lib/serverApiClient.ts`, and `src/app/layout.tsx` together, and prefer HTTPS local dev when validating OAuth, refresh-token, or cookie behavior.
