#!/usr/bin/env python3
"""
Example CDK app for Fully Community file storage infrastructure.
This demonstrates how to use the cloud-architect power to build AWS infrastructure.
"""
import aws_cdk as cdk
from stack import StorageStack


app = cdk.App()

# Development environment
StorageStack(
    app,
    "fully-community-storage-dev",
    env=cdk.Environment(
        account="YOUR_ACCOUNT_ID",  # Replace with your AWS account ID
        region="us-east-1"
    ),
    environment_name="dev",
    enable_versioning=True,
    lifecycle_rules_enabled=True
)

# Production environment
StorageStack(
    app,
    "fully-community-storage-prod",
    env=cdk.Environment(
        account="YOUR_ACCOUNT_ID",  # Replace with your AWS account ID
        region="us-east-1"
    ),
    environment_name="prod",
    enable_versioning=True,
    lifecycle_rules_enabled=True
)

app.synth()
