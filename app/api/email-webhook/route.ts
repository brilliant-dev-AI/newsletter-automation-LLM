import { NextRequest, NextResponse } from 'next/server';
const EmailService = require('../../../lib/email-service.js');

export async function POST(request: NextRequest) {
  try {
    console.log('📬 Received email webhook request');
    
    // Parse the incoming email data
    const rawData = await request.json();
    
    // Normalize field names for different sources (Zapier vs direct calls)
    const emailData = {
      from: rawData.from || rawData.from_email,
      subject: rawData.subject,
      body: rawData.body || rawData.body_plain,
      html: rawData.html || rawData.body_html,
      date: rawData.date,
      to: rawData.to || rawData.to_emails,
      cc: rawData.cc || rawData.cc_emails,
      messageId: rawData.message_id || rawData.messageId
    };
    
    // Validate required fields
    if (!emailData.from || !emailData.subject) {
      return NextResponse.json(
        { error: 'Missing required fields: from, subject' },
        { status: 400 }
      );
    }

    console.log(`📧 Processing email from: ${emailData.from}`);
    console.log(`📧 Subject: ${emailData.subject}`);
    console.log(`📧 Source: ${rawData.from_email ? 'Zapier' : 'Direct'}`);

    const emailService = new EmailService();

    // Process the incoming newsletter email
    const result = await emailService.processIncomingEmail(emailData);

    if (result.success) {
      console.log(`✅ Newsletter processed successfully: ${result.emailId}`);
      console.log(`🔗 Extracted ${result.linksExtracted} links`);
      
      return NextResponse.json({
        success: true,
        message: 'Newsletter processed successfully',
        emailId: result.emailId,
        linksExtracted: result.linksExtracted,
        links: result.links
      });
    } else {
      console.error(`❌ Newsletter processing failed: ${result.error}`);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Email webhook error:', error);
    return NextResponse.json(
      { 
        error: 'Email processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email Webhook API',
    description: 'Receives incoming newsletter emails for processing',
    endpoints: {
      POST: '/api/email-webhook - Process incoming newsletter emails'
    },
    usage: {
      method: 'POST',
      body: {
        from: 'newsletter@example.com',
        subject: 'Weekly Newsletter',
        body: 'Email text content',
        html: '<html>Email HTML content</html>',
        date: '2024-01-01T00:00:00Z'
      }
    },
    webhookSetup: {
      gmail: 'Use Gmail API to forward emails to this endpoint',
      outlook: 'Use Outlook API to forward emails to this endpoint',
      custom: 'Configure your email provider to POST to this endpoint'
    }
  });
}
