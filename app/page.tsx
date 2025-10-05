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
      const response = await fetch('/api/automate', {
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
      const response = await fetch('/api/automate', {
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-2xl font-bold text-teal-600">DIVIZEND</div>
                <div className="w-px h-6 bg-gray-300"></div>
                <h1 className="text-3xl font-bold text-gray-900">Newsletter Automation</h1>
              </div>
              <p className="text-gray-600 text-base">Intelligent newsletter subscription and content extraction</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 bg-teal-50 px-3 py-2 rounded-lg border border-teal-200">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-teal-700 font-medium">System Active</span>
              </div>
              <div className="text-xs bg-gray-800 text-white px-3 py-2 rounded-lg font-medium">
                v2.1.0
              </div>
            </div>
          </div>
        </div>

        {/* Top Section: Input and Processing Status */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Left: Add Newsletter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Add Newsletter</h2>
              <div className="w-12 h-0.5 bg-teal-600"></div>
            </div>
            <NewsletterForm onSubmit={handleSubmit} />
          </div>

          {/* Right: Processing Status Stack */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Status</h2>
              <div className="w-12 h-0.5 bg-teal-600"></div>
            </div>
            {newsletters.length > 0 ? (
              <div className="max-h-96 overflow-y-auto space-y-3">
                {newsletters.slice().reverse().map((newsletter) => (
                  <div key={newsletter.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        newsletter.status === 'completed' ? 'bg-teal-100' :
                        newsletter.status === 'error' ? 'bg-red-100' :
                        newsletter.status === 'processing' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        {newsletter.status === 'completed' ? (
                          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : newsletter.status === 'error' ? (
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : newsletter.status === 'processing' ? (
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate text-gray-900">{newsletter.url}</p>
                        <p className="text-xs text-gray-600 truncate">{newsletter.email}</p>
                        {newsletter.status === 'error' && newsletter.errorMessage && (
                          <p className="text-xs text-red-600 mt-1 truncate">
                            {newsletter.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        newsletter.status === 'completed' ? 'bg-teal-100 text-teal-700' :
                        newsletter.status === 'error' ? 'bg-red-100 text-red-700' :
                        newsletter.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {newsletter.status}
                      </span>
                      {newsletter.status === 'error' && (
                        <button 
                          onClick={() => handleRetry(newsletter)}
                          className="flex items-center space-x-1 px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Retry</span>
                        </button>
                      )}
                      {newsletter.status === 'processing' && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white text-xs rounded-md">
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
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Extracted Links</h2>
            <div className="w-12 h-0.5 bg-teal-600"></div>
          </div>
          <LinksDisplay />
        </div>
      </div>
    </div>
  );
}
