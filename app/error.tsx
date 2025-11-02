'use client';

import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Oops! Something went wrong
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We encountered an error while processing your request. Please try again.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-red-800 mb-2">
                  Error Details (Development)
                </h3>
                <p className="text-xs text-red-700 font-mono break-all">{error.message}</p>
                {error.digest && (
                  <p className="text-xs text-red-600 mt-1">Error ID: {error.digest}</p>
                )}
              </div>
            )}
            <div className="flex flex-col space-y-3">
              <button
                onClick={reset}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
