# Claude Code Skills

Personal collection of [Claude Code](https://claude.com/claude-code) skills.

## Plugins & skills

Skills are grouped by theme, one plugin per theme under `plugins/<theme>/`.

| Plugin | Skill | Description |
|---|---|---|
| `git` | `commit-emoji` | Creates a git commit with an emoji and a structured message, always in English. |
| `git` | `mr-description-gitlab` | Generates or updates a GitLab MR title and description in French (fixed title pattern, Description/Contexte/Changements/Tests), with confirmations before any change. |
| `python` | `python-test-generator` | Generates pytest unit tests following strict conventions (`tests/` folder, `test__<function>__<case>` naming, with/when/then structure, attribute-by-attribute asserts). |
| `react` | `react-component` | Generates a React component folder (TypeScript, Tailwind, Vitest + Testing Library) from templates. |

## Install

As a plugin (replace `<owner>/<repo>` with this repo's GitHub path, or use a local path):

```
/plugin marketplace add <owner>/<repo>
/plugin install git@nicolas-skills
/plugin install python@nicolas-skills
/plugin install react@nicolas-skills
```

Install only the themes you need.

Or copy a single skill manually:

```
cp -r plugins/git/skills/commit-emoji ~/.claude/skills/
```

## Usage

```
/git:commit-emoji [nature] [details to include]
/git:mr-description-gitlab [MR URL]
```

## Adding a skill

Create `plugins/<theme>/skills/<name>/SKILL.md` with `name` and `description` frontmatter.

For a new theme:
1. Create `plugins/<theme>/.claude-plugin/plugin.json` (`name`, `description`, `version`, `author`).
2. Add an entry to `.claude-plugin/marketplace.json` with `"source": "./plugins/<theme>"`.
