const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  console.log('🚀 Installing Playwright browsers on Lambda...');
  
  try {
    // Set environment variables for browser installation
    process.env.PLAYWRIGHT_BROWSERS_PATH = '/tmp/playwright-browsers';
    
    // Create browsers directory
    const browsersDir = '/tmp/playwright-browsers';
    if (!fs.existsSync(browsersDir)) {
      fs.mkdirSync(browsersDir, { recursive: true });
      console.log('✅ Created browsers directory:', browsersDir);
    }
    
    // Install Playwright browsers
    console.log('📦 Installing Playwright browsers...');
    execSync('npx playwright install chromium', { 
      stdio: 'inherit',
      cwd: '/var/task'
    });
    
    console.log('✅ Playwright browsers installed successfully!');
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Playwright browsers installed successfully',
        browsersPath: browsersDir
      })
    };
    
  } catch (error) {
    console.error('❌ Error installing browsers:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to install Playwright browsers',
        details: error.message
      })
    };
  }
};





