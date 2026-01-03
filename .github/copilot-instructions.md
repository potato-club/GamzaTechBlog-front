# Copilot Instructions (GamzaTechBlog Frontend)

## Review Language
- Write all code review comments in Korean.

## Project Context
- Next.js App Router + TypeScript.
- Auth uses JWT with HttpOnly cookies; client code must not read tokens.
- OpenAPI-generated client lives in `src/generated/api`.
- BFF migration is in progress; maintainability, simplicity, readability, and consistency are top priorities.

## Architecture Expectations
- Prefer Server Components for read-heavy pages; add `"use client"` only when necessary.
- Auth, write actions, and personalized data should go through BFF (Route Handlers/Server Actions) or server-only modules.
- Avoid new direct backend calls from client components unless explicitly required and justified.

## React Query Policy
- Use React Query primarily for interactive client flows (mutations, optimistic updates).
- For initial page data, prefer RSC/server fetch; avoid duplicate client fetch of already server-loaded data.
- Favor explicit cache invalidation over hidden side effects.

## Code Quality and Consistency
- Keep changes minimal and focused; avoid broad refactors without need.
- Preserve existing file structure and naming conventions.
- Do not import server-only modules into client components.
- Avoid adding new dependencies or build steps without clear justification.

## Security and Reliability
- Never read HttpOnly cookies in client code.
- Keep auth/refresh logic on the server.
- Do not leak user-specific data into public caches; use `no-store` or tag-based revalidation when needed.

## Review Focus
- Identify regressions, security risks, cache misuse, and missing error handling.
- Call out API contract changes and missing tests when relevant.
