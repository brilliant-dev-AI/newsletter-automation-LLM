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
      // Navigate to the page
      await this.page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Enhanced email selectors for better detection
      const emailSelectors = [
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
          error: "No email input field found",
          framework: "playwright",
          processingTime: "2s",
        };
      }

      await emailInput.click();
      await emailInput.fill(email);
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
          error: "No submit button found",
          framework: "playwright",
          processingTime: "3s",
        };
      }

      await submitButton.click();
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Check for success
      const successIndicators = [
        'text="Thank you"',
        'text="Success"',
        'text="Subscribed"',
        'text="Welcome"',
        'text="Confirmed"',
      ];

      let successFound = false;
      for (const indicator of successIndicators) {
        try {
          await this.page.waitForSelector(indicator, { timeout: 2000 });
          successFound = true;
          break;
        } catch (e) {
          continue;
        }
      }

      return {
        success: successFound,
        message: successFound
          ? "Newsletter signup completed successfully"
          : "Form submitted (success not confirmed)",
        framework: "playwright",
        processingTime: "4s",
        selectorsUsed: emailSelectors.length + submitSelectors.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Playwright automation failed - element not clickable or not found",
        framework: "playwright",
        processingTime: "2s",
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
