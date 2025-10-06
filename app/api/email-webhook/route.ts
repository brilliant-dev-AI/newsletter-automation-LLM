import { NextRequest, NextResponse } from "next/server";
import EmailService from "../../../lib/email-service.js";

export async function POST(request: NextRequest) {
  try {
    console.log("📬 Received newsletter email webhook...");

    // Parse the incoming email data
    const emailData = await request.json();

    if (!emailData) {
      return NextResponse.json(
        {
          success: false,
          error: "No email data provided",
        },
        { status: 400 },
      );
    }

    console.log(`📧 Processing email from: ${emailData.from || "Unknown"}`);
    console.log(`📧 Subject: ${emailData.subject || "No subject"}`);

    // Create email service instance
    const emailService = new EmailService();

    // Process the incoming email
    const result = await emailService.processIncomingEmail(emailData);

    if (result.success) {
      console.log(`✅ Email processed successfully!`);
      console.log(`📊 Extracted ${result.linksExtracted} links`);
      console.log(`🔗 Email ID: ${result.emailId}`);

      return NextResponse.json({
        success: true,
        message: "Newsletter email processed successfully",
        emailId: result.emailId,
        linksExtracted: result.linksExtracted,
        links: result.links,
        n8nIntegration: process.env.N8N_WEBHOOK_URL ? "Enabled" : "Disabled",
      });
    } else {
      console.error("❌ Email processing failed:", result.error);

      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: "Email processing failed",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("❌ Email webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Email webhook processing failed",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Newsletter email processing webhook endpoint",
    usage:
      "POST email data to this endpoint for processing and n8n integration",
    n8nStatus: process.env.N8N_WEBHOOK_URL ? "Configured" : "Not configured",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      test: "/api/test-newsletter",
      webhook: "/api/email-webhook",
      links: "/api/links",
    },
  });
}
