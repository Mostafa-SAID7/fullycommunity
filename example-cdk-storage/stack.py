"""
Storage stack for Fully Community platform.
Implements S3 buckets following AWS security best practices.
"""
from aws_cdk import (
    Stack,
    StackProps,
    RemovalPolicy,
    Duration,
    aws_s3 as s3,
    aws_s3_deployment as s3deploy,
)
from constructs import Construct


class StorageStack(Stack):
    """
    CDK stack for file storage infrastructure.
    
    Creates S3 buckets for user uploads with security best practices:
    - Block all public access
    - Enable encryption at rest (SSE-S3)
    - Enable versioning
    - Configure lifecycle rules
    - Enforce HTTPS-only access
    """

    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        environment_name: str,
        enable_versioning: bool = True,
        lifecycle_rules_enabled: bool = True,
        **kwargs
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # User uploads bucket (profile pictures, post images, etc.)
        self.user_uploads_bucket = s3.Bucket(
            self,
            "UserUploadsBucket",
            bucket_name=f"fully-community-uploads-{environment_name}",
            # Security: Block all public access
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            # Security: Enable encryption at rest with S3-managed keys
            encryption=s3.BucketEncryption.S3_MANAGED,
            # Security: Enforce HTTPS-only access
            enforce_ssl=True,
            # Enable versioning for data protection
            versioned=enable_versioning,
            # CORS configuration for web/mobile uploads
            cors=[
                s3.CorsRule(
                    allowed_methods=[
                        s3.HttpMethods.GET,
                        s3.HttpMethods.PUT,
                        s3.HttpMethods.POST,
                    ],
                    allowed_origins=["*"],  # Configure with your domain in production
                    allowed_headers=["*"],
                    max_age=3000,
                )
            ],
            # Lifecycle rules for cost optimization
            lifecycle_rules=[
                s3.LifecycleRule(
                    id="DeleteOldVersions",
                    enabled=lifecycle_rules_enabled,
                    noncurrent_version_expiration=Duration.days(90),
                ),
                s3.LifecycleRule(
                    id="TransitionToIA",
                    enabled=lifecycle_rules_enabled,
                    transitions=[
                        s3.Transition(
                            storage_class=s3.StorageClass.INFREQUENT_ACCESS,
                            transition_after=Duration.days(90),
                        )
                    ],
                ),
            ],
            # Removal policy based on environment
            removal_policy=(
                RemovalPolicy.DESTROY if environment_name == "dev" 
                else RemovalPolicy.RETAIN
            ),
            auto_delete_objects=(environment_name == "dev"),
        )

        # Static assets bucket (for CDN distribution)
        self.static_assets_bucket = s3.Bucket(
            self,
            "StaticAssetsBucket",
            bucket_name=f"fully-community-static-{environment_name}",
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            encryption=s3.BucketEncryption.S3_MANAGED,
            enforce_ssl=True,
            versioned=False,  # Static assets don't need versioning
            removal_policy=(
                RemovalPolicy.DESTROY if environment_name == "dev" 
                else RemovalPolicy.RETAIN
            ),
            auto_delete_objects=(environment_name == "dev"),
        )
