// Browserbase Framework Implementation - Using Official SDK + Playwright
const { Browserbase } = require("@browserbasehq/sdk");
const { chromium } = require("playwright-core");
require("dotenv").config();

class BrowserbaseFramework {
  constructor() {
    this.apiKey = process.env.BROWSERBASE_API_KEY;
    this.projectId = process.env.BROWSERBASE_PROJECT_ID;
    this.client = null;
    this.sessionId = null;
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log("🌐 Initializing Browserbase Framework...");
    
    if (!this.apiKey) {
      throw new Error("BROWSERBASE_API_KEY not configured");
    }
    
    if (!this.projectId) {
      throw new Error("BROWSERBASE_PROJECT_ID not configured");
    }

    // Initialize the official Browserbase SDK
    this.client = new Browserbase({
      apiKey: this.apiKey,
    });

    console.log("✅ Browserbase Framework initialized with official SDK");
  }

  async runAutomation(url, email) {
    console.log("🌐 Running Browserbase cloud automation...");

    try {
      const startTime = Date.now();

      // Create a new Browserbase session using the official SDK
      console.log("☁️ Creating Browserbase session...");
      const session = await this.client.sessions.create({
        projectId: this.projectId,
      });

      this.sessionId = session.id;
      console.log(`☁️ Created Browserbase session: ${this.sessionId}`);

      // Connect Playwright to Browserbase's remote browser
      console.log("🎭 Connecting Playwright to Browserbase session...");
      this.browser = await chromium.connectOverCDP(session.connectUrl);
      this.page = await this.browser.newPage();

      // Navigate to the URL
      console.log(`🌐 Navigating to: ${url}`);
      await this.page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      // Check for anti-bot protection (same logic as Playwright framework)
      const pageContent = await this.page.content();
      const pageTitle = (await this.page.title()).toLowerCase();
      
      const isCloudflareChallenge = pageContent.includes("Just a moment") || 
                                   pageContent.includes("Checking your browser") ||
                                   pageContent.includes("DDoS protection by Cloudflare") ||
                                   pageTitle.includes("just a moment");
      
      const isBotDetection = pageContent.includes("bot detection") || 
                            pageContent.includes("access denied") || 
                            pageContent.includes("blocked") ||
                            pageContent.includes("captcha") ||
                            pageContent.includes("verify you are human");
      
      if (isCloudflareChallenge || isBotDetection) {
        throw new Error("Anti-bot protection detected - Cloudflare or similar protection");
      }

      // Find and fill email field using Playwright
      console.log("📧 Finding email field...");
      const emailSelectors = [
        'input[type="email"]',
        'input[name*="email"]',
        'input[id*="email"]',
        'input[placeholder*="email" i]',
        'input[placeholder*="Email" i]',
        'input[name*="Email"]',
        'input[id*="Email"]',
        'input[name="member[email]"]',
        'input[id="member_email"]',
        'input[class*="email"]',
        'input[class*="Email"]',
      ];

      let emailInput = null;
      for (const selector of emailSelectors) {
        try {
          emailInput = await this.page.waitForSelector(selector, { timeout: 2000 });
          if (emailInput) break;
        } catch (e) {
          // Continue to next selector
        }
      }

      if (!emailInput) {
        throw new Error("Email input field not found");
      }

      await emailInput.fill(email);
      console.log("✅ Email field found and filled");

      // Wait a moment before finding submit button
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find and click submit button using Playwright
      console.log("🔘 Finding submit button...");
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:has-text("Subscribe")',
        'button:has-text("Sign up")',
        'button:has-text("Submit")',
        'input[value*="Subscribe"]',
        'input[value*="Sign up"]',
        'input[value*="Submit"]',
        'button[name*="subscribe"]',
        'input[name*="subscribe"]',
        'button[id*="submit"]',
        'input[id*="submit"]',
        'button[class*="submit"]',
        'input[class*="submit"]',
        'button[class*="subscribe"]',
        'input[class*="subscribe"]',
      ];

      let submitButton = null;
      for (const selector of submitSelectors) {
        try {
          submitButton = await this.page.waitForSelector(selector, { timeout: 2000 });
          if (submitButton) break;
        } catch (e) {
          // Continue to next selector
        }
      }

      if (!submitButton) {
        throw new Error("Submit button not found");
      }

      await submitButton.click();
      console.log("✅ Submit button found and clicked");

      // Wait for potential success message
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Close browser (session will auto-cleanup)
      console.log("🔒 Closing browser...");
      await this.browser.close();

      const processingTime = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;

      console.log(`✅ Browserbase automation completed in ${processingTime}`);

      return {
        success: true,
        message: "Newsletter form submitted successfully",
        framework: "browserbase",
        processingTime: processingTime,
        cloudInstances: 1,
        mcpProtocol: "v1.0",
        sessionId: this.sessionId,
        cloudFeatures: true,
      };
    } catch (error) {
      console.error(`❌ Browserbase automation error: ${error.message}`);

      // Clean up browser and session
      if (this.browser) {
        try {
          await this.browser.close();
        } catch (cleanupError) {
          console.error(`⚠️ Failed to close browser: ${cleanupError.message}`);
        }
      }

      // Session will auto-cleanup when browser closes
      if (this.sessionId) {
        console.log(`🧹 Session will auto-cleanup: ${this.sessionId}`);
      }

      const { getUnifiedErrorMessage } = require("../lib/error-messages.js");

      return {
        success: false,
        error: getUnifiedErrorMessage(error, "browserbase"),
        framework: "browserbase",
        processingTime: "0.0s",
        cloudInstances: 1,
        mcpProtocol: "v1.0",
        apiError: true,
        sessionId: this.sessionId || "failed",
        technicalDetails: error.message,
      };
    }
  }

  async cleanup() {
    console.log("✅ Browserbase Framework cleanup completed");
  }

  // Helper method to get success rate prediction
  getSuccessRate(url) {
    // Simulate different success rates for cloud automation
    if (url.includes("producthunt")) return 0.9;
    if (url.includes("axios")) return 0.75;
    if (url.includes("techcrunch")) return 0.7;
    return 0.8;
  }
}

module.exports = BrowserbaseFramework;