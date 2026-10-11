---
name: react-component
description: Generate React components (TypeScript, function components, Tailwind CSS) with their index file and Vitest + Testing Library tests, following strict conventions. Use when the user asks to create, generate, or scaffold a React component (« crée un composant React », « génère un composant »).
---

# React component generator

Generate a complete React component folder. Follow every rule below. All code, comments, prop names, and test descriptions are written in **English**.

## 1. Stack

- React with TypeScript, **function components only** (no classes).
- Styling with **Tailwind CSS** utility classes (no CSS files, no CSS-in-JS).
- Tests with **Vitest + React Testing Library**.

## 2. Folder layout

One PascalCase folder per component, with a file of the same name inside:

```
components/
  Button/
    Button.tsx
    Button.test.tsx
    index.ts
```

- Place it in the project's existing components directory (look for `components/`, `src/components/`, …). Ask if it is ambiguous.
- Follow the project's existing conventions if they differ in small ways (e.g. named vs. default exports already in use).

## 3. Templates

Use the files in `templates/` as the starting point, replacing `__Name__` with the component name:

| Template | Use for |
|---|---|
| `templates/Component.tsx` | Simple presentational component |
| `templates/ComponentWithState.tsx` | Component with local state or a custom hook |
| `templates/FormComponent.tsx` | Form component (controlled inputs, submit handler) |
| `templates/Component.test.tsx` | Test file for any of the above |
| `templates/index.ts` | Barrel file |

Adapt the template to the request; do not keep unused props or placeholders.

## 4. Component rules

- **Named export** of the component; props typed with an exported `<Name>Props` interface.
- Props destructured in the function signature; defaults set there.
- Extend native element props when wrapping an element (`React.ComponentProps<"button">`) and forward `className` and the rest props.
- Merge classes with the project's helper (`cn`, `clsx`, `twMerge`) if one exists; otherwise a plain template string.
- Keep components small and single-purpose; extract a custom hook (`use<Name>`) when logic exceeds a few lines.
- Accessibility: semantic elements, labels for inputs, `aria-*` where needed.
- No `any`; no inline styles; no comments restating the code.

## 5. Tests

- File `<Name>.test.tsx` next to the component.
- Query by role/label/text (`getByRole`, `getByLabelText`), never by class or test id unless nothing else works.
- Use `userEvent` for interactions; `vi.fn()` for callbacks.
- Cover: renders with default props, renders each meaningful variant/prop, user interactions, and edge cases (empty, disabled, error state).
- One behaviour per test; descriptive names: `it("calls onClick when clicked")`.

## Workflow

1. Clarify the component's name, props, and behaviour if not given.
2. Check the project for existing components, conventions, and class-merging helper; match them.
3. Pick the template (rule 3) and create the three files.
4. Run the tests with `vitest run <path>` and the type check (`tsc --noEmit`) if possible; fix failures.
5. Summarize: files created, props exposed, anything left to decide.
