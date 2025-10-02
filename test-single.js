const { chromium } = require('playwright');

/**
 * Single Newsletter Test - Product Hunt with real email
 */

async function testProductHunt() {
  console.log('🚀 Testing Product Hunt Newsletter Signup...');
  
  const browser = await chromium.launch({ 
    headless: false, // Show browser for visibility
    slowMo: 1000 // Slow down for better visibility
  });
  
  const page = await browser.newPage();
  
  try {
    // Set viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navigate to Product Hunt newsletter
    console.log('⏳ Navigating to Product Hunt newsletter page...');
    await page.goto('https://www.producthunt.com/newsletter', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    console.log('✅ Page loaded successfully!');
    
    // Wait a moment for page to fully load
    await page.waitForTimeout(3000);
    
    // Look for email input
    console.log('🔍 Looking for email input field...');
    
    const emailSelectors = [
      'input[type="email"]',
      'input[name*="email" i]',
      'input[id*="email" i]',
      'input[placeholder*="email" i]',
      'input[placeholder*="Email" i]'
    ];
    
    let emailInput = null;
    for (const selector of emailSelectors) {
      try {
        emailInput = await page.waitForSelector(selector, { timeout: 3000 });
        if (emailInput) {
          console.log(`✅ Found email input with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!emailInput) {
      console.log('❌ No email input found');
      return;
    }
    
    // Fill email field
    console.log('✍️ Filling email field with: dev.smart101@gmail.com');
    await emailInput.click();
    await emailInput.fill('dev.smart101@gmail.com');
    await page.waitForTimeout(1000);
    
    // Look for submit button
    console.log('🔍 Looking for submit button...');
    
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Subscribe")',
      'button:has-text("Sign up")',
      'button:has-text("Join")',
      'button:has-text("Submit")'
    ];
    
    let submitButton = null;
    for (const selector of submitSelectors) {
      try {
        submitButton = await page.waitForSelector(selector, { timeout: 3000 });
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
      return;
    }
    
    // Click submit button
    console.log('🚀 Clicking submit button...');
    await submitButton.click();
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    // Check for success indicators
    console.log('🔍 Checking for success indicators...');
    
    const successIndicators = [
      'text="Thank you"',
      'text="Success"',
      'text="Subscribed"',
      'text="Welcome"',
      'text="Confirmed"',
      '.success',
      '.thank-you'
    ];
    
    let successFound = false;
    for (const indicator of successIndicators) {
      try {
        await page.waitForSelector(indicator, { timeout: 2000 });
        successFound = true;
        console.log(`✅ Success indicator found: ${indicator}`);
        break;
      } catch (e) {
        // Continue checking
      }
    }
    
    if (successFound) {
      console.log('🎉 Newsletter signup successful!');
    } else {
      console.log('⚠️ Form submitted - check your email for confirmation');
    }
    
    console.log('\n📋 Summary:');
    console.log('- Email: dev.smart101@gmail.com');
    console.log('- Status: Form submitted');
    console.log('- Check your email for confirmation!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testProductHunt().catch(console.error);