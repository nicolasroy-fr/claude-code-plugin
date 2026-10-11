# Claude Code Skills

Personal collection of [Claude Code](https://claude.com/claude-code) skills.

## Plugins & skills

Skills are grouped by theme, one plugin per theme under `plugins/<theme>/`.

| Plugin | Skill | Description |
|---|---|---|
| `git` | `commit` | Creates a git commit with an emoji and a structured message, always in English. |
| `git` | `mr-description-gitlab` | Generates or updates a GitLab MR title and description in French (fixed title pattern, Description/Contexte/Changements/Tests), with confirmations before any change. |
| `python` | `python-test-generator` | Generates pytest unit tests following strict conventions (`tests/` folder, `test__<function>__<case>` naming, with/when/then structure, attribute-by-attribute asserts). |
| `python` | `python-docstring` (agent, Haiku) | Writes docstrings for functions, methods and classes in Google style (ruff pydocstyle, `convention = "google"`). |
| `react` | `react-component` | Generates a single React component file (TypeScript, Tailwind) from templates. |
| `react` | `react-hook` | Generates a custom React hook folder (TypeScript, Vitest + Testing Library `renderHook`) from templates. |
| `terraform` | `terraform-aws` | Creates an AWS Terraform deployment (flat root, one file per resource family, S3 native-lock backend, default tags, fmt + validate). |

## Install

Add the marketplace (user scope, available in all your projects):

```
/plugin marketplace add nicolasroy-fr/claude-code-plugin
```

Or with the full URL:

```
/plugin marketplace add https://github.com/nicolasroy-fr/claude-code-plugin
```

Then install the plugins you need:

```
/plugin install git@nicolas-skills
/plugin install python@nicolas-skills
/plugin install react@nicolas-skills
/plugin install terraform@nicolas-skills
```

From the shell, the same thing with the CLI:

```
claude plugin marketplace add nicolasroy-fr/claude-code-plugin
claude plugin install git@nicolas-skills --scope user
```

Update later with `/plugin marketplace update nicolas-skills`.

Or copy a single skill manually:

```
cp -r plugins/git/skills/commit ~/.claude/skills/
```

## Usage

```
/git:commit [nature] [details to include]
/git:mr-description-gitlab [MR URL]
```

## Adding a skill

Create `plugins/<theme>/skills/<name>/SKILL.md` with `name` and `description` frontmatter.

For a new theme:
1. Create `plugins/<theme>/.claude-plugin/plugin.json` (`name`, `description`, `version`, `author`).
2. Add an entry to `.claude-plugin/marketplace.json` with `"source": "./plugins/<theme>"`.
