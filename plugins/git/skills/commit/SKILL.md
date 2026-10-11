---
name: commit
description: Writes and creates a git commit with a custom emoji (gitmoji style) and a structured message (short sentence + small paragraph), always in English. Use whenever the user asks to commit, to write a commit message, or says "commit this", even if they don't mention the format explicitly.
argument-hint: "[emoji nature] [items to include in the message]"
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*)
---

# Commit with emoji and fixed format

## Arguments (optional)

Received content: `$ARGUMENTS`

- If the first word matches a nature from the table below (or is directly an
  emoji), it dictates the emoji.
- The rest of the text is a list of items to include in the message
  (preferably in the details paragraph).
- With no argument, infer the nature from the diff.

Examples: `/commit fix migration forgotten in the deployment` or `/commit` alone.

## Steps

1. Read `git status` and `git diff --staged`. If nothing is staged, look at
   `git diff` and suggest what to add before running `git add`.
2. Look at `git log -5 --oneline` for context on the repository's style.
3. Pick the emoji: the one dictated by the arguments, otherwise the dominant
   nature of the diff. One emoji per commit.
4. Write the message following the format below, then run `git commit`.

## Language

**Commit messages are always written in English**, regardless of the language
of the arguments, the conversation, or the existing git history. If the
arguments are in another language, translate them.

## Message format

```
<emoji> <Concise sentence describing what is done>

<Short paragraph with useful details.>
```

- **First line**: emoji, space, one sentence in the imperative mood, 72
  characters maximum, no trailing period.
- **Blank line** required, then **a single paragraph** of 1 to 3 sentences:
  the why, notable choices, side effects. No bullet lists.
- Work in the items provided as arguments without copying them word for word.
- Don't describe the diff line by line: it's already in git.
- No mention of Claude or "Co-authored-by".

## Emoji table

To be replaced with your own emojis.

| Nature | Emoji | When |
|---|---|---|
| feat | ✨ | New feature |
| fix | 🐛 | Bug fix |
| refactor | ♻️ | Restructuring without behavior change |
| perf | ⚡ | Performance improvement |
| test | 🧪 | Adding or changing tests |
| docs | 📝 | Documentation |
| style | 💄 | Formatting, UI without logic |
| chore | 🔧 | Config, dependencies, tooling |
| infra | 🏗️ | AWS, CI/CD, deployment |
| remove | 🔥 | Removing code or files |
| wip | 🚧 | Work in progress |

If no nature matches, pick the closest one and don't create a new emoji.
