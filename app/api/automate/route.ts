import { NextRequest, NextResponse } from 'next/server';
import { runAutomation } from '../../../automation/unified-automation.js';

export async function POST(request: NextRequest) {
  try {
    const { url, email, framework } = await request.json();

    if (!url || !email || !framework) {
      return NextResponse.json(
        { error: 'Missing required fields: url, email, framework' },
        { status: 400 }
      );
    }

    console.log(`🚀 Starting automation for ${framework} on ${url}`);
    
            // Run the automation with timeout
            const automationPromise = runAutomation(url, email, framework);
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Automation timeout after 55 seconds')), 55000)
            );
    
    const result = await Promise.race([automationPromise, timeoutPromise]);
    
    console.log(`✅ Automation completed for ${framework}`);
    
    return NextResponse.json({
      success: true,
      result: result
    });

  } catch (error) {
    console.error('❌ Automation API error:', error);
    
    // Handle specific Lambda/browser errors
    let errorMessage = 'Automation failed';
    if (error instanceof Error) {
      if (error.message.includes('Browser not available on Lambda')) {
        errorMessage = 'Browser not available on AWS Lambda. This is a deployment configuration issue.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Automation timed out. The website may be slow or unresponsive.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Newsletter Automation API',
    frameworks: ['playwright', 'skyvern', 'browserbase'],
    endpoints: {
      POST: '/api/automate - Run automation with { url, email, framework }'
    }
  });
}
