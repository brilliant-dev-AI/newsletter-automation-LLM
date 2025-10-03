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
        // Lambda-optimized Playwright handles browser binaries automatically
        NODE_ENV: "production"
      },
      server: {
        timeout: "60 seconds", // Increased from default 30s to handle complex sites
        memory: "1024 MB" // Increased memory for better performance
      }
    });

    return {
      web: web.url
    };
  },
});
