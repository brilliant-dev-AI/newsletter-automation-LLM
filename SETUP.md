# Newsletter Automation Setup Guide

## Environment Variables Configuration

This project supports both **real API integrations** and **simulation mode** for all three automation frameworks.

### 1. Copy Environment Template

```bash
cp env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file with your API keys:

#### **Skyvern AI (Optional - for real AI automation)**
```bash
SKYVERN_API_KEY=your_actual_skyvern_api_key
SKYVERN_API_URL=https://api.skyvern.com/v1
SKYVERN_TIMEOUT=30000
```

#### **Browserbase MCP (Optional - for real cloud automation)**
```bash
BROWSERBASE_API_KEY=your_actual_browserbase_api_key
BROWSERBASE_PROJECT_ID=your_project_id
BROWSERBASE_API_URL=https://www.browserbase.com/api/v1
```

#### **OpenAI (Future - for LLM link extraction)**
```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4
```

#### **AWS (Future - for email processing)**
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

## How It Works

### **Without API Keys (Current Default)**
- ✅ **Playwright**: Real browser automation
- 🤖 **Skyvern**: Real browser automation with AI-like selectors
- ☁️ **Browserbase**: Real browser automation with cloud-like features

### **With API Keys (Future Enhancement)**
- ✅ **Playwright**: Real browser automation
- 🤖 **Skyvern**: Real AI API calls to Skyvern service
- ☁️ **Browserbase**: Real cloud browser sessions via API

## Getting API Keys

### Skyvern
1. Visit [Skyvern AI](https://skyvern.com)
2. Sign up for an account
3. Get your API key from the dashboard
4. Add to `.env` file

### Browserbase
1. Visit [Browserbase](https://browserbase.com)
2. Create a project
3. Get your API key and project ID
4. Add to `.env` file

### OpenAI
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Create an API key
3. Add to `.env` file

## Testing

### Test with Simulation (No API Keys Needed)
```bash
npm run test:unified
```

### Test with Real APIs (Requires API Keys)
```bash
# Set your API keys in .env first
npm run test:unified
```

## Current Status

- ✅ **All frameworks work** without API keys (using local browser automation)
- ✅ **Real API integration ready** when you add API keys
- ✅ **Automatic fallback** to simulation if no API keys provided
- ✅ **UI integration** works with both modes

## Next Steps

1. **Test current setup**: Works out of the box with simulations
2. **Add API keys**: For real service integrations
3. **Deploy**: Ready for production with SST
4. **Scale**: Add email processing and LLM extraction


