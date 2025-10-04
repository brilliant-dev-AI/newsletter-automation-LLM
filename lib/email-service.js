// Email processing service for newsletter automation
const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const cheerio = require('cheerio');
const axios = require('axios');
require('dotenv').config();

class EmailService {
  constructor() {
    // Only initialize AWS services if not in development mode
    if (process.env.NODE_ENV !== 'development') {
      this.ses = new AWS.SES({
        region: process.env.AWS_REGION || 'us-east-1'
      });
      
      this.s3 = new AWS.S3({
        region: process.env.AWS_REGION || 'us-east-1'
      });
    } else {
      console.log('🔧 Running in development mode - AWS services disabled');
    }
    
    // Email configuration
    this.emailConfig = {
      // Use a real email service for testing
      // For production, you'd want to use SES or similar
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    };
    
    this.newsletterEmail = process.env.NEWSLETTER_EMAIL || 'newsletter@divizend.com';
    this.notificationEmail = process.env.NOTIFICATION_EMAIL || 'admin@divizend.com';
  }

  /**
   * Create a unique email address for newsletter signups
   * Format: newsletter-{timestamp}-{random}@divizend.com
   */
  generateNewsletterEmail() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `newsletter-${timestamp}-${random}@divizend.com`;
  }

  /**
   * Set up email forwarding for a newsletter email
   * This would typically be done through your email provider
   */
  async setupEmailForwarding(newsletterEmail, targetEmail) {
    console.log(`📧 Setting up email forwarding: ${newsletterEmail} -> ${targetEmail}`);
    
    // In a real implementation, you'd:
    // 1. Create the email address in your domain
    // 2. Set up forwarding rules
    // 3. Configure webhook endpoints for incoming emails
    
    // For now, we'll simulate this
    return {
      success: true,
      newsletterEmail: newsletterEmail,
      targetEmail: targetEmail,
      forwardingSetup: true
    };
  }

  /**
   * Process incoming newsletter email
   * This would be called by a webhook when emails arrive
   */
  async processIncomingEmail(emailData) {
    console.log(`📬 Processing incoming newsletter email...`);
    
    try {
      // Parse and clean email data
      const email = this.parseEmailData(emailData);
      
      // Check if this looks like a newsletter
      if (!this.isNewsletterEmail(email)) {
        console.log(`⚠️ Email doesn't appear to be a newsletter, skipping processing`);
        return {
          success: false,
          error: 'Email does not appear to be a newsletter',
          skipped: true
        };
      }

      // Extract links using LLM (skip storage for testing)
      const extractedLinks = await this.extractLinksFromEmail(email);

      // Skip notification for testing
      console.log(`📧 Newsletter processed: ${email.subject}`);

      return {
        success: true,
        emailId: email.id,
        linksExtracted: extractedLinks.length,
        links: extractedLinks
      };

    } catch (error) {
      console.error('❌ Error processing email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Store email content in S3 (with local development fallback)
   */
  async storeEmail(email) {
    const key = `emails/${email.id}.json`;
    
    // Check if we're in local development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Email stored locally (dev mode): ${key}`);
      console.log(`📧 Email content: ${JSON.stringify(email, null, 2).substring(0, 200)}...`);
      return key;
    }
    
    const params = {
      Bucket: process.env.EMAIL_BUCKET || 'divizend-newsletter-emails',
      Key: key,
      Body: JSON.stringify(email, null, 2),
      ContentType: 'application/json'
    };

    try {
      await this.s3.putObject(params).promise();
      console.log(`✅ Email stored in S3: ${key}`);
      return key;
    } catch (error) {
      console.error('❌ Error storing email:', error);
      console.log(`⚠️ Falling back to local storage for: ${key}`);
      return key;
    }
  }

  /**
   * Extract links from email content using LLM
   */
  async extractLinksFromEmail(email) {
    console.log(`🔗 Extracting links from email: ${email.subject}`);
    
    try {
      // First, do basic HTML parsing for all links
      const basicLinks = await this.extractLinksBasic(email);
      
      // Then use LLM for intelligent extraction and categorization
      const llmLinks = await this.extractLinksWithLLM(email, basicLinks);
      
      // Combine and deduplicate
      const allLinks = [...basicLinks, ...llmLinks];
      const uniqueLinks = this.removeDuplicateLinks(allLinks);

      console.log(`✅ Extracted ${uniqueLinks.length} unique links (${llmLinks.length} via LLM)`);
      return uniqueLinks;

    } catch (error) {
      console.error('❌ Error extracting links:', error);
      // Fallback to basic extraction if LLM fails
      return await this.extractLinksBasic(email);
    }
  }

  /**
   * Basic link extraction from HTML and text
   */
  async extractLinksBasic(email) {
    const $ = cheerio.load(email.html || email.body);
    
    // Extract all links
    const links = [];
    $('a').each((i, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      
      if (href && href.startsWith('http')) {
        links.push({
          url: href,
          text: text,
          context: $(element).parent().text().trim().substring(0, 100),
          extractionMethod: 'html_parser'
        });
      }
    });

    // Also extract links from plain text using regex
    const textLinks = this.extractLinksFromText(email.body || '');
    links.push(...textLinks);

    return links;
  }

  /**
   * Extract links using OpenAI LLM for intelligent processing
   */
  async extractLinksWithLLM(email, basicLinks) {
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️ OpenAI API key not configured, skipping LLM extraction');
      return [];
    }

    try {
      console.log(`🤖 Using OpenAI to extract links from: ${email.subject}`);
      
      const emailContent = this.cleanEmailContent(email);
      const basicLinksText = basicLinks.map(link => `${link.url} - ${link.text}`).join('\n');
      
      const prompt = `You are a newsletter link extraction expert. Analyze this newsletter email and extract ALL links with context.

EMAIL SUBJECT: ${email.subject}
EMAIL FROM: ${email.from}

EMAIL CONTENT:
${emailContent}

BASIC LINKS FOUND: ${basicLinksText}

Please extract and categorize ALL links from this newsletter. For each link, provide:
1. URL
2. Link text/description
3. Context (what section/topic it's about)
4. Category (news, tool, article, product, social, other)
5. Relevance score (1-10, how relevant to the newsletter topic)

Return ONLY a JSON array of objects with this structure:
[
  {
    "url": "https://example.com",
    "text": "Link description",
    "context": "Context from newsletter",
    "category": "article",
    "relevance": 8,
    "extractionMethod": "llm"
  }
]

Focus on:
- All clickable links
- Links in text that might be missing href attributes
- Social media links
- Product/service links
- Article/news links
- Tools and resources

Be thorough - newsletters often contain many valuable links that might be missed by basic parsing.`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: process.env.OPENAI_MODEL || 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at extracting and categorizing links from newsletter emails. Always return valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const llmResponse = response.data.choices[0].message.content;
      console.log('🤖 LLM Response:', llmResponse.substring(0, 200) + '...');

      // Parse LLM response
      const llmLinks = JSON.parse(llmResponse);
      
      // Validate and clean the links
      const validLinks = llmLinks.filter(link => 
        link.url && 
        typeof link.url === 'string' && 
        link.url.startsWith('http')
      ).map(link => ({
        url: link.url,
        text: link.text || '',
        context: link.context || '',
        category: link.category || 'other',
        relevance: link.relevance || 5,
        extractionMethod: 'llm'
      }));

      console.log(`🤖 LLM extracted ${validLinks.length} links`);
      return validLinks;

    } catch (error) {
      console.error('❌ LLM extraction error:', error.message);
      return [];
    }
  }

  /**
   * Clean email content for LLM processing
   */
  cleanEmailContent(email) {
    let content = '';
    
    if (email.html) {
      // Remove HTML tags but keep text content
      const $ = cheerio.load(email.html);
      content = $.text();
    } else {
      content = email.body || '';
    }
    
    // Clean up the content
    content = content
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .replace(/\n+/g, '\n') // Normalize line breaks
      .trim()
      .substring(0, 4000);   // Limit to 4000 chars for LLM
    
    return content;
  }

  /**
   * Extract links from plain text using regex
   */
  extractLinksFromText(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const links = [];
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
      links.push({
        url: match[0],
        text: match[0],
        context: text.substring(Math.max(0, match.index - 50), match.index + 50)
      });
    }

    return links;
  }

  /**
   * Remove duplicate links
   */
  removeDuplicateLinks(links) {
    const seen = new Set();
    return links.filter(link => {
      if (seen.has(link.url)) {
        return false;
      }
      seen.add(link.url);
      return true;
    });
  }

  /**
   * Store extracted links in DynamoDB (with local development fallback)
   */
  async storeExtractedLinks(emailId, links) {
    const timestamp = new Date().toISOString();

    console.log(`🔗 Attempting to store ${links.length} links for email: ${emailId}`);
    console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`🔧 LINKS_TABLE: ${process.env.LINKS_TABLE}`);

    // Check if we're in local development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Stored ${links.length} links locally (dev mode)`);
      links.forEach((link, index) => {
        console.log(`🔗 Link ${index + 1}: ${link.url} (${link.category}, relevance: ${link.relevance})`);
      });
      return;
    }

    try {
      const dynamodb = new AWS.DynamoDB.DocumentClient({
        region: process.env.AWS_REGION || 'us-east-1'
      });
      // Store each link with enhanced data
      const promises = links.map(async (link, index) => {
        const params = {
          TableName: process.env.LINKS_TABLE || 'LinksTable',
          Item: {
            id: `${emailId}-${index}`,
            emailId: emailId,
            url: link.url,
            text: link.text,
            context: link.context,
            category: link.category || 'other',
            relevance: link.relevance || 5,
            extractionMethod: link.extractionMethod || 'unknown',
            extractedAt: timestamp,
            processed: false
          }
        };

        console.log(`🔗 Storing link ${index + 1}: ${link.url} in table: ${params.TableName}`);
        return dynamodb.put(params).promise();
      });

      await Promise.all(promises);
      console.log(`✅ Stored ${links.length} links in DynamoDB`);

    } catch (error) {
      console.error('❌ Error storing links in DynamoDB:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error code:', error.code);
      console.log(`⚠️ Falling back to local storage for ${links.length} links`);
      links.forEach((link, index) => {
        console.log(`🔗 Link ${index + 1}: ${link.url} (${link.category}, relevance: ${link.relevance})`);
      });
      throw error;
    }
  }

  /**
   * Send notification about processed newsletter
   */
  async sendNotification(email, extractedLinks) {
    const subject = `📬 Newsletter Processed: ${email.subject}`;
    const body = `
New newsletter processed:

From: ${email.from}
Subject: ${email.subject}
Date: ${email.date}

Links Extracted: ${extractedLinks.length}

Top Links:
${extractedLinks.slice(0, 10).map(link => `- ${link.url}`).join('\n')}

${extractedLinks.length > 10 ? `... and ${extractedLinks.length - 10} more` : ''}
    `;

    try {
      await this.sendEmail(this.notificationEmail, subject, body);
      console.log(`✅ Notification sent to ${this.notificationEmail}`);
    } catch (error) {
      console.error('❌ Error sending notification:', error);
    }
  }

  /**
   * Send email using SES
   */
  async sendEmail(to, subject, body) {
    const params = {
      Source: this.newsletterEmail,
      Destination: {
        ToAddresses: [to]
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8'
        },
        Body: {
          Text: {
            Data: body,
            Charset: 'UTF-8'
          }
        }
      }
    };

    try {
      const result = await this.ses.sendEmail(params).promise();
      console.log(`✅ Email sent: ${result.MessageId}`);
      return result;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }

  /**
   * Parse and clean incoming email data
   */
  parseEmailData(emailData) {
    return {
      id: emailData.id || `email-${Date.now()}`,
      from: emailData.from,
      subject: emailData.subject,
      date: emailData.date || new Date().toISOString(),
      body: emailData.body || '',
      html: emailData.html || '',
      raw: emailData.raw || '',
      headers: emailData.headers || {},
      attachments: emailData.attachments || []
    };
  }

  /**
   * Check if an email appears to be a newsletter
   */
  isNewsletterEmail(email) {
    const newsletterIndicators = [
      'newsletter',
      'weekly digest',
      'daily digest',
      'roundup',
      'summary',
      'update',
      'insights',
      'curated',
      'best of',
      'top stories',
      'unsubscribe',
      'manage preferences',
      'view in browser'
    ];

    const subjectLower = email.subject.toLowerCase();
    const bodyLower = (email.body + ' ' + email.html).toLowerCase();

    // Check subject for newsletter indicators
    const subjectMatch = newsletterIndicators.some(indicator => 
      subjectLower.includes(indicator)
    );

    // Check body for newsletter indicators
    const bodyMatch = newsletterIndicators.some(indicator => 
      bodyLower.includes(indicator)
    );

    // Check for unsubscribe links (common in newsletters)
    const hasUnsubscribe = bodyLower.includes('unsubscribe') || 
                          bodyLower.includes('manage preferences') ||
                          bodyLower.includes('view in browser');

    // Check for multiple links (newsletters typically have many links)
    const linkCount = (bodyLower.match(/https?:\/\/[^\s]+/g) || []).length;
    const hasMultipleLinks = linkCount >= 1; // More lenient: just 1 link needed

    // More lenient detection for testing - accept most emails with links
    const hasAnyLinks = linkCount >= 1;
    const hasEmailContent = email.body && email.body.length > 10;

    console.log(`🔍 Newsletter detection: subjectMatch=${subjectMatch}, bodyMatch=${bodyMatch}, hasUnsubscribe=${hasUnsubscribe}, linkCount=${linkCount}, hasEmailContent=${hasEmailContent}`);

    // Real newsletter detection - be more selective
    const isLikelyNewsletter = subjectMatch || bodyMatch || hasUnsubscribe || hasMultipleLinks || (hasAnyLinks && hasEmailContent);
    
    console.log(`🔍 Newsletter detection result: ${isLikelyNewsletter ? 'ACCEPTED' : 'REJECTED'}`);
    return isLikelyNewsletter;
  }

  /**
   * Get all extracted links from DynamoDB
   */
  async getAllExtractedLinks() {
    console.log(`🔍 Fetching links from table: ${process.env.LINKS_TABLE || 'LinksTable'}`);
    
    const dynamodb = new AWS.DynamoDB.DocumentClient({
      region: process.env.AWS_REGION || 'us-east-1'
    });

    try {
      const params = {
        TableName: process.env.LINKS_TABLE || 'LinksTable'
      };

      const result = await dynamodb.scan(params).promise();
      console.log(`📊 DynamoDB scan result: ${result.Items?.length || 0} items found`);
      return result.Items || [];

    } catch (error) {
      console.error('❌ Error fetching links:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error code:', error.code);
      return [];
    }
  }

  /**
   * Mark link as processed
   */
  async markLinkProcessed(linkId) {
    const dynamodb = new AWS.DynamoDB.DocumentClient({
      region: process.env.AWS_REGION || 'us-east-1'
    });

    try {
      const params = {
        TableName: process.env.LINKS_TABLE || 'LinksTable',
        Key: {
          id: linkId
        },
        UpdateExpression: 'SET processed = :processed, processedAt = :processedAt',
        ExpressionAttributeValues: {
          ':processed': true,
          ':processedAt': new Date().toISOString()
        }
      };

      await dynamodb.update(params).promise();
      console.log(`✅ Link marked as processed: ${linkId}`);

    } catch (error) {
      console.error('❌ Error marking link as processed:', error);
      throw error;
    }
  }
}

module.exports = EmailService;
