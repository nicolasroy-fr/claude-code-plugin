provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      project     = var.project
      environment = var.environment
      owner       = var.owner
      managed_by  = "terraform"
    }
  }
}
