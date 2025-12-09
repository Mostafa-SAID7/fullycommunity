# Fully Community Storage Infrastructure

Example CDK project created using the **cloud-architect** power to demonstrate AWS infrastructure setup for the Fully Community platform.

## What This Does

Creates two S3 buckets following AWS security best practices:

1. **User Uploads Bucket**: For profile pictures, post images, marketplace photos, etc.
   - Encryption at rest (SSE-S3)
   - Versioning enabled
   - CORS configured for web/mobile uploads
   - Lifecycle rules for cost optimization
   - HTTPS-only access

2. **Static Assets Bucket**: For CDN-distributed static content
   - Encryption at rest
   - Optimized for static content delivery

## Security Features

✅ Block all public access by default
✅ Encryption at rest with S3-managed keys
✅ HTTPS-only access enforced
✅ Versioning for data protection
✅ Lifecycle rules for cost optimization

## Prerequisites

```bash
# Install AWS CDK
npm install -g aws-cdk

# Install Python dependencies
pip install aws-cdk-lib constructs
```

## Usage

```bash
# Navigate to this directory
cd example-cdk-storage

# Install dependencies
pip install -r requirements.txt

# Configure AWS credentials
aws configure

# Update app.py with your AWS account ID

# Synthesize CloudFormation template
cdk synth

# Deploy to dev environment
cdk deploy fully-community-storage-dev

# Deploy to prod environment
cdk deploy fully-community-storage-prod
```

## Integration with Your .NET API

Update your `CommunityCar.API/appsettings.json`:

```json
{
  "AWS": {
    "Region": "us-east-1",
    "S3": {
      "UserUploadsBucket": "fully-community-uploads-dev",
      "StaticAssetsBucket": "fully-community-static-dev"
    }
  }
}
```

## Next Steps

1. Add CloudFront CDN for static assets
2. Create Lambda functions for image processing
3. Add DynamoDB for metadata storage
4. Implement API Gateway for direct uploads

## Cost Estimate

Using the **awspricing** server from cloud-architect power, you can get real-time pricing for your infrastructure.
