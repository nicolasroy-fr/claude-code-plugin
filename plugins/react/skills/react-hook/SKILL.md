---
name: react-hook
description: Generate custom React hooks (TypeScript) with their index file and Vitest + Testing Library tests, following strict conventions. Use when the user asks to create, generate, or scaffold a React hook (« crée un hook React », « génère un hook », « custom hook »).
---

# React hook generator

Generate a complete custom React hook folder. Follow every rule below. All code, comments, parameter names, and test descriptions are written in **English**.

## 1. Stack

- React with TypeScript, **function hooks only**.
- Tests with **Vitest + React Testing Library** (`renderHook`, `act`).

## 2. Folder layout

One folder per hook, named after the hook (camelCase, `use` prefix), with a file of the same name inside:

```
hooks/
  useToggle/
    useToggle.ts
    useToggle.test.ts
    index.ts
```

- Place it in the project's existing hooks directory (look for `hooks/`, `src/hooks/`, …). Ask if it is ambiguous.
- Follow the project's existing conventions if they differ in small ways (e.g. flat files instead of folders).

## 3. Templates

Use the files in `templates/` as the starting point, replacing `__name__` with the hook name (e.g. `useToggle`):

| Template | Use for |
|---|---|
| `templates/useHook.ts` | Simple stateful hook with memoized actions |
| `templates/useAsyncHook.ts` | Hook fetching/computing asynchronously (loading/error/data) |
| `templates/useEffectHook.ts` | Hook subscribing to an external source (event listener, timer) with cleanup |
| `templates/useHook.test.ts` | Test file for any of the above |
| `templates/index.ts` | Barrel file |

Adapt the template to the request; do not keep unused parameters or placeholders.

## 4. Hook rules

- Name starts with `use`; **named export**.
- Type parameters and return value explicitly: export `<Name>Options` / `<Name>Result` interfaces (or types) when non-trivial.
- Return an **object** when there are more than two values, a tuple (`as const`) for at most two.
- Wrap returned callbacks in `useCallback` and derived objects in `useMemo` so references stay stable.
- Every effect that subscribes, schedules or fetches must **clean up** (remove listener, clear timer, abort/ignore stale request).
- Complete dependency arrays; never silence `react-hooks/exhaustive-deps`.
- Make it SSR-safe: do not touch `window`/`document` during render.
- Generic over data types when it makes sense (`useAsync<T>`); no `any`.
- No comments restating the code.

## 5. Tests

- File `<name>.test.ts` next to the hook (`.tsx` only if JSX is needed for a wrapper).
- Use `renderHook` and wrap state updates in `act`; use `waitFor` for async results.
- Use `vi.useFakeTimers()` for timers and `vi.fn()` for callbacks.
- Cover: initial value, each action, parameter changes via `rerender`, cleanup on `unmount`, and edge cases (error, empty, invalid input).
- One behaviour per test; descriptive names: `it("toggles the value")`.

## Workflow

1. Clarify the hook's name, parameters, and return value if not given.
2. Check the project for existing hooks and conventions; match them.
3. Pick the template (rule 3) and create the three files.
4. Run the tests with `vitest run <path>` and the type check (`tsc --noEmit`) if possible; fix failures.
5. Summarize: files created, signature (parameters and return), anything left to decide.
