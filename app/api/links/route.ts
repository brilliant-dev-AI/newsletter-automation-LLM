import { NextRequest, NextResponse } from 'next/server';
const EmailService = require('../../../lib/email-service.js');

export async function GET(request: NextRequest) {
  try {
    const emailService = new EmailService();
    const links = await emailService.getAllExtractedLinks();

    console.log(`📊 Retrieved ${links.length} extracted links`);

    return NextResponse.json({
      success: true,
      count: links.length,
      links: links
    });

  } catch (error) {
    console.error('❌ Links API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve links',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { linkId } = await request.json();

    if (!linkId) {
      return NextResponse.json(
        { error: 'Missing required field: linkId' },
        { status: 400 }
      );
    }

    const emailService = new EmailService();
    await emailService.markLinkProcessed(linkId);

    console.log(`✅ Link marked as processed: ${linkId}`);

    return NextResponse.json({
      success: true,
      message: 'Link marked as processed'
    });

  } catch (error) {
    console.error('❌ Mark link processed API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to mark link as processed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
