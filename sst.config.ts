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
        // Browser automation config for all frameworks (Playwright, Skyvern, Browserbase)
        PLAYWRIGHT_BROWSERS_PATH: "/tmp/playwright-browsers"
      }
    });

    return {
      web: web.url
    };
  },
});
