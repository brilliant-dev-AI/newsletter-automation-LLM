# 🚀 Deployment Guide

## Quick Deployment Steps

### **1. Prerequisites**
- Node.js 18+ installed
- AWS CLI configured
- SST CLI installed (`npm install -g sst`)

### **2. Environment Setup**
```bash
# Clone repository
git clone <repository-url>
cd divizend-newsletter

# Install dependencies
npm install

# Copy environment template
cp env.example .env

# Edit .env with your API keys
# See SETUP.md for detailed configuration
```

### **3. Deploy to Production**
```bash
# Deploy with SST
npx sst deploy

# Your app will be available at the provided URL
# Example: https://d1jjgd52ppf516.cloudfront.net
```

### **4. Verify Deployment**
```bash
# Test the deployed system
curl -X POST 'https://your-app-url.com/api/test-newsletter'

# Check if n8n integration is working
# Visit your Google Sheet to see extracted links
```

## Environment Variables Required

### **Minimum Required**
```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Application
NODE_ENV=production
```

### **For Full Features**
```bash
# Browserbase (Cloud Automation)
BROWSERBASE_API_KEY=bb_live_...
BROWSERBASE_PROJECT_ID=...

# OpenAI (LLM Link Extraction)
OPENAI_API_KEY=sk-proj-...
OPENAI_API_URL=https://api.openai.com/v1/chat/completions

# Skyvern (AI Automation)
SKYVERN_API_KEY=...

# n8n Integration (Google Sheets)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/...
```

## Post-Deployment Checklist

- ✅ **Frontend Loading**: Visit the deployed URL
- ✅ **API Endpoints**: Test `/api/test-newsletter`
- ✅ **Database**: Check DynamoDB table creation
- ✅ **Storage**: Verify S3 bucket creation
- ✅ **CDN**: Confirm CloudFront distribution
- ✅ **n8n Integration**: Test Google Sheets export

## Troubleshooting

### **Common Issues**
1. **Environment Variables**: Ensure all required keys are set
2. **AWS Permissions**: Verify AWS credentials have proper permissions
3. **API Keys**: Check that all third-party API keys are valid
4. **n8n Webhook**: Ensure n8n workflow is active

### **Debug Commands**
```bash
# Check SST status
npx sst status

# View logs
npx sst logs

# Check environment variables
npx sst env list
```

## Production URLs

- **Frontend**: https://d1jjgd52ppf516.cloudfront.net
- **SST Dashboard**: https://sst.dev/u/8eb8b4da
- **API Endpoints**: https://d1jjgd52ppf516.cloudfront.net/api/*

---

*For detailed setup instructions, see [SETUP.md](SETUP.md)*
