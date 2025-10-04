import { NextRequest, NextResponse } from 'next/server';
const EmailService = require('../../../lib/email-service.js');

export async function POST(request: NextRequest) {
  try {
    const { newsletterUrl, email } = await request.json();

    if (!newsletterUrl) {
      return NextResponse.json(
        { error: 'Missing required field: newsletterUrl' },
        { status: 400 }
      );
    }

    console.log(`🧪 Testing newsletter processing for: ${newsletterUrl}`);

    const emailService = new EmailService();

    // Use a simple mock email for testing
    const newsletterEmail = 'example@gmail.com';
    console.log(`📧 Using mock email for testing: ${newsletterEmail}`);

    // Simulate an incoming newsletter email
    const mockNewsletterEmail = {
      id: `test-${Date.now()}`,
      from: 'newsletter@example.com',
      subject: `Test Newsletter - ${newsletterUrl}`,
      date: new Date().toISOString(),
      body: `This is a test newsletter from ${newsletterUrl}.

Here are some interesting links:

1. Check out this amazing tool: https://github.com/microsoft/vscode
2. Read this article about AI: https://openai.com/blog/gpt-4
3. Product Hunt featured app: https://www.producthunt.com/products/notion
4. Follow us on Twitter: https://twitter.com/example
5. Our latest blog post: https://example.com/blog/latest

Thanks for subscribing!`,
      html: `
        <html>
          <body>
            <h1>Test Newsletter</h1>
            <p>This is a test newsletter from ${newsletterUrl}.</p>
            
            <h2>Interesting Links:</h2>
            <ul>
              <li><a href="https://github.com/microsoft/vscode">Check out this amazing tool</a></li>
              <li><a href="https://openai.com/blog/gpt-4">Read this article about AI</a></li>
              <li><a href="https://www.producthunt.com/products/notion">Product Hunt featured app</a></li>
              <li><a href="https://twitter.com/example">Follow us on Twitter</a></li>
              <li><a href="https://example.com/blog/latest">Our latest blog post</a></li>
            </ul>
            
            <p>Thanks for subscribing!</p>
          </body>
        </html>
      `,
      raw: 'Mock email content'
    };

    // Process the newsletter
    const result = await emailService.processIncomingEmail(mockNewsletterEmail);

    if (result.success) {
      console.log(`✅ Test newsletter processed successfully: ${result.emailId}`);
      return NextResponse.json({
        success: true,
        message: 'Test newsletter processed successfully',
        newsletterEmail: newsletterEmail,
        emailId: result.emailId,
        linksExtracted: result.linksExtracted,
        links: result.links
      });
    } else {
      console.error(`❌ Test newsletter processing failed: ${result.error}`);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Test newsletter API error:', error);
    return NextResponse.json(
      { 
        error: 'Test newsletter processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test Newsletter Processing API',
    endpoints: {
      POST: '/api/test-newsletter - Test newsletter processing with mock data'
    },
    usage: {
      method: 'POST',
      body: {
        newsletterUrl: 'https://example.com/newsletter',
        email: 'test@example.com'
      }
    }
  });
}
