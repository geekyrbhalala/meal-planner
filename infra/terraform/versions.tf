terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # Configure via backend.hcl or CLI flags:
    #   terraform init -backend-config=backend.hcl
    # Example backend.hcl:
    #   bucket         = "my-terraform-state-bucket"
    #   key            = "meal-planner/terraform.tfstate"
    #   region         = "us-east-1"
    #   use_lockfile   = true
    #   encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "MealPlanner"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
