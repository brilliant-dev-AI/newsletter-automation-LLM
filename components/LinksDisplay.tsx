'use client';

import { useState, useEffect } from 'react';

interface Link {
  id: string;
  emailId: string;
  url: string;
  text: string;
  context: string;
  category: string;
  relevance: number;
  extractionMethod: string;
  extractedAt: string;
  processed: boolean;
}

interface LinksDisplayProps {
  className?: string;
}

export function LinksDisplay({ className = '' }: LinksDisplayProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const markAsProcessed = async (linkId: string) => {
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkId }),
      });

      if (response.ok) {
        // Update the link in the local state
        setLinks(prevLinks =>
          prevLinks.map(link =>
            link.id === linkId ? { ...link, processed: true } : link
          )
        );
      }
    } catch (err) {
      console.error('Error marking link as processed:', err);
    }
  };

  // Remove skeleton loading - show content immediately

  if (error) {
    return (
      <div className={`p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <h2 className="text-xl font-semibold text-red-800 mb-2">❌ Error</h2>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchLinks}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
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
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Loading...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded">
          <div className="text-xl font-bold text-blue-600">{links.length}</div>
          <div className="text-xs text-blue-800">Total Links</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded">
          <div className="text-xl font-bold text-green-600">{processedCount}</div>
          <div className="text-xs text-green-800">Processed</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded">
          <div className="text-xl font-bold text-orange-600">{unprocessedCount}</div>
          <div className="text-xs text-orange-800">Unprocessed</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded">
          <div className="text-xl font-bold text-purple-600">{llmExtractedCount}</div>
          <div className="text-xs text-purple-800">LLM Extracted</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-xl font-bold text-gray-600">{htmlExtractedCount}</div>
          <div className="text-xs text-gray-800">HTML Parsed</div>
        </div>
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
                  <div className="flex items-center gap-2 mb-1">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium truncate"
                    >
                      {link.url}
                    </a>
                    {link.processed && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        ✓ Processed
                      </span>
                    )}
                    {link.category && (
                      <span className={`px-2 py-1 text-xs rounded ${
                        link.category === 'article' ? 'bg-blue-100 text-blue-800' :
                        link.category === 'tool' ? 'bg-purple-100 text-purple-800' :
                        link.category === 'news' ? 'bg-red-100 text-red-800' :
                        link.category === 'product' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {link.category}
                      </span>
                    )}
                    {link.extractionMethod === 'llm' && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                        🤖 LLM
                      </span>
                    )}
                  </div>
                  
                  {link.text && (
                    <p className="text-sm text-gray-600 mb-1">{link.text}</p>
                  )}
                  
                  {link.context && (
                    <p className="text-xs text-gray-500 italic">
                      Context: {link.context}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs text-gray-400">
                      Extracted: {new Date(link.extractedAt).toLocaleString()}
                    </p>
                    {link.relevance && (
                      <span className={`px-2 py-1 text-xs rounded ${
                        link.relevance >= 8 ? 'bg-green-100 text-green-800' :
                        link.relevance >= 6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Relevance: {link.relevance}/10
                      </span>
                    )}
                  </div>
                </div>
                
                {!link.processed && (
                  <button
                    onClick={() => markAsProcessed(link.id)}
                    className="ml-4 flex items-center space-x-1 px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mark Done</span>
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
