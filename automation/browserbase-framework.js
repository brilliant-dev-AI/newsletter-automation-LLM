// Browserbase Framework Implementation
const axios = require("axios");
require("dotenv").config();

class BrowserbaseFramework {
  constructor() {
    this.apiKey = process.env.BROWSERBASE_API_KEY;
    this.projectId = process.env.BROWSERBASE_PROJECT_ID;
    this.apiUrl = process.env.BROWSERBASE_API_URL;
  }

  async init() {
    console.log("🌐 Initializing Browserbase Framework...");
    
    if (!this.apiKey) {
      throw new Error("BROWSERBASE_API_KEY not configured");
    }
    
    if (!this.projectId) {
      throw new Error("BROWSERBASE_PROJECT_ID not configured");
    }
    
    if (!this.apiUrl) {
      throw new Error("BROWSERBASE_API_URL not configured");
    }

    console.log("✅ Browserbase Framework initialized");
  }

  async runAutomation(url, email) {
    console.log("🌐 Running Browserbase cloud automation...");

    let sessionId = null;

    try {
      const startTime = Date.now();

      // Create a new session
      console.log("☁️ Creating Browserbase session...");
      const sessionResponse = await axios.post(
        `${this.apiUrl}/sessions`,
        {
          projectId: this.projectId,
        },
        {
          headers: {
            "X-BB-API-Key": this.apiKey,
            "Content-Type": "application/json",
          },
        },
      );

      sessionId = sessionResponse.data.id;
      console.log(`☁️ Created Browserbase session: ${sessionId}`);

      // Navigate to the URL
      console.log(`🌐 Navigating to: ${url}`);
      await axios.post(
        `${this.apiUrl}/sessions/${sessionId}/navigate`,
        { url: url },
        {
          headers: {
            "X-BB-API-Key": this.apiKey,
            "Content-Type": "application/json",
          },
        },
      );

      // Wait for page to load
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Find and fill email field using AI
      console.log("🤖 Finding email field with AI...");
      const emailResponse = await axios.post(
        `${this.apiUrl}/sessions/${sessionId}/ai/find-and-fill`,
        {
          description: "Find email input field for newsletter signup",
          value: email,
          elementType: "input",
        },
        {
          headers: {
            "X-BB-API-Key": this.apiKey,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("✅ Email field found and filled");

      // Wait a moment before finding submit button
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find and click submit button using AI
      console.log("🤖 Finding submit button with AI...");
      const submitResponse = await axios.post(
        `${this.apiUrl}/sessions/${sessionId}/ai/find-and-click`,
        {
          description: "Find submit or subscribe button for newsletter signup",
        },
        {
          headers: {
            "X-BB-API-Key": this.apiKey,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("✅ Submit button found and clicked");

      // Wait for potential success message
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Close the session
      console.log("🔒 Closing Browserbase session...");
      await axios.delete(
        `${this.apiUrl}/sessions/${sessionId}`,
        {
          headers: {
            "X-BB-API-Key": this.apiKey,
          },
        },
      );

      const processingTime = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;

      console.log(`✅ Browserbase automation completed in ${processingTime}`);

      return {
        success: true,
        message: "Newsletter form submitted successfully",
        framework: "browserbase",
        processingTime: processingTime,
        cloudInstances: 1,
        mcpProtocol: "v1.0",
        sessionId: sessionId,
        aiSteps: 2, // email fill + submit click
        cloudFeatures: true,
      };
    } catch (error) {
      console.error(`❌ Browserbase API error: ${error.message}`);
      
      // Clean up session if it was created
      if (sessionId) {
        try {
          await axios.delete(
            `${this.apiUrl}/sessions/${sessionId}`,
            {
              headers: {
                "X-BB-API-Key": this.apiKey,
              },
            },
          );
          console.log(`🧹 Cleaned up session: ${sessionId}`);
        } catch (cleanupError) {
          console.error(`⚠️ Failed to cleanup session: ${cleanupError.message}`);
        }
      }

      const { getUnifiedErrorMessage } = require("../lib/error-messages.js");

      return {
        success: false,
        error: getUnifiedErrorMessage(error, "browserbase"),
        framework: "browserbase",
        processingTime: "3s",
        cloudInstances: 1,
        mcpProtocol: "v1.0",
        apiError: true,
        sessionId: sessionId || "failed",
        technicalDetails: error.message,
      };
    }
  }

  async cleanup() {
    console.log("✅ Browserbase Framework cleanup completed");
  }

  // Helper method to get success rate prediction
  getSuccessRate(url) {
    // Simulate different success rates for cloud automation
    if (url.includes("producthunt")) return 0.9;
    if (url.includes("axios")) return 0.75;
    if (url.includes("techcrunch")) return 0.7;
    return 0.8;
  }

  // Helper method to validate API configuration
  async validateConfiguration() {
    try {
      const response = await axios.get(`${this.apiUrl}/projects/${this.projectId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        timeout: 5000,
      });
      
      return {
        valid: true,
        status: response.status,
        message: "Browserbase API is accessible",
        projectId: this.projectId,
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        message: "Browserbase API is not accessible",
        projectId: this.projectId,
      };
    }
  }

  // Helper method to list active sessions
  async listActiveSessions() {
    try {
      const response = await axios.get(
        `${this.apiUrl}/sessions?projectId=${this.projectId}`,
        {
          headers: {
            "X-BB-API-Key": this.apiKey,
          },
        },
      );
      
      return response.data;
    } catch (error) {
      console.error("Failed to list active sessions:", error.message);
      return [];
    }
  }
}

module.exports = BrowserbaseFramework;
