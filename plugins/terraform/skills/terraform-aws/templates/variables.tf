variable "project" {
  type        = string
  description = "Project name, used as a prefix for resource names."
}

variable "environment" {
  type        = string
  description = "Deployment environment."

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be one of: dev, staging, prod."
  }
}

variable "owner" {
  type        = string
  description = "Team or person owning the infrastructure."
}

variable "aws_region" {
  type        = string
  description = "AWS region where resources are created."
  default     = "eu-west-3"
}
