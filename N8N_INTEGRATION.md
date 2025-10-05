# n8n Google Sheets Integration

This document describes the n8n integration for automatically exporting extracted newsletter links to Google Sheets.

## Overview

The newsletter automation system can integrate with n8n to send extracted links to external systems like Google Sheets. This is a bonus feature that demonstrates advanced workflow automation capabilities.

## Integration Flow

```
Newsletter Email → Zapier → Our App → Extract Links → n8n Webhook → Google Sheets
```

## n8n Workflow Design

### Required n8n Nodes:
1. **Webhook Trigger** - Receives data from our app
2. **Google Sheets Node** - Writes data to spreadsheet
3. **Optional: Slack Node** - Sends notifications

### Workflow Configuration:

#### Webhook Trigger Settings:
- **HTTP Method**: POST
- **Path**: `/newsletter-links` (or your custom path)
- **Response Mode**: Response Node
- **Authentication**: None (or add if needed)

#### Google Sheets Node Settings:
- **Operation**: Append Row
- **Spreadsheet**: Your Google Sheet ID
- **Sheet**: Sheet name (e.g., "Newsletter Links")
- **Columns**: Map incoming data to columns

### Google Sheets Column Mapping:

| Column | Source Field | Description |
|--------|--------------|-------------|
| A | newsletter_subject | Email subject line |
| B | newsletter_from | Sender email address |
| C | newsletter_date | Email date |
| D | link_url | Extracted link URL |
| E | link_text | Link text/description |
| F | link_context | Link context from email |
| G | link_category | AI-categorized link type |
| H | link_relevance | Relevance score (1-10) |
| I | extraction_method | How link was extracted |
| J | extracted_at | When link was extracted |
| K | processing_timestamp | When sent to n8n |

## Data Format

The system sends each extracted link as a separate webhook payload:

```json
{
  "newsletter_subject": "Weekly Tech News",
  "newsletter_from": "newsletter@example.com",
  "newsletter_date": "2024-10-05T12:00:00Z",
  "link_url": "https://example.com/article",
  "link_text": "Article Title",
  "link_context": "Featured in this week's newsletter",
  "link_category": "article",
  "link_relevance": 8,
  "extraction_method": "llm",
  "extracted_at": "2024-10-05T12:01:00Z",
  "processing_timestamp": "2024-10-05T12:01:30Z"
}
```

## Quick Setup Guide

### 1. Configure Environment Variables
Edit your `.env` file:
```bash
# Copy the template
cp env.example .env

# Edit .env and add your n8n webhook URL
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

### 2. Create n8n Workflow
1. Sign up at [n8n.cloud](https://n8n.cloud) or deploy self-hosted
2. Create new workflow
3. Add **Webhook Trigger** node
4. Configure webhook URL (copy this URL)
5. Add **Google Sheets** node
6. Connect nodes and configure

### 3. Test the Integration
```bash
# Test locally
npm run dev
curl -X POST 'http://localhost:3000/api/test-newsletter'

# Test on deployed version
curl -X POST 'https://your-app.com/api/test-newsletter'
```

### 4. Deploy
```bash
sst deploy --stage production
```

## Testing

### Test the Integration:
1. Send a test newsletter email to your Zapier-forwarded address
2. Check n8n workflow execution logs
3. Verify data appears in Google Sheets

## API Endpoints

The system now includes dedicated API endpoints for n8n integration:

### 1. Test Endpoint (`/api/test-newsletter`)
**Purpose**: Test newsletter processing and n8n integration with mock data

**Usage**:
```bash
# Test the integration locally
curl -X POST 'http://localhost:3000/api/test-newsletter'

# Test on deployed version
curl -X POST 'https://your-app.com/api/test-newsletter'
```

**Response**:
```json
{
  "success": true,
  "message": "Newsletter processing and n8n integration test completed successfully",
  "emailId": "test-email-1234567890",
  "linksExtracted": 4,
  "links": [...],
  "n8nIntegration": "Enabled"
}
```

### 2. Email Webhook (`/api/email-webhook`)
**Purpose**: Process real newsletter emails and send to n8n

**Usage**:
```bash
curl -X POST 'https://your-app.com/api/email-webhook' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "newsletter@example.com",
    "subject": "Weekly Newsletter",
    "body": "Email content...",
    "html": "<html>...</html>"
  }'
```

### 3. Links API (`/api/links`)
**Purpose**: Retrieve all extracted links from DynamoDB

**Usage**:
```bash
curl 'https://your-app.com/api/links'
```

## Benefits

### For Data Analysis:
- **Historical tracking** of newsletter content
- **Category analysis** of link types
- **Trend identification** over time
- **Performance metrics** by source

### For Team Collaboration:
- **Shared spreadsheet** for team access
- **Filterable data** by category, date, source
- **Export capabilities** for further analysis
- **Automated updates** without manual work

## Troubleshooting

### Common Issues:

1. **Webhook not receiving data**
   - Check n8n webhook URL in environment
   - Verify n8n workflow is active
   - Check Lambda logs for errors

2. **Google Sheets not updating**
   - Verify Google Sheets credentials in n8n
   - Check spreadsheet permissions
   - Ensure column mapping is correct

3. **Data format issues**
   - Check webhook payload structure
   - Verify all required fields are present
   - Test with sample data

### Debug Commands:
```bash
# Check environment variables
sst env list --stage production

# View Lambda logs
sst logs --stage production

# Test webhook locally
curl -X POST 'http://localhost:3000/api/test-newsletter'
```

## Advanced Features

### Optional Enhancements:

1. **Slack Notifications**
   - Add Slack node to n8n workflow
   - Send summaries of new links
   - Alert on high-value content

2. **Data Filtering**
   - Filter links by category
   - Only export high-relevance links
   - Custom business logic

3. **Multiple Destinations**
   - Send to multiple Google Sheets
   - Export to different formats
   - Integrate with CRM systems

## Security Considerations

- **Webhook Authentication**: Consider adding authentication to webhook
- **Data Privacy**: Ensure compliance with email data handling
- **Rate Limiting**: Monitor webhook call frequency
- **Error Handling**: Implement retry mechanisms

## Cost Considerations

- **n8n Cloud**: Free tier available, paid plans for advanced features
- **Google Sheets API**: Free for reasonable usage
- **Lambda Calls**: Minimal cost for webhook processing

This integration demonstrates the system's capability to extend beyond basic automation into comprehensive workflow orchestration, making it suitable for enterprise-level newsletter processing and data management.

