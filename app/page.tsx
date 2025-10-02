"use client";

import { useState } from "react";
import { NewsletterCard } from "../components/NewsletterCard";
import { NewsletterForm } from "../components/NewsletterForm";

interface Newsletter {
  id: string;
  url: string;
  status: "pending" | "processing" | "completed" | "error";
  email: string;
  linksCount: number;
  lastProcessed: string | null;
  framework: "playwright" | "skyvern" | "browserbase";
}

export default function Home() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([
    {
      id: "1",
      url: "https://www.producthunt.com/newsletter",
      status: "completed" as const,
      email: "demo@example.com",
      linksCount: 0, // No links extracted yet - email processing not implemented
      lastProcessed: "2024-01-15T10:30:00Z",
      framework: "playwright" as const
    },
    {
      id: "2", 
      url: "https://www.axios.com/newsletters",
      status: "completed" as const,
      email: "demo@example.com",
      linksCount: 0, // No links extracted yet - email processing not implemented
      lastProcessed: "2024-01-14T15:45:00Z",
      framework: "skyvern" as const
    },
    {
      id: "3",
      url: "https://www.techcrunch.com/newsletters/",
      status: "completed" as const,
      email: "demo@example.com",
      linksCount: 0, // No links extracted yet - email processing not implemented
      lastProcessed: "2024-01-13T09:20:00Z",
      framework: "browserbase" as const
    }
  ]);

  const handleSubmit = async (url: string, email: string, framework: "playwright" | "skyvern" | "browserbase") => {
    console.log("Submitting newsletter signup:", { url, email, framework });
    
    // Add to local state immediately
    const newNewsletter: Newsletter = {
      id: Date.now().toString(),
      url,
      status: "pending",
      email,
      linksCount: 0,
      lastProcessed: null,
      framework
    };
    
    setNewsletters(prev => [newNewsletter, ...prev]);

    // Update status to processing
    setNewsletters(prev => prev.map(n => 
      n.id === newNewsletter.id 
        ? { ...n, status: "processing" as const }
        : n
    ));

    try {
      // Call our automation API
      const response = await fetch('/api/automate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, email, framework }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the newsletter status to completed
        setNewsletters(prev => prev.map(n => 
          n.id === newNewsletter.id 
            ? { 
                ...n, 
                status: "completed" as const,
                linksCount: data.result.success ? 1 : 0,
                lastProcessed: new Date().toISOString()
              }
            : n
        ));
        
        console.log("✅ Automation completed:", data.result);
      } else {
        // Update status to error
        setNewsletters(prev => prev.map(n => 
          n.id === newNewsletter.id 
            ? { ...n, status: "error" as const }
            : n
        ));
        
        console.error("❌ Automation failed:", data.error);
      }
    } catch (error) {
      // Update status to error
      setNewsletters(prev => prev.map(n => 
        n.id === newNewsletter.id 
          ? { ...n, status: "error" as const }
          : n
      ));
      
      console.error("❌ API call failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-6">
            Newsletter Parser
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Automatically sign up for newsletters and extract all links from incoming emails using 
            <span className="font-semibold text-blue-600 dark:text-blue-400"> AI-powered automation</span>
          </p>
          <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Real-time processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Multiple frameworks</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>AI-powered extraction</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Sign Up Form */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 md:p-10 mb-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Add New Newsletter
              </h2>
            </div>
            <NewsletterForm onSubmit={handleSubmit} />
          </div>

          {/* Newsletter List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Your Newsletters
                </h2>
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-semibold">
                  {newsletters.length} active
                </div>
              </div>
              {newsletters.length > 0 && (
                <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                  View all →
                </button>
              )}
            </div>
            
            {newsletters.length === 0 ? (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 p-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  No newsletters yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
                  Get started by adding your first newsletter URL above. We'll automatically sign you up and extract all the valuable links.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {newsletters.map((newsletter, index) => (
                  <div 
                    key={newsletter.id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <NewsletterCard newsletter={newsletter} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
            <p className="text-gray-600 dark:text-gray-400">
              Built with <span className="font-semibold text-blue-600 dark:text-blue-400">SST</span>, 
              <span className="font-semibold text-gray-600 dark:text-gray-300"> Next.js</span>, and 
              <span className="font-semibold text-purple-600 dark:text-purple-400"> AI automation</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
