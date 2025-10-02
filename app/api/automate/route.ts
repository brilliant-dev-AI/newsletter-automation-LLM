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
    
    // Run the automation
    const result = await runAutomation(url, email, framework);
    
    console.log(`✅ Automation completed for ${framework}`);
    
    return NextResponse.json({
      success: true,
      result: result
    });

  } catch (error) {
    console.error('❌ Automation API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Automation failed',
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
