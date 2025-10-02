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
    {
      value: "playwright" as const,
      label: "Playwright",
      description: "Fast, reliable browser automation",
      icon: "🎭"
    },
    {
      value: "skyvern" as const,
      label: "Skyvern",
      description: "AI-powered web automation",
      icon: "☁️"
    },
    {
      value: "browserbase" as const,
      label: "Browserbase",
      description: "Cloud browser infrastructure",
      icon: "🌐"
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* URL Input */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Newsletter URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/newsletter-signup"
          className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
          required
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter the URL of any website with a newsletter sign-up form
        </p>
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your-email@example.com"
          className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
          required
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          We'll use this email to sign up and receive newsletters
        </p>
      </div>

      {/* Framework Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Automation Framework
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {frameworkOptions.map((option) => (
            <label
              key={option.value}
              className={`relative flex flex-col p-5 border rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                framework === option.value
                  ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-lg"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md"
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
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-lg">{option.icon}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white text-base">
                  {option.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {option.description}
              </p>
              {framework === option.value && (
                <div className="absolute top-3 right-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                </div>
              )}
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Choose the automation framework to use for newsletter sign-up
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !url || !email}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-lg"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg">Signing up...</span>
          </div>
        ) : (
          <span className="text-lg">Sign Up for Newsletter</span>
        )}
      </button>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-bold text-blue-900 dark:text-blue-100 mb-2">
              How it works
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Our automation will visit the URL and find the newsletter form</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>We'll automatically fill out and submit the form</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Incoming newsletters will be processed to extract all links</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>You can view and manage all extracted links here</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}
