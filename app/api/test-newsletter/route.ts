import { NextRequest, NextResponse } from "next/server";
import EmailService from "../../../lib/email-service.js";

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 Testing newsletter processing and n8n integration...");

    // Create a test email service instance
    const emailService = new EmailService();

    // Mock newsletter email data for testing
    const testEmailData = {
      id: `test-email-${Date.now()}`,
      from: "newsletter@example.com",
      subject: "Weekly Tech Newsletter - Test Edition",
      date: new Date().toISOString(),
      body: `
        Welcome to our weekly tech newsletter!
        
        Here are this week's top stories:
        
        1. New AI breakthrough: https://example.com/ai-breakthrough
        2. Developer tools roundup: https://example.com/dev-tools
        3. Startup funding news: https://example.com/funding-news
        
        Don't forget to check out our latest product: https://example.com/new-product
        
        Best regards,
        The Tech Team
        
        Unsubscribe: https://example.com/unsubscribe
      `,
      html: `
        <html>
          <body>
            <h1>Weekly Tech Newsletter</h1>
            <p>Welcome to our weekly tech newsletter!</p>
            
            <h2>Top Stories:</h2>
            <ul>
              <li><a href="https://example.com/ai-breakthrough">New AI breakthrough</a></li>
              <li><a href="https://example.com/dev-tools">Developer tools roundup</a></li>
              <li><a href="https://example.com/funding-news">Startup funding news</a></li>
            </ul>
            
            <p>Don't forget to check out our <a href="https://example.com/new-product">latest product</a>!</p>
            
            <p>Best regards,<br>The Tech Team</p>
            
            <p><a href="https://example.com/unsubscribe">Unsubscribe</a></p>
          </body>
        </html>
      `,
      raw: "Mock email raw content",
      headers: {},
      attachments: [],
    };

    console.log("📧 Processing test newsletter email...");

    // Process the test email (this will trigger n8n integration)
    const result = await emailService.processIncomingEmail(testEmailData);

    if (result.success) {
      console.log(`✅ Test completed successfully!`);
      console.log(`📊 Extracted ${result.linksExtracted} links`);
      console.log(`🔗 Email ID: ${result.emailId}`);

      return NextResponse.json({
        success: true,
        message:
          "Newsletter processing and n8n integration test completed successfully",
        emailId: result.emailId,
        linksExtracted: result.linksExtracted,
        links: result.links,
        n8nIntegration: process.env.N8N_WEBHOOK_URL
          ? "Enabled"
          : "Disabled (no webhook URL configured)",
      });
    } else {
      console.error("❌ Test failed:", result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: "Newsletter processing test failed",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("❌ Test endpoint error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Test endpoint failed",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Newsletter processing and n8n integration test endpoint",
    usage:
      "POST to this endpoint to test newsletter processing and n8n integration",
    n8nStatus: process.env.N8N_WEBHOOK_URL ? "Configured" : "Not configured",
    environment: process.env.NODE_ENV || "development",
  });
}
