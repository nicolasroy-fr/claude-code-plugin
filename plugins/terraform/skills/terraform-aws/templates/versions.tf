terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  backend "s3" {
    # bucket and region are provided at init time:
    #   terraform init -backend-config="bucket=<state-bucket>" -backend-config="region=<region>"
    key          = "__project__/terraform.tfstate"
    encrypt      = true
    use_lockfile = true
  }
}
