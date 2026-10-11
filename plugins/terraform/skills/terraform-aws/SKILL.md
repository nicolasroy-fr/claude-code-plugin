---
name: terraform-aws
description: Create or extend an AWS infrastructure deployment with Terraform, one file per resource (or resource family), following strict conventions. Use when the user asks to create, scaffold, or add resources to a Terraform / AWS deployment (« crée un déploiement Terraform AWS », « ajoute un bucket S3 en Terraform »).
---

# Terraform AWS deployment generator

Generate or extend a Terraform root module for AWS. Follow every rule below. All code, comments, variable descriptions, and resource names are written in **English**.

## 1. Project layout (flat root)

A single flat directory, **one file per resource or resource family**:

```
infra/
  versions.tf        # terraform block: required_version, required_providers, backend
  providers.tf       # provider "aws" with region and default_tags
  variables.tf       # all input variables
  locals.tf          # shared locals (name_prefix, common values)
  outputs.tf         # all outputs
  terraform.tfvars.example
  vpc.tf             # VPC, subnets, route tables, IGW, NAT (one family)
  security_groups.tf
  s3.tf
  iam.tf
  rds.tf
  ...
```

- Place it in the project's existing infra directory (look for `infra/`, `terraform/`, `*.tf`). Ask if it is ambiguous.
- **One file per resource family**: tightly coupled resources live together (e.g. `aws_vpc` + subnets + route tables + gateways in `vpc.tf`; a bucket + its public access block + policy in `s3.tf`). Unrelated resources never share a file.
- File names are lowercase `snake_case`, named after the family (`ecs_service.tf`, not `main.tf`). **Do not create a catch-all `main.tf`.**
- Outputs and variables are **not** split per resource: they stay in `outputs.tf` / `variables.tf`.
- If a family file gets too large, suggest a split into a local module (see section 2); never do it without explicit approval.
- When extending an existing project, add new files in the same layout and only touch shared files (`variables.tf`, `outputs.tf`, `locals.tf`) to append.

## 2. Splitting a large family into a subfolder

Terraform only reads `.tf` files in the directory it runs in: a plain subfolder is ignored. A family that grows too big is therefore extracted into a **local module** under `modules/<family>/`, called from the root.

**Never convert to a module on your own.** When a family file exceeds roughly 10 resources or 150 lines, or mixes clearly distinct sub-topics (e.g. `iam.tf` with many roles, policies and users), **suggest** the split to the user (say which file, why, and the proposed sub-files) and wait for an explicit yes. Until then keep the single flat file. Proceed directly only if the user has asked for the module/subfolder themselves.

```
infra/
  iam.tf                  # module "iam" call only
  modules/
    iam/
      README.md           # one line per file: what it contains
      versions.tf         # required_providers only (no backend, no provider block)
      variables.tf
      outputs.tf
      roles_ecs.tf        # ECS task/execution roles + attachments
      roles_lambda.tf     # Lambda execution roles
      policies.tf         # customer-managed policies
      users.tf            # IAM users and groups
```

- Inside the module, files are named after the **sub-topic** they hold (`roles_ecs.tf`, `policies.tf`), never `main.tf`.
- Add a short `README.md` (or a header comment at the top of each file) stating what each file contains, so the split is self-explanatory.
- The root file `<family>.tf` only contains the `module "<family>"` block; pass values explicitly through variables and expose what other families need through the module's `outputs.tf`.
- Other root files reference the module outputs (`module.iam.ecs_task_role_arn`), not inner resources.
- When splitting an existing file, use `moved` blocks in the root so resources are not destroyed and recreated:

```hcl
moved {
  from = aws_iam_role.ecs_task
  to   = module.iam.aws_iam_role.ecs_task
}
```

## 3. Templates

Start from the files in `templates/`:

| Template | Use for |
|---|---|
| `templates/versions.tf` | Terraform + provider versions and S3 backend |
| `templates/providers.tf` | AWS provider with `default_tags` |
| `templates/variables.tf` | Base variables (`project`, `environment`, `owner`, `aws_region`) |
| `templates/locals.tf` | `name_prefix` |
| `templates/outputs.tf` | Outputs skeleton |
| `templates/resource.tf` | Example resource-family file (S3 bucket) showing conventions |
| `templates/module_call.tf` | Root file calling a family extracted into `modules/<family>/` |
| `templates/module/` | `README.md` and `versions.tf` for an extracted module |

## 4. Conventions

- **Backend**: S3 with native locking (`use_lockfile = true`, Terraform ≥ 1.10), no DynamoDB table. Bucket, key and region are left to the user (partial configuration or placeholders); never hardcode account IDs.
- **Naming**: Terraform identifiers in `snake_case`. Use `this` when a file holds a single main resource of a type, otherwise a descriptive name (`public`, `private`). Never repeat the type in the identifier (`aws_s3_bucket.assets`, not `aws_s3_bucket.assets_bucket`).
- **Tags**: set `project`, `environment`, `owner` and `managed_by = "terraform"` through `default_tags` in the provider. Only add per-resource `tags` for a `Name` tag or resource-specific values.
- **Variables**: every variable has `type` and `description`; add `default` only when a sane default exists; use `validation` blocks for constrained values (e.g. `environment`).
- **Outputs**: every output has a `description`; mark sensitive values `sensitive = true`.
- **Security defaults**: encryption at rest enabled, S3 public access blocked, no `0.0.0.0/0` ingress unless explicitly requested, least-privilege IAM (no `"*"` actions/resources without a stated reason).
- **No secrets** in code or tfvars: use `random_password` + Secrets Manager, or SSM parameters.
- Prefer references between resources (`aws_vpc.this.id`) over hardcoded IDs. Use data sources for existing infrastructure.
- Pin provider versions with `~>`; no deprecated arguments.
- Comments only for non-obvious choices.

## 5. Workflow

1. **Clarify** (ask only what is missing): target AWS region, project name, environments, and the list of resources / services wanted.
2. **Scaffold** the shared files from the templates (skip those that already exist).
3. **Create one file per resource family**, wiring variables and outputs. If a family gets large (section 2), suggest extracting it into `modules/<family>/` and wait for approval.
4. **Format and validate**: run `terraform fmt -recursive`, then `terraform init -backend=false` and `terraform validate` (modules are validated through the root). Fix any error before reporting.
5. **Report**: list the created files with one line each, plus the variables the user must fill in.

## 6. Safety

- **Never run `terraform apply` or `terraform destroy`**, and do not run `terraform plan` against a real backend unless the user asks. Tell the user the commands to run themselves.
- Do not write credentials or account-specific values into committed files; add `*.tfvars`, `.terraform/` and `*.tfstate*` to `.gitignore` (keep `terraform.tfvars.example`).
