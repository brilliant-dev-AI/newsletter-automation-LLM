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
    const web = new sst.aws.Nextjs("MyWeb", {
      environment: {
        // Playwright configuration for Lambda
        PLAYWRIGHT_BROWSERS_PATH: "/tmp/playwright-browsers"
      },
      // Add Playwright layer for browser binaries
      layers: [
        "arn:aws:lambda:us-east-1:764866452798:layer:chrome-aws-lambda:31"
      ]
    });

    return {
      web: web.url
    };
  },
});
