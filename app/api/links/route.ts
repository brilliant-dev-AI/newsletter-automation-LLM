import { NextResponse } from "next/server";
import EmailService from "../../../lib/email-service.js";

export async function GET() {
  try {
    const emailService = new EmailService();
    const links = await emailService.getAllExtractedLinks();

    console.log(`📊 Retrieved ${links.length} extracted links`);

    return NextResponse.json({
      success: true,
      count: links.length,
      links: links,
    });
  } catch (error) {
    console.error("❌ Links API error:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve links",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
