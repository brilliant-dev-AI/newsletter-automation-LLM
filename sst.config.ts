/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "divizend-newsletter",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    // Email storage bucket
    const emailBucket = new sst.aws.Bucket("EmailBucket");

    // Links storage table
    const linksTable = new sst.aws.Dynamo("LinksTable", {
      fields: {
        id: "string",
        emailId: "string",
        url: "string",
        category: "string",
        extractedAt: "string"
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        emailIdIndex: { hashKey: "emailId", rangeKey: "extractedAt" },
        categoryIndex: { hashKey: "category", rangeKey: "extractedAt" },
        urlIndex: { hashKey: "url" }
      },
    });

    const web = new sst.aws.Nextjs("MyWeb", {
      environment: {
        // Lambda-optimized Playwright handles browser binaries automatically
        NODE_ENV: "production",
        
        // Skyvern AI API Configuration
        SKYVERN_API_KEY: process.env.SKYVERN_API_KEY || "",
        SKYVERN_API_URL: process.env.SKYVERN_API_URL || "https://api.skyvern.com/v1",
        SKYVERN_TIMEOUT: process.env.SKYVERN_TIMEOUT || "30000",
        
        // Browserbase MCP Configuration
        BROWSERBASE_API_KEY: process.env.BROWSERBASE_API_KEY || "",
        BROWSERBASE_PROJECT_ID: process.env.BROWSERBASE_PROJECT_ID || "",
        BROWSERBASE_API_URL: process.env.BROWSERBASE_API_URL || "https://www.browserbase.com/api/v1",
        
        // OpenAI Configuration (for future LLM link extraction)
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
        OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4",
        
        // Email Configuration
        NEWSLETTER_EMAIL: process.env.NEWSLETTER_EMAIL || "newsletter@divizend.com",
        NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL || "admin@divizend.com",
        EMAIL_BUCKET: emailBucket.name,
        LINKS_TABLE: linksTable.name
      },
      server: {
        timeout: "60 seconds", // Increased from default 30s to handle complex sites
        memory: "1024 MB" // Increased memory for better performance
      },
      permissions: [
        {
          actions: ["dynamodb:*"],
          resources: [linksTable.arn, `${linksTable.arn}/*`]
        },
        {
          actions: ["s3:*"],
          resources: [emailBucket.arn, `${emailBucket.arn}/*`]
        }
      ]
    });


    return {
      web: web.url
    };
  },
});
