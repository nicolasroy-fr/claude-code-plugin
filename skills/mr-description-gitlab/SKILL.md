---
name: mr-description-gitlab
description: Generates or updates the title and description of a GitLab merge request (MR), in French, with a fixed title pattern and a structured description (Description, Contexte, Changements, Tests). Use whenever the user wants to write, rewrite, improve or fill in an MR title or description on GitLab, or gives a GitLab merge request link, even if they don't mention the format.
argument-hint: "[MR URL]"
allowed-tools: Bash(glab mr view:*), Bash(glab mr list:*), Bash(glab mr diff:*), Bash(glab api:*), Bash(git status:*), Bash(git branch:*), Bash(git log:*), Bash(git diff:*), Bash(git remote:*), Bash(git rev-parse:*)
---

# GitLab MR title and description

Everything written into the MR (title, description) and every question asked
to the user is in **French**.

## Arguments (optional)

Received content: `$ARGUMENTS`

- If it contains a GitLab MR URL (`https://<host>/<group>/<repo>/-/merge_requests/<iid>`),
  that MR is the target: extract host, project path and `iid`.
- With no argument, find the MR of the current branch (step 1).

## Hard rules

- **Never modify the MR without explicit confirmation** of the title and of
  the description, then a separate explicit authorization to send.
- Never invent facts (card number, context, tests). Ask or leave out.
- No mention of Claude in the MR content.

## Steps

### 1. Identify and fetch the MR

- With a URL: `glab mr view <iid> -R <project path>` (add `--output json` for
  fields), or `glab api projects/<url-encoded path>/merge_requests/<iid>`.
  For a self-hosted host, use `GITLAB_HOST=<host>` or `glab api --hostname`.
- Without URL: `git branch --show-current`, then
  `glab mr list --source-branch <branch>` / `glab mr view <branch>`.
  If several or none match, ask the user.
- If `glab` is missing or unauthenticated, tell the user (suggest
  `! glab auth login`) rather than guessing.

Retrieve: current title, current description, source/target branches, and the
changes: `glab mr diff <iid>` (and commit list via
`glab api projects/:id/merge_requests/<iid>/commits`). Read the diff to
understand the real content of the MR.

Determine:
- **Repo name**: last segment of the project path, in UPPERCASE.
- **Card number**: look in the existing title, branch name, commits and
  description (e.g. `ABC-123`, `#123`). If none is found, ask once; if the
  user says there is none, omit the brackets entirely.

### 2. Title

Pattern:

```
[<card number>] <REPO NAME> - <sujet> - courte description
```

- Brackets and card number only if a card exists.
- `<REPO NAME>`: repo name in uppercase.
- `<sujet>`: **always ask the user** for it (propose a suggestion inferred
  from the diff as a default option, but don't decide alone). If the current
  title already contains a subject, propose to keep it.
- Short description: succinct, in French, lowercase start, no trailing period.
- If an existing title is already well-formed and still fits the MR content,
  keep it and say so. If it no longer fits, propose a modified one and show
  the before/after.

### 3. Description

Structure (Markdown, in French):

```markdown
# Description

<One or two sentences summarizing the goal of the MR.>

## Contexte

<Current state of the code if it's a modification; expected result: constraints,
goals, architecture, strategy.>

## Changements

- <High-level change>
- ...

## Tests

- <Tests written, or manual tests done>
```

Section guidance:

- **Description**: 1–2 sentences on the goal. Propose a draft and ask the
  user to validate or correct it.
- **Contexte**: describes the state before (for a modification) and the
  expected outcome (constraints, objectives, architecture, strategy). Go
  **point by point**: submit each point to the user for validation and ask a
  question whenever a point could be clarified (why this choice, which
  constraint, which alternative rejected). Don't move on with unvalidated
  assumptions.
- **Changements**: high-level list only. Go into detail only when the change
  is precisely about that detail or when it is essential to understand the MR
  as a whole.
- **Tests**: broad strokes of the automated tests written (files/areas
  covered) and the manual tests done. If unknown, ask; never claim tests that
  were not performed.

Prefer batching related questions with `AskUserQuestion` (subject, card
number, context points) instead of many round-trips.

### 4. Existing description (update case)

If the MR already has a description:
- Show what would change, section by section (added / modified / removed),
  not just the new text.
- Preserve useful content the user wrote (links, screenshots, checklists,
  template sections); mention it if something would be dropped.
- Ask for confirmation of the changes before going further.

### 5. Confirm, then send

1. Present the final **title**, the **target MR** (URL, branches) and the
   full **description**, and ask for confirmation of all three.
2. Only after that, ask a separate question: authorization to send the
   modifications to GitLab.
3. On approval, write the description to a scratchpad/temp file and update:

```
glab mr update <iid> -R <project path> --title "<title>" --description "$(cat <file>)"
```

   (or `glab api -X PUT projects/:id/merge_requests/<iid>` with `title` and
   `description` fields). The command is not in `allowed-tools` on purpose so
   the user gets a permission prompt.
4. Report the outcome and the MR URL. If it fails, show the error; don't retry
   silently.
