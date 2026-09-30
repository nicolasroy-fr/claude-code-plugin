# Claude Code Skills

Personal collection of [Claude Code](https://claude.com/claude-code) skills.

## Skills

| Skill | Description |
|---|---|
| `commit-emoji` | Creates a git commit with an emoji and a structured message, always in English. |
| `mr-description-gitlab` | Generates or updates a GitLab MR title and description in French (fixed title pattern, Description/Contexte/Changements/Tests), with confirmations before any change. |
| `python-test-generator` | Generates pytest unit tests following strict conventions (`tests/` folder, `test__<function>__<case>` naming, with/when/then structure, attribute-by-attribute asserts). |

## Install

As a plugin (replace `<owner>/<repo>` with this repo's GitHub path, or use a local path):

```
/plugin marketplace add <owner>/<repo>
/plugin install nicolas-skills@nicolas-skills
```

Or copy a single skill manually:

```
cp -r skills/commit-emoji ~/.claude/skills/
```

## Usage

```
/commit-emoji [nature] [details to include]
/mr-description-gitlab [MR URL]
```

## Adding a skill

Create `skills/<name>/SKILL.md` with `name` and `description` frontmatter.
