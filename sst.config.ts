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
      }
    });

    return {
      web: web.url
    };
  },
});
