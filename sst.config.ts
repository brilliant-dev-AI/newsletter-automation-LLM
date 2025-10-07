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
        extractedAt: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        emailIdIndex: { hashKey: "emailId", rangeKey: "extractedAt" },
        categoryIndex: { hashKey: "category", rangeKey: "extractedAt" },
        urlIndex: { hashKey: "url" },
      },
    });

    const web = new sst.aws.Nextjs("MyWeb", {
      environment: {
        // Lambda-optimized Playwright handles browser binaries automatically
        NODE_ENV: "production",

        // Skyvern AI API Configuration
        SKYVERN_API_KEY: process.env.SKYVERN_API_KEY || "",
        SKYVERN_API_URL:
          process.env.SKYVERN_API_URL || "https://api.skyvern.com/v1",
        SKYVERN_TIMEOUT: process.env.SKYVERN_TIMEOUT || "30000",

        // Browserbase MCP Configuration
        BROWSERBASE_API_KEY: process.env.BROWSERBASE_API_KEY || "",
        BROWSERBASE_PROJECT_ID: process.env.BROWSERBASE_PROJECT_ID || "",
        BROWSERBASE_API_URL:
          process.env.BROWSERBASE_API_URL ||
          "https://www.browserbase.com/api/v1",

        // OpenAI Configuration (for future LLM link extraction)
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
        OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4",

        // n8n Integration (bonus feature - Google Sheets export)
        N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || "",

        // Email Configuration (not used - we use Zapier for email forwarding)
        EMAIL_BUCKET: emailBucket.name,
        LINKS_TABLE: linksTable.name,
      },
      server: {
        timeout: "300 seconds", // Increased to handle Skyvern tasks that can take up to 5 minutes
        memory: "1024 MB", // Increased memory for better performance
      },
      permissions: [
        {
          actions: ["dynamodb:*"],
          resources: [
            "arn:aws:dynamodb:*:*:table/*",
            "arn:aws:dynamodb:*:*:table/*/*",
          ],
        },
        {
          actions: ["s3:*"],
          resources: ["arn:aws:s3:::*", "arn:aws:s3:::*/*"],
        },
      ],
    });

    return {
      web: web.url,
    };
  },
});
