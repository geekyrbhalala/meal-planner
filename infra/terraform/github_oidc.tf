# --------------------------------------------------
# GitHub OIDC Provider — GitHub Actions → AWS auth
# --------------------------------------------------

resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]

  tags = {
    Name = "github-actions-oidc"
  }
}

# --------------------------------------------------
# IAM Role — GitHub Actions deployment role
# --------------------------------------------------

data "aws_iam_policy_document" "github_actions_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repo}:*"]
    }
  }
}

resource "aws_iam_role" "github_actions" {
  name               = "${var.app_name}-github-actions-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume.json

  tags = {
    Name = "${var.app_name}-github-actions-${var.environment}"
  }
}

# S3 deployment permissions
data "aws_iam_policy_document" "github_actions_deploy" {
  # S3 — upload build artifacts
  statement {
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]
    resources = [
      aws_s3_bucket.website.arn,
      "${aws_s3_bucket.website.arn}/*",
    ]
  }

}

resource "aws_iam_role_policy" "github_actions_deploy" {
  name   = "deploy-policy"
  role   = aws_iam_role.github_actions.id
  policy = data.aws_iam_policy_document.github_actions_deploy.json
}

# Terraform state management permissions (for infra workflow)
data "aws_iam_policy_document" "github_actions_terraform" {
  # S3 — Terraform state bucket access
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]
    resources = [
      "arn:aws:s3:::${var.terraform_state_bucket}",
      "arn:aws:s3:::${var.terraform_state_bucket}/*",
    ]
  }

  # IAM, Cognito, DynamoDB, S3, CloudFront — Terraform resource management
  statement {
    effect = "Allow"
    actions = [
      "iam:*",
      "cognito-idp:*",
      "cognito-identity:*",
      "dynamodb:*",
      "s3:*",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "github_actions_terraform" {
  name   = "terraform-policy"
  role   = aws_iam_role.github_actions.id
  policy = data.aws_iam_policy_document.github_actions_terraform.json
}
