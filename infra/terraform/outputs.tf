# --------------------------------------------------
# Outputs — Use these to configure the frontend .env
# --------------------------------------------------

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID → VITE_COGNITO_USER_POOL_ID"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  description = "Cognito App Client ID → VITE_COGNITO_CLIENT_ID"
  value       = aws_cognito_user_pool_client.web.id
}

output "cognito_identity_pool_id" {
  description = "Cognito Identity Pool ID"
  value       = aws_cognito_identity_pool.main.id
}

output "dynamodb_table_name" {
  description = "DynamoDB table name → VITE_DYNAMODB_TABLE_NAME"
  value       = aws_dynamodb_table.user_data.name
}

output "dynamodb_table_arn" {
  description = "DynamoDB table ARN"
  value       = aws_dynamodb_table.user_data.arn
}

# --------------------------------------------------
# S3 static website outputs
# --------------------------------------------------

output "s3_bucket_name" {
  description = "S3 bucket name for website hosting"
  value       = aws_s3_bucket.website.id
}

output "website_url" {
  description = "S3 static website URL"
  value       = aws_s3_bucket_website_configuration.website.website_endpoint
}

# --------------------------------------------------
# GitHub Actions outputs
# --------------------------------------------------

output "github_actions_role_arn" {
  description = "IAM Role ARN for GitHub Actions → AWS_ROLE_ARN secret"
  value       = aws_iam_role.github_actions.arn
}
