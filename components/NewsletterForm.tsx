"use client";

import { useState } from "react";

interface NewsletterFormProps {
  onSubmit: (url: string, email: string, framework: "playwright" | "skyvern" | "browserbase") => void;
}

export function NewsletterForm({ onSubmit }: NewsletterFormProps) {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [framework, setFramework] = useState<"playwright" | "skyvern" | "browserbase">("playwright");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !email) return;

    setIsSubmitting(true);
    try {
      await onSubmit(url, email, framework);
      setUrl("");
      setEmail("");
    } catch (error) {
      console.error("Failed to submit newsletter:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const frameworkOptions = [
    { value: "playwright" as const, label: "Playwright" },
    { value: "skyvern" as const, label: "Skyvern" },
    { value: "browserbase" as const, label: "Browserbase" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* URL Input */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-900 mb-2">
          Website URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-0 focus:border-teal-600 transition-colors text-gray-900 placeholder-gray-500 bg-white"
          required
        />
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-0 focus:border-teal-600 transition-colors text-gray-900 placeholder-gray-500 bg-white"
          required
        />
      </div>

      {/* Framework Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Automation Engine
        </label>
        <div className="grid grid-cols-3 gap-2">
          {frameworkOptions.map((option) => (
            <label
              key={option.value}
              className={`relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                framework === option.value
                  ? "border-teal-600 bg-teal-50 text-teal-900"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="framework"
                value={option.value}
                checked={framework === option.value}
                onChange={(e) => setFramework(e.target.value as typeof framework)}
                className="sr-only"
              />
              <span className="text-sm font-medium">{option.label}</span>
              {framework === option.value && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                </div>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !url || !email}
        className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          "Start Automation"
        )}
      </button>
    </form>
  );
}
