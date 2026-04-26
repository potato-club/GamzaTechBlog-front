# Issue 142 Cleanup Plan

## Goal

Simplify obsolete server service layering while keeping API boundary behavior explicit and conservative.

## Plan

1. Lock behavior with focused tests for `unwrapData` and action error handling.
2. Add `src/lib/unwrapData.ts` for required `response.data` extraction.
3. Update `src/lib/actionResult.ts` to handle generated API failures conservatively:
   - parse `ResponseError` bodies best-effort only;
   - preserve backend `message`/`code` only when they are strings;
   - map `FetchError` to `NETWORK_ERROR`;
   - keep generic error fallback behavior.
4. Move `posts`, `likes`, `comments`, and `user` shared service logic into server service files.
5. Delete the four obsolete `*.shared.ts` files and fix imports/types.
6. Run lint, typecheck, Jest, and build.

## Non-Goals

- Do not define a new frontend failure DTO contract.
- Do not regenerate generated API files.
- Do not change UI error copy or display policy.
- Do not introduce dependencies.
- Do not apply `unwrapData` to `void` responses or intentional nullable fallbacks.
