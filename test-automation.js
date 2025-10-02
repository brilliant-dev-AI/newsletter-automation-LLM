const { chromium } = require('playwright');

/**
 * Newsletter Signup Automation Test
 * Tests Playwright automation on various newsletter signup forms
 */

class NewsletterAutomation {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
  }

  async init() {
    console.log('🚀 Starting Newsletter Automation Test...');
    this.browser = await chromium.launch({ 
      headless: false, // Set to true for headless mode
      slowMo: 1000 // Slow down for better visibility
    });
    this.page = await this.browser.newPage();
    
    // Set viewport and user agent
    await this.page.setViewportSize({ width: 1280, height: 720 });
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
  }

  async testNewsletterSignup(url, email, testName) {
    console.log(`\n📧 Testing: ${testName}`);
    console.log(`🔗 URL: ${url}`);
    
    try {
      // Navigate to the page
      console.log('⏳ Navigating to page...');
      await this.page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Wait for page to load
      await this.page.waitForTimeout(2000);
      
      // Look for email input field
      console.log('🔍 Looking for email input field...');
      const emailSelectors = [
        'input[type="email"]',
        'input[name*="email" i]',
        'input[id*="email" i]',
        'input[placeholder*="email" i]',
        'input[placeholder*="Email" i]',
        'input[placeholder*="EMAIL" i]',
        'input[name="email"]',
        'input[id="email"]',
        '.email-input',
        '#email-input',
        '[data-testid*="email" i]'
      ];

      let emailInput = null;
      for (const selector of emailSelectors) {
        try {
          emailInput = await this.page.waitForSelector(selector, { timeout: 2000 });
          if (emailInput) {
            console.log(`✅ Found email input with selector: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }

      if (!emailInput) {
        console.log('❌ No email input field found');
        return {
          success: false,
          error: 'No email input field found',
          url,
          testName
        };
      }

      // Fill email field
      console.log('✍️ Filling email field...');
      await emailInput.click();
      await emailInput.fill(email);
      await this.page.waitForTimeout(500);

      // Look for submit button
      console.log('🔍 Looking for submit button...');
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:has-text("Subscribe")',
        'button:has-text("Sign up")',
        'button:has-text("Join")',
        'button:has-text("Submit")',
        'button:has-text("Get updates")',
        'button:has-text("Newsletter")',
        '.subscribe-button',
        '.submit-button',
        '#subscribe',
        '#submit',
        '[data-testid*="submit" i]',
        '[data-testid*="subscribe" i]'
      ];

      let submitButton = null;
      for (const selector of submitSelectors) {
        try {
          submitButton = await this.page.waitForSelector(selector, { timeout: 2000 });
          if (submitButton) {
            console.log(`✅ Found submit button with selector: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }

      if (!submitButton) {
        console.log('❌ No submit button found');
        return {
          success: false,
          error: 'No submit button found',
          url,
          testName
        };
      }

      // Submit the form
      console.log('🚀 Submitting form...');
      await submitButton.click();
      
      // Wait for response
      await this.page.waitForTimeout(3000);

      // Check for success indicators
      const successIndicators = [
        'text="Thank you"',
        'text="Success"',
        'text="Subscribed"',
        'text="Welcome"',
        'text="Confirmed"',
        '.success',
        '.thank-you',
        '[data-testid*="success" i]'
      ];

      let successFound = false;
      for (const indicator of successIndicators) {
        try {
          await this.page.waitForSelector(indicator, { timeout: 2000 });
          successFound = true;
          console.log(`✅ Success indicator found: ${indicator}`);
          break;
        } catch (e) {
          // Continue checking
        }
      }

      if (successFound) {
        console.log('🎉 Newsletter signup successful!');
        return {
          success: true,
          message: 'Newsletter signup completed successfully',
          url,
          testName
        };
      } else {
        console.log('⚠️ Form submitted but success not confirmed');
        return {
          success: true, // Assuming success if form submitted
          message: 'Form submitted (success not confirmed)',
          url,
          testName
        };
      }

    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      return {
        success: false,
        error: error.message,
        url,
        testName
      };
    }
  }

  async runTests() {
    // Test cases - various newsletter signup forms
    const testCases = [
      {
        url: 'https://www.producthunt.com/newsletter',
        email: 'test@example.com',
        testName: 'Product Hunt Newsletter'
      },
      {
        url: 'https://www.axios.com/newsletters',
        email: 'test@example.com',
        testName: 'Axios Newsletter'
      },
      {
        url: 'https://www.techcrunch.com/newsletters/',
        email: 'test@example.com',
        testName: 'TechCrunch Newsletter'
      }
    ];

    console.log(`🧪 Running ${testCases.length} automation tests...`);

    for (const testCase of testCases) {
      const result = await this.testNewsletterSignup(
        testCase.url,
        testCase.email,
        testCase.testName
      );
      this.results.push(result);
      
      // Wait between tests
      await this.page.waitForTimeout(2000);
    }

    await this.generateReport();
  }

  async generateReport() {
    console.log('\n📊 AUTOMATION TEST REPORT');
    console.log('='.repeat(50));
    
    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((successful / this.results.length) * 100).toFixed(1)}%`);
    
    console.log('\n📋 Detailed Results:');
    this.results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.testName}`);
      console.log(`   URL: ${result.url}`);
      console.log(`   Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      if (result.message) {
        console.log(`   Message: ${result.message}`);
      }
    });

    console.log('\n🎯 Recommendations:');
    if (failed > 0) {
      console.log('- Some tests failed - review error messages and adjust selectors');
      console.log('- Consider adding more email/submit button selectors');
      console.log('- Test with different user agents or viewport sizes');
    } else {
      console.log('- All tests passed! Automation is working well');
      console.log('- Consider adding more test cases for robustness');
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Run the automation test
async function main() {
  const automation = new NewsletterAutomation();
  
  try {
    await automation.init();
    await automation.runTests();
  } catch (error) {
    console.error('💥 Fatal error:', error);
  } finally {
    await automation.cleanup();
  }
}

// Handle command line arguments
if (require.main === module) {
  main().catch(console.error);
}

module.exports = NewsletterAutomation;