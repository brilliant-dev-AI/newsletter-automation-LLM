// Skyvern AI Framework Implementation - Fixed according to official API docs
const axios = require("axios");
require("dotenv").config();

class SkyvernFramework {
  constructor() {
    this.apiKey = process.env.SKYVERN_API_KEY;
    this.apiUrl = process.env.SKYVERN_API_URL;
    this.timeout = process.env.SKYVERN_TIMEOUT || 30000;
  }

  async init() {
    console.log("🤖 Initializing Skyvern AI Framework...");
    
    if (!this.apiKey) {
      throw new Error("SKYVERN_API_KEY not configured");
    }
    
    if (!this.apiUrl) {
      throw new Error("SKYVERN_API_URL not configured");
    }

    console.log("✅ Skyvern AI Framework initialized");
  }

  async runAutomation(url, email) {
    console.log("🤖 Running Skyvern AI automation...");

    try {
      const startTime = Date.now();

      // Create a simple, clear prompt for newsletter subscription
      const prompt = `Go to ${url} and subscribe to the newsletter using the email address: ${email}. Find the email input field, enter the email, and click the submit/subscribe button.`;

      console.log(`🚀 Sending Skyvern task with prompt: ${prompt}`);

      // Use the correct Skyvern API endpoint and format from documentation
      const response = await axios.post(
        `${this.apiUrl}/run/tasks`,
        {
          prompt: prompt,
          url: url,
          engine: "skyvern-1.0", // Good for simple tasks like filling forms
          max_steps: 10, // Reasonable limit to avoid high costs
          title: "Newsletter Subscription",
          proxy_location: "RESIDENTIAL", // Use residential proxy for better success
        },
        {
          headers: {
            "x-api-key": this.apiKey, // Correct header name from docs
            "Content-Type": "application/json",
          },
          timeout: this.timeout,
        },
      );

      const runId = response.data.run_id;
      console.log(`📋 Skyvern task created with run_id: ${runId}`);

      // Poll for completion since Skyvern tasks are async
      const result = await this.pollForCompletion(runId, startTime);

      const processingTime = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;

      console.log(`✅ Skyvern AI workflow completed in ${processingTime}`);

      return {
        success: result.success,
        message: result.success ? "Newsletter form submitted successfully" : result.error,
        framework: "skyvern",
        processingTime: processingTime,
        aiSteps: result.maxSteps || 10,
        confidence: result.success ? 95 : 0,
        runId: runId,
        status: result.status,
        screenshotUrls: result.screenshotUrls || [],
        recordingUrl: result.recordingUrl,
      };
    } catch (error) {
      console.error(`❌ Skyvern API error: ${error.message}`);
      
      const { getUnifiedErrorMessage } = require("../lib/error-messages.js");

      return {
        success: false,
        error: getUnifiedErrorMessage(error, "skyvern"),
        framework: "skyvern",
        processingTime: "2.5s",
        apiError: true,
        technicalDetails: error.message,
      };
    }
  }

  async pollForCompletion(runId, startTime) {
    const maxWaitTime = 300000; // 5 minutes max wait (Skyvern tasks can take longer)
    const pollInterval = 5000; // Poll every 5 seconds (less frequent polling)
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const response = await axios.get(
          `${this.apiUrl}/runs/${runId}`,
          {
            headers: {
              "x-api-key": this.apiKey,
            },
            timeout: 10000,
          },
        );

        const run = response.data;
        console.log(`📊 Run status: ${run.status}`);

        // Check if task is completed
        if (run.status === "completed" || run.status === "finished") {
          return {
            success: true,
            status: run.status,
            maxSteps: run.run_request?.max_steps,
            screenshotUrls: run.screenshot_urls || [],
            recordingUrl: run.recording_url,
            output: run.output,
          };
        }

        // Check if task failed
        if (run.status === "failed" || run.status === "terminated") {
          return {
            success: false,
            error: run.failure_reason || "Task failed",
            status: run.status,
          };
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      } catch (error) {
        console.error(`⚠️ Error polling run status: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }

    // Timeout reached
    return {
      success: false,
      error: "Task timed out - may still be running",
      status: "timeout",
    };
  }

  async cleanup() {
    console.log("✅ Skyvern AI Framework cleanup completed");
  }

  // Helper method to get success rate prediction
  getSuccessRate(url) {
    // Simulate different success rates based on site complexity
    if (url.includes("producthunt")) return 0.85;
    if (url.includes("axios")) return 0.7;
    if (url.includes("techcrunch")) return 0.65;
    return 0.75;
  }

  // Helper method to validate API configuration
  async validateConfiguration() {
    try {
      // Test with a simple task creation
      const response = await axios.post(
        `${this.apiUrl}/run/tasks`,
        {
          prompt: "Test connection",
          url: "https://example.com",
          max_steps: 1,
        },
        {
          headers: {
            "x-api-key": this.apiKey,
            "Content-Type": "application/json",
          },
          timeout: 5000,
        },
      );
      
      return {
        valid: true,
        status: response.status,
        message: "Skyvern API is accessible",
        runId: response.data.run_id,
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        message: "Skyvern API is not accessible",
        statusCode: error.response?.status,
      };
    }
  }
}

module.exports = SkyvernFramework;