import { NextRequest, NextResponse } from "next/server";

// Import the three framework files directly
const PlaywrightFramework = require("../../../automation/playwright-framework.js");
const SkyvernFramework = require("../../../automation/skyvern-framework.js");
const BrowserbaseFramework = require("../../../automation/browserbase-framework.js");

export async function POST(request: NextRequest) {
  let frameworkInstance = null;

  try {
    const { url, email, framework } = await request.json();

    if (!url || !email || !framework) {
      return NextResponse.json(
        { error: "Missing required fields: url, email, framework" },
        { status: 400 },
      );
    }

    console.log(`🚀 Starting ${framework} automation on ${url}`);

    // Initialize the specific framework
    switch (framework.toLowerCase()) {
      case "playwright":
        frameworkInstance = new PlaywrightFramework();
        await frameworkInstance.init();
        break;
      case "skyvern":
        frameworkInstance = new SkyvernFramework();
        await frameworkInstance.init();
        break;
      case "browserbase":
        frameworkInstance = new BrowserbaseFramework();
        await frameworkInstance.init();
        break;
      default:
        return NextResponse.json(
          { error: `Unknown framework: ${framework}` },
          { status: 400 },
        );
    }

    // Run the automation with timeout
    const automationPromise = frameworkInstance.runAutomation(url, email);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Automation timeout after 55 seconds")),
        55000,
      ),
    );

    const result = await Promise.race([automationPromise, timeoutPromise]);

    console.log(`✅ ${framework} automation completed`);

    return NextResponse.json({
      success: (result as any).success,
      result: result,
    });
  } catch (error) {
    console.error("❌ Automation API error:", error);

    // Handle specific errors
    let errorMessage = "Automation failed";
    if (error instanceof Error) {
      if (error.message.includes("Browser not available on Lambda")) {
        errorMessage =
          "Browser not available on AWS Lambda. This is a deployment configuration issue.";
      } else if (error.message.includes("timeout")) {
        errorMessage =
          "Automation timed out. The website may be slow or unresponsive.";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  } finally {
    // Cleanup framework instance
    if (frameworkInstance && typeof frameworkInstance.cleanup === 'function') {
      try {
        await frameworkInstance.cleanup();
      } catch (cleanupError) {
        console.error("⚠️ Framework cleanup error:", cleanupError);
      }
    }
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Newsletter Automation API",
    frameworks: ["playwright", "skyvern", "browserbase"],
    endpoints: {
      POST: "/api/automate - Run automation with { url, email, framework }",
    },
  });
}
