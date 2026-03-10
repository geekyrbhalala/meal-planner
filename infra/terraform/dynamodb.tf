# --------------------------------------------------
# DynamoDB — Single-table design for user data
# --------------------------------------------------

resource "aws_dynamodb_table" "user_data" {
  name         = "${var.app_name}-user-data-${var.environment}"
  billing_mode = "PAY_PER_REQUEST" # On-demand — cheapest for low/variable traffic

  hash_key  = "PK"
  range_key = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  # Optional: enable point-in-time recovery for prod
  point_in_time_recovery {
    enabled = var.environment == "prod"
  }

  tags = {
    Name = "${var.app_name}-user-data-${var.environment}"
  }
}
