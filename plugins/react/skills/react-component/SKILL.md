---
name: react-component
description: Generate React components (TypeScript, function components, Tailwind CSS) following strict conventions. Use when the user asks to create, generate, or scaffold a React component (« crée un composant React », « génère un composant »).
---

# React component generator

Generate a single React component file. Follow every rule below. All code, comments, and prop names are written in **English**.

## 1. Stack

- React with TypeScript, **function components only** (no classes).
- Styling with **Tailwind CSS** utility classes (no CSS files, no CSS-in-JS).

## 2. File layout

One PascalCase file per component, directly in the components directory (no per-component folder, no index file, no test file):

```
components/
  Button.tsx
```

- Place it in the project's existing components directory (look for `components/`, `src/components/`, …). Ask if it is ambiguous.
- Follow the project's existing conventions if they differ in small ways (e.g. named vs. default exports already in use).

## 3. Splitting large components

If a component is, or becomes, too big (long JSX, several responsibilities, repeated blocks), split it into smaller components:

- **Very simple sub-components:** keep them in the same file as "private" components (not exported), declared above the main component.
- **Larger sub-components used only by this component:** turn the component into a folder named after it, with an `index.ts` for the export and the sub-components next to the main file:

```
components/
  UserCard/
    UserCard.tsx
    UserCardHeader.tsx
    UserCardActions.tsx
    index.ts
```

`index.ts` re-exports only the main component (and its props type), never the sub-components.
- **Sub-components reused elsewhere:** put them in the shared components directory as regular components (rule 2).

## 4. Templates

Use the files in `templates/` as the starting point, replacing `__Name__` with the component name:

| Template | Use for |
|---|---|
| `templates/Component.tsx` | Simple presentational component |
| `templates/ComponentWithState.tsx` | Component with local state or a custom hook |
| `templates/FormComponent.tsx` | Form component (controlled inputs, submit handler) |

Adapt the template to the request; do not keep unused props or placeholders.

## 5. Component rules

- **Named export** of the component; props typed with an exported `<Name>Props` interface.
- Props destructured in the function signature; defaults set there.
- Extend native element props when wrapping an element (`React.ComponentProps<"button">`) and forward `className` and the rest props.
- Merge classes with the project's helper (`cn`, `clsx`, `twMerge`) if one exists; otherwise a plain template string.
- Keep components small and single-purpose; extract a custom hook (`use<Name>`) when logic exceeds a few lines.
- Accessibility: semantic elements, labels for inputs, `aria-*` where needed.
- No `any`; no inline styles; no comments restating the code.

## Workflow

1. Clarify the component's name, props, and behaviour if not given.
2. Check the project for existing components, conventions, and class-merging helper; match them.
3. Pick the template (rule 4) and create the component file only.
4. Run the type check (`tsc --noEmit`) if possible; fix failures.
5. Summarize: files created, props exposed, anything left to decide.
