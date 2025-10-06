// Unified error message system for all frameworks
export function getUnifiedErrorMessage(error, framework) {
  const errorString = error.message || error.toString();
  
  // Common error patterns
  if (errorString.includes("timeout") || errorString.includes("ECONNABORTED")) {
    return `${framework} encountered an error: Automation timed out - website may have anti-bot protection`;
  }
  
  if (errorString.includes("cloudflare") || errorString.includes("bot detection") || errorString.includes("anti-bot")) {
    return `${framework} encountered an error: Anti-bot protection detected - Cloudflare or similar protection`;
  }
  
  if (errorString.includes("403") || errorString.includes("Forbidden")) {
    return `${framework} encountered an error: Access forbidden - website may have anti-bot protection`;
  }
  
  if (errorString.includes("429") || errorString.includes("Too Many Requests")) {
    return `${framework} encountered an error: Rate limited - too many requests to this website`;
  }
  
  if (errorString.includes("captcha") || errorString.includes("CAPTCHA")) {
    return `${framework} encountered an error: CAPTCHA detected - website requires human verification`;
  }
  
  if (errorString.includes("404") || errorString.includes("Not Found")) {
    return `${framework} encountered an error: Page not found - check the URL`;
  }
  
  if (errorString.includes("500") || errorString.includes("Internal Server Error")) {
    return `${framework} encountered an error: Server error - website may be temporarily down`;
  }
  
  // Framework-specific errors
  if (framework === "playwright") {
    if (errorString.includes("No email input field found")) {
      return `${framework} encountered an error: No newsletter signup form found on this page`;
    }
    if (errorString.includes("No submit button found")) {
      return `${framework} encountered an error: Found email field but no submit button`;
    }
    if (errorString.includes("Browser not available")) {
      return `${framework} encountered an error: Browser automation not available`;
    }
    if (errorString.includes("not clickable") || errorString.includes("not an Element")) {
      return `${framework} encountered an error: Anti-bot protection detected - Cloudflare or similar protection`;
    }
  }
  
  if (framework === "skyvern") {
    if (errorString.includes("authentication failed") || errorString.includes("403")) {
      return `${framework} encountered an error: Skyvern AI service authentication failed`;
    }
    if (errorString.includes("endpoint not found") || errorString.includes("404")) {
      return `${framework} encountered an error: Skyvern AI service endpoint not found`;
    }
  }
  
  if (framework === "browserbase") {
    if (errorString.includes("authentication failed") || errorString.includes("403")) {
      return `${framework} encountered an error: Browserbase cloud service authentication failed`;
    }
    if (errorString.includes("endpoint not found") || errorString.includes("404")) {
      return `${framework} encountered an error: Browserbase cloud service endpoint not found`;
    }
  }
  
  // Default error message
  return `${framework} encountered an error: Automation failed - please try again or use a different framework`;
}

// Helper function to get processing time
export function getProcessingTime(startTime) {
  return `${((Date.now() - startTime) / 1000).toFixed(1)}s`;
}
