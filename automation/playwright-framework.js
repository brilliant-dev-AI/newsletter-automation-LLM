// Playwright Framework Implementation
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

class PlaywrightFramework {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log("🎭 Initializing Playwright Framework...");

    try {
      this.browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
      console.log("✅ Playwright browser launched successfully");

      this.page = await this.browser.newPage();

      // Set viewport and user agent
      await this.page.setViewport({ width: 1280, height: 720 });
      await this.page.setExtraHTTPHeaders({
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      });

      // Anti-bot detection avoidance
      await this.setupAntiBotAvoidance();
    } catch (error) {
      console.error("❌ Playwright browser launch failed:", error.message);
      throw new Error(`Failed to launch Playwright browser: ${error.message}`);
    }
  }

  async setupAntiBotAvoidance() {
    console.log("🛡️ Setting up Playwright anti-bot avoidance...");

    // Set realistic headers
    await this.page.setExtraHTTPHeaders({
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "max-age=0",
      "Sec-Ch-Ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    });

    // Remove automation indicators
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => undefined,
      });

      Object.defineProperty(navigator, "plugins", {
        get: () => [1, 2, 3, 4, 5],
      });

      Object.defineProperty(navigator, "languages", {
        get: () => ["en-US", "en"],
      });

      window.chrome = {
        runtime: {},
      };
    });

    // Set realistic timezone
    await this.page.emulateTimezone("America/New_York");
  }

  async runAutomation(url, email) {
    console.log("🎭 Running Playwright automation...");

    try {
      // Navigate to the page with enhanced timeout and anti-bot handling
      await this.page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 60000, // Increased timeout for slow sites
      });
      
      // Check for common anti-bot indicators
      const pageContent = await this.page.content();
      if (pageContent.includes("cloudflare") || pageContent.includes("bot detection") || pageContent.includes("access denied") || pageContent.includes("blocked")) {
        throw new Error("Anti-bot protection detected - Cloudflare or similar protection");
      }
      
      // Random delay to mimic human behavior
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000 + 2000));

      // Enhanced email selectors for newsletter-specific detection
      const emailSelectors = [
        // Newsletter-specific selectors first
        'form[action*="subscribe"] input[type="email"]',
        'form[action*="newsletter"] input[type="email"]',
        'form[action*="signup"] input[type="email"]',
        '.newsletter input[type="email"]',
        '.subscribe input[type="email"]',
        '.signup input[type="email"]',
        '[class*="newsletter"] input[type="email"]',
        '[class*="subscribe"] input[type="email"]',
        '[class*="signup"] input[type="email"]',
        // General email selectors
        'input[type="email"]',
        'input[name*="email" i]',
        'input[id*="email" i]',
        'input[placeholder*="email" i]',
        'input[placeholder*="Email" i]',
        'input[name="email"]',
        'input[id="email"]',
        'input[name="Email"]',
        'input[id="Email"]',
        'input[class*="mktoEmailField"]',
        'input[name="EMAIL"]',
        'input[class*="nl-box__form--email"]',
        'input[id*="mce-EMAIL"]',
        'input[placeholder*="Enter your email" i]',
        'input[placeholder*="Subscribe" i]',
        'input[name*="subscribe" i]',
        'input[id*="subscribe" i]',
        'input[class*="subscribe" i]',
        'input[placeholder*="newsletter" i]',
        'input[name*="newsletter" i]',
        'input[id*="newsletter" i]',
        'input[class*="newsletter" i]',
        'input[placeholder*="signup" i]',
        'input[name*="signup" i]',
        'input[id*="signup" i]',
        'input[class*="signup" i]',
        'input[placeholder*="join" i]',
        'input[name*="join" i]',
        'input[id*="join" i]',
        'input[class*="join" i]',
        'input[placeholder*="get updates" i]',
        'input[name*="updates" i]',
        'input[id*="updates" i]',
        'input[class*="updates" i]',
        'input[aria-label*="email" i]',
        'input[aria-label*="Email" i]',
      ];

      let emailInput = null;
      for (const selector of emailSelectors) {
        try {
          emailInput = await this.page.waitForSelector(selector, {
            timeout: 2000,
          });
          if (emailInput) break;
        } catch (e) {
          continue;
        }
      }

      if (!emailInput) {
        return {
          success: false,
          error: "No newsletter signup form found on this page",
          message: "This website doesn't appear to have a newsletter subscription form. Try a different URL or check if the newsletter signup is in a different section.",
          framework: "playwright",
          processingTime: "2s",
          suggestion: "Try URLs like: /newsletter, /subscribe, or check the website's footer/header for newsletter links",
        };
      }

      await emailInput.click();
      await emailInput.type(email);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find and click submit button
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        "button.mktoButton",
        'button[class*="mktoButton"]',
        'input[value="Meow!"]',
        "input.nl-box__form--button",
        'button[data-element="submit"]',
        'button:has-text("Subscribe")',
        'button:has-text("Sign up")',
        'button:has-text("Join")',
        'button:has-text("Submit")',
        'button:has-text("Get updates")',
        'button:has-text("Newsletter")',
        'button:has-text("submit")',
        'button[class*="subscribe"]',
        'button[class*="newsletter"]',
        'button[class*="bg-mt-blue"]',
        'button[aria-label*="subscribe" i]',
        'button[aria-label*="newsletter" i]',
      ];

      let submitButton = null;
      for (const selector of submitSelectors) {
        try {
          submitButton = await this.page.waitForSelector(selector, {
            timeout: 2000,
          });
          if (submitButton) break;
        } catch (e) {
          continue;
        }
      }

      if (!submitButton) {
        return {
          success: false,
          error: "Found email field but no submit button",
          framework: "playwright",
          processingTime: "3s",
          technicalDetails: "Email field found but no corresponding submit button - this may not be a newsletter signup form",
        };
      }

      await submitButton.click();
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Check for success indicators (both positive and negative)
      const successIndicators = [
        'text="Thank you"',
        'text="Success"',
        'text="Subscribed"',
        'text="Welcome"',
        'text="Confirmed"',
        'text="You\'re subscribed"',
        'text="Subscription confirmed"',
        'text="Check your email"',
        'text="Verification email sent"',
      ];

      const errorIndicators = [
        'text="Error"',
        'text="Invalid email"',
        'text="Already subscribed"',
        'text="Failed"',
        'text="Try again"',
      ];

      let successFound = false;
      let errorFound = false;

      // Check for success indicators
      for (const indicator of successIndicators) {
        try {
          await this.page.waitForSelector(indicator, { timeout: 2000 });
          successFound = true;
          break;
        } catch (e) {
          continue;
        }
      }

      // Check for error indicators
      for (const indicator of errorIndicators) {
        try {
          await this.page.waitForSelector(indicator, { timeout: 2000 });
          errorFound = true;
          break;
        } catch (e) {
          continue;
        }
      }

      // If we found an email field and submit button, and clicked submit, consider it successful
      // unless we explicitly found an error message
      const formSubmitted = !errorFound;
      
      return {
        success: formSubmitted,
        message: formSubmitted 
          ? "Newsletter form submitted successfully" 
          : "Form submission failed - please check the email address or try again",
        framework: "playwright",
        processingTime: "4s",
        selectorsUsed: emailSelectors.length + submitSelectors.length,
      };
    } catch (error) {
      const { getUnifiedErrorMessage, getProcessingTime } = require("../lib/error-messages.js");
      
      return {
        success: false,
        error: getUnifiedErrorMessage(error, "playwright"),
        framework: "playwright",
        processingTime: "2s",
        technicalDetails: error.message,
      };
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log("✅ Playwright browser closed");
    }
  }
}

module.exports = PlaywrightFramework;
