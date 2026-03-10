variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "app_name" {
  description = "Application name used for resource naming"
  type        = string
  default     = "meal-planner"
}

variable "github_repo" {
  description = "GitHub repository (owner/repo) for OIDC trust"
  type        = string
}

variable "terraform_state_bucket" {
  description = "S3 bucket name for Terraform remote state"
  type        = string
  default     = "terraform-state"
}
