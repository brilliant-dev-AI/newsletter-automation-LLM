"use client";

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

interface NewsletterCardProps {
  newsletter: Newsletter;
}

export function NewsletterCard({ newsletter }: NewsletterCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getFrameworkIcon = (framework: string) => {
    switch (framework) {
      case "playwright":
        return "🎭";
      case "skyvern":
        return "☁️";
      case "browserbase":
        return "🌐";
      default:
        return "🤖";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <span className="text-xl">{getFrameworkIcon(newsletter.framework)}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              {newsletter.framework.charAt(0).toUpperCase() + newsletter.framework.slice(1)}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Automation Framework
            </p>
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(newsletter.status)}`}>
          {newsletter.status}
        </span>
      </div>

      {/* URL */}
      <div className="mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200/50 dark:border-gray-600/50">
          <p className="text-sm text-gray-700 dark:text-gray-300 break-all font-mono">
            {newsletter.url}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <span className="font-medium">{newsletter.email}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 text-center border border-blue-200/50 dark:border-blue-700/50">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {newsletter.linksCount}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
            Links Found
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 text-center border border-purple-200/50 dark:border-purple-700/50">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            {formatDate(newsletter.lastProcessed)}
          </p>
          <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold">
            Last Processed
          </p>
        </div>
      </div>

      {/* Error Message */}
      {newsletter.status === "error" && newsletter.errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                Automation Failed
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                {newsletter.errorMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        {newsletter.status === "completed" && newsletter.linksCount > 0 && (
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
            View Links
          </button>
        )}
        {newsletter.status === "error" && (
          <button className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
            Retry
          </button>
        )}
        {newsletter.status === "processing" && (
          <button className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-sm font-semibold py-3 px-4 rounded-xl cursor-not-allowed shadow-lg" disabled>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          </button>
        )}
        {newsletter.status === "pending" && (
          <button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Queued</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
