# --------------------------------------------------
# Cognito User Pool — Authentication
# --------------------------------------------------

resource "aws_cognito_user_pool" "main" {
  name = "${var.app_name}-${var.environment}"

  # Sign in with email
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  # Password policy
  password_policy {
    minimum_length    = 8
    require_uppercase = true
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
  }

  # Required attributes
  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  schema {
    name                = "name"
    attribute_data_type = "String"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  # Email configuration (Cognito default — free tier)
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  # Account recovery via email
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # Prevent user enumeration attacks
  user_pool_add_ons {
    advanced_security_mode = "OFF"
  }

  tags = {
    Name = "${var.app_name}-user-pool-${var.environment}"
  }
}

# --------------------------------------------------
# Cognito User Pool Client — Frontend app client
# --------------------------------------------------

resource "aws_cognito_user_pool_client" "web" {
  name         = "${var.app_name}-web-${var.environment}"
  user_pool_id = aws_cognito_user_pool.main.id

  # No client secret for SPA (public client)
  generate_secret = false

  # Auth flows
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
  ]

  # Token validity
  access_token_validity  = 1  # hours
  id_token_validity      = 1  # hours
  refresh_token_validity = 30 # days

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  # Security
  prevent_user_existence_errors = "ENABLED"

  supported_identity_providers = ["COGNITO"]
}

# --------------------------------------------------
# Cognito Identity Pool — AWS credentials for DynamoDB
# --------------------------------------------------

resource "aws_cognito_identity_pool" "main" {
  identity_pool_name               = "${var.app_name}-identity-${var.environment}"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.web.id
    provider_name           = aws_cognito_user_pool.main.endpoint
    server_side_token_check = false
  }
}

# --------------------------------------------------
# IAM Role — Authenticated users can access DynamoDB
# --------------------------------------------------

data "aws_iam_policy_document" "cognito_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = ["cognito-identity.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "cognito-identity.amazonaws.com:aud"
      values   = [aws_cognito_identity_pool.main.id]
    }

    condition {
      test     = "ForAnyValue:StringLike"
      variable = "cognito-identity.amazonaws.com:amr"
      values   = ["authenticated"]
    }
  }
}

data "aws_iam_policy_document" "dynamodb_access" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Query",
    ]
    resources = [aws_dynamodb_table.user_data.arn]

    # Row-level security: users can only access their own data
    condition {
      test     = "ForAllValues:StringLike"
      variable = "dynamodb:LeadingKeys"
      values   = ["USER#$${cognito-identity.amazonaws.com:sub}"]
    }
  }
}

resource "aws_iam_role" "authenticated" {
  name               = "${var.app_name}-cognito-auth-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.cognito_assume_role.json

  tags = {
    Name = "${var.app_name}-cognito-authenticated-${var.environment}"
  }
}

resource "aws_iam_role_policy" "dynamodb_access" {
  name   = "dynamodb-access"
  role   = aws_iam_role.authenticated.id
  policy = data.aws_iam_policy_document.dynamodb_access.json
}

# Attach role to identity pool
resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = aws_cognito_identity_pool.main.id

  roles = {
    "authenticated" = aws_iam_role.authenticated.arn
  }
}
