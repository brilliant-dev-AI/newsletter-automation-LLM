"use client";

import { useState } from "react";
import { NewsletterCard } from "../components/NewsletterCard";
import { NewsletterForm } from "../components/NewsletterForm";
import { LinksDisplay } from "../components/LinksDisplay";

interface Newsletter {
  id: string;
  url: string;
  status: "pending" | "processing" | "completed" | "error";
  email: string;
  linksCount: number;
  lastProcessed: string | null;
  framework: "playwright" | "skyvern" | "browserbase";
  errorMessage?: string;
}

export default function Home() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([
    // Demo data removed - start with empty state to show real functionality
  ]);

  const handleRetry = async (newsletter: Newsletter) => {
    console.log("Retrying newsletter automation:", newsletter);
    
    // Update status to processing
    setNewsletters(prev => prev.map(n => 
      n.id === newsletter.id 
        ? { ...n, status: "processing" as const, errorMessage: undefined }
        : n
    ));

    try {
      // Call our automation API
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? '/api/automate' 
        : 'https://d35d9snn4nkype.cloudfront.net/api/automate';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: newsletter.url, 
          email: newsletter.email, 
          framework: newsletter.framework 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.result.success) {
        // Update the newsletter status to completed
        setNewsletters(prev => prev.map(n => 
          n.id === newsletter.id 
            ? { 
                ...n, 
                status: "completed" as const,
                linksCount: 1,
                lastProcessed: new Date().toISOString()
              }
            : n
        ));
        
        console.log("✅ Retry completed successfully:", data.result);
      } else {
        // Update status to error if automation failed
        setNewsletters(prev => prev.map(n => 
          n.id === newsletter.id 
            ? { 
                ...n, 
                status: "error" as const,
                errorMessage: data.result?.error || data.error || "Automation failed"
              }
            : n
        ));
        
        console.error("❌ Retry failed:", data.result?.error || data.error);
      }
    } catch (error) {
      // Update status to error
      setNewsletters(prev => prev.map(n => 
        n.id === newsletter.id 
          ? { ...n, status: "error" as const, errorMessage: "Network error" }
          : n
      ));
      
      console.error("❌ Retry API call failed:", error);
    }
  };

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
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? '/api/automate' 
        : 'https://d35d9snn4nkype.cloudfront.net/api/automate';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, email, framework }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.result.success) {
        // Update the newsletter status to completed only if automation actually succeeded
        setNewsletters(prev => prev.map(n => 
          n.id === newNewsletter.id 
            ? { 
                ...n, 
                status: "completed" as const,
                linksCount: 1,
                lastProcessed: new Date().toISOString()
              }
            : n
        ));
        
        console.log("✅ Automation completed successfully:", data.result);
      } else {
        // Update status to error if automation failed
        setNewsletters(prev => prev.map(n => 
          n.id === newNewsletter.id 
            ? { 
                ...n, 
                status: "error" as const,
                errorMessage: data.result?.error || data.error || "Automation failed"
              }
            : n
        ));
        
        console.error("❌ Automation failed:", data.result?.error || data.error);
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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter Processing System</h1>
              <p className="text-gray-600 font-medium">Automated newsletter subscription and link extraction</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-green-800 font-semibold">System Online</span>
              </div>
              <div className="text-xs bg-gray-800 text-white px-3 py-2 rounded-lg font-semibold">
                v2.1.0
              </div>
            </div>
          </div>
        </div>

        {/* Top Section: Input and Processing Status */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Add Newsletter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 h-fit">
            <h2 className="text-xl font-bold mb-6 text-gray-900 border-b-2 border-gray-300 pb-3">
              Newsletter Configuration
            </h2>
            <NewsletterForm onSubmit={handleSubmit} />
          </div>

          {/* Right: Processing Status Stack */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 h-fit">
            <h2 className="text-xl font-bold mb-6 text-gray-900 border-b-2 border-gray-300 pb-3">
              Processing Monitor
            </h2>
            {newsletters.length > 0 ? (
              <div className="max-h-96 overflow-y-auto space-y-3">
                {newsletters.slice().reverse().map((newsletter) => (
                  <div key={newsletter.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border border-gray-300">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate text-gray-900">{newsletter.url}</p>
                        <p className="text-xs text-gray-600 truncate font-medium">{newsletter.email}</p>
                        {newsletter.status === 'error' && newsletter.errorMessage && (
                          <p className="text-xs text-red-700 mt-1 truncate font-medium">
                            {newsletter.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        newsletter.status === 'completed' ? 'bg-green-100 text-green-800' :
                        newsletter.status === 'error' ? 'bg-red-100 text-red-800' :
                        newsletter.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {newsletter.status}
                      </span>
                      {newsletter.status === 'error' && (
                        <button 
                          onClick={() => handleRetry(newsletter)}
                          className="flex items-center space-x-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Retry</span>
                        </button>
                      )}
                      {newsletter.status === 'processing' && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No automation running</h3>
                <p className="text-gray-500 text-sm">Add a newsletter to see processing status</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Extracted Links - Full Width */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900 border-b-2 border-gray-300 pb-3">
            Extracted Links
          </h2>
          <LinksDisplay />
        </div>
      </div>
    </div>
  );
}
