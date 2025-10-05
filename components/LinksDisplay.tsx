'use client';

import { useState, useEffect } from 'react';
import { MOCK_LINKS, type Link } from '../lib/mock-data';

interface LinksDisplayProps {
  className?: string;
}

export function LinksDisplay({ className = '' }: LinksDisplayProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingLinks, setProcessingLinks] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      
      // Use mock data for local development
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          setLinks(MOCK_LINKS);
          setLoading(false);
        }, 1000); // Simulate loading delay
        return;
      }

      // Production: fetch real data
      const response = await fetch('/api/links');
      const data = await response.json();

      if (data.success) {
        setLinks(data.links);
      } else {
        setError(data.error || 'Failed to fetch links');
      }
    } catch (err) {
      setError('Network error while fetching links');
    } finally {
      if (process.env.NODE_ENV !== 'development') {
        setLoading(false);
      }
    }
  };

  const markAsProcessed = async (linkId: string) => {
    // Add to processing set
    setProcessingLinks(prev => new Set(prev).add(linkId));
    
    try {
      // For mock data in development, just update locally
      if (process.env.NODE_ENV === 'development') {
        setLinks(prev => prev.map(link => 
          link.id === linkId ? { ...link, processed: true } : link
        ));
        setProcessingLinks(prev => {
          const newSet = new Set(prev);
          newSet.delete(linkId);
          return newSet;
        });
        return;
      }

      // Production: make API call
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the link in the local state
        setLinks(prevLinks =>
          prevLinks.map(link =>
            link.id === linkId ? { ...link, processed: true } : link
          )
        );
        console.log('✅ Link marked as processed:', linkId);
      } else {
        console.error('❌ Failed to mark link as processed:', data.error || 'Unknown error');
        setError(data.error || 'Failed to mark link as processed');
      }
    } catch (err) {
      console.error('❌ Error marking link as processed:', err);
      setError('Network error while marking link as processed');
    } finally {
      // Remove from processing set
      setProcessingLinks(prev => {
        const newSet = new Set(prev);
        newSet.delete(linkId);
        return newSet;
      });
    }
  };

  // Remove skeleton loading - show content immediately

  if (error) {
    return (
      <div className={`p-8 bg-red-50 border border-red-200 rounded-2xl ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-800">Error</h2>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchLinks}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const processedCount = links.filter(link => link.processed).length;
  const unprocessedCount = links.length - processedCount;
  const llmExtractedCount = links.filter(link => link.extractionMethod === 'llm').length;
  const htmlExtractedCount = links.filter(link => link.extractionMethod === 'html_parser').length;

  return (
    <div className={className}>
      <div className="flex justify-end mb-4">
        <button
          onClick={fetchLinks}
          disabled={loading}
          className="flex items-center justify-center w-10 h-10 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>
      </div>

      {/* Summary Stats - Simplified */}
      <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
        <span>{links.length} links found</span>
        {processedCount > 0 && <span>{processedCount} processed</span>}
        {llmExtractedCount > 0 && <span>{llmExtractedCount} AI extracted</span>}
      </div>

      {/* Links List */}
      {links.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p>No links extracted yet</p>
          <p className="text-sm">Newsletter emails will appear here once processed</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {links.map((link) => (
            <div
              key={link.id}
              className={`p-4 border rounded-lg ${
                link.processed
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Clean title or text instead of URL */}
                  <div className="flex items-center gap-2 mb-2">
                    {link.text ? (
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {link.text}
                      </h3>
                    ) : (
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {link.url.replace(/^https?:\/\//, '').split('/')[0]}
                      </h3>
                    )}
                    {link.processed && (
                      <span className="px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded">
                        ✓ Done
                      </span>
                    )}
                    {link.category && link.category !== 'other' && (
                      <span className={`px-2 py-1 text-xs rounded ${
                        link.category === 'article' ? 'bg-blue-100 text-blue-800' :
                        link.category === 'tool' ? 'bg-purple-100 text-purple-800' :
                        link.category === 'news' ? 'bg-red-100 text-red-800' :
                        link.category === 'product' ? 'bg-green-100 text-green-800' :
                        link.category === 'job' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {link.category}
                      </span>
                    )}
                  </div>
                  
                  {/* Clean URL (clickable, truncated) */}
                  <div className="mb-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-800 text-sm truncate block"
                    >
                      {link.url.length > 60 ? `${link.url.substring(0, 60)}...` : link.url}
                    </a>
                  </div>
                  
                  {/* Context if meaningful */}
                  {link.context && link.context.length > 10 && (
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {link.context}
                    </p>
                  )}
                  
                  {/* Clean metadata */}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{new Date(link.extractedAt).toLocaleDateString()}</span>
                    {link.extractionMethod === 'llm' && (
                      <span className="px-1 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                        AI
                      </span>
                    )}
                  </div>
                </div>
                
                {!link.processed && (
                  <button
                    onClick={() => markAsProcessed(link.id)}
                    disabled={processingLinks.has(link.id)}
                    className="ml-4 flex items-center space-x-2 px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {processingLinks.has(link.id) ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Mark Done</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
