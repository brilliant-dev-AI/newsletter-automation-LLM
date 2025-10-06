// Unified error message system for all frameworks
export function getUnifiedErrorMessage(error, framework) {
  const errorString = error.message || error.toString();

  // Only 4 unified error messages for all frameworks
  
  // 1. No newsletter form found
  if (errorString.includes("No email input field found") || 
      errorString.includes("No newsletter signup form found") ||
      errorString.includes("No form found")) {
    return "No newsletter signup form found on this site";
  }

  // 2. Email field found but no submit button
  if (errorString.includes("No submit button found") || 
      errorString.includes("Found email field but no submit button") ||
      errorString.includes("no submit button")) {
    return "Found email field but no submit button";
  }

  // 3. Timeout/anti-bot protection
  if (errorString.includes("timeout") || 
      errorString.includes("ECONNABORTED") ||
      errorString.includes("cloudflare") || 
      errorString.includes("bot detection") || 
      errorString.includes("anti-bot") ||
      errorString.includes("not clickable") || 
      errorString.includes("not an Element")) {
    return "Automation timed out - website may have anti-bot protection";
  }

  // 4. Access forbidden/403 errors
  if (errorString.includes("403") || 
      errorString.includes("Forbidden") ||
      errorString.includes("authentication failed") ||
      errorString.includes("endpoint not found") ||
      errorString.includes("404") ||
      errorString.includes("500") ||
      errorString.includes("Internal Server Error") ||
      errorString.includes("network") ||
      errorString.includes("ECONNREFUSED")) {
    return "Access forbidden - website may have anti-bot protection";
  }

  // Default fallback
  return "Automation timed out - website may have anti-bot protection";
}

// Helper function to get processing time
export function getProcessingTime(startTime) {
  return `${((Date.now() - startTime) / 1000).toFixed(1)}s`;
}
