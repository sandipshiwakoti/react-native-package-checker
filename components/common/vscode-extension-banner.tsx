'use client';

import { Code, ExternalLink } from 'lucide-react';

export function VSCodeExtensionBanner() {
  const handleClick = () => {
    window.open('https://github.com/sandipshiwakoti/vscode-react-native-package-checker', '_blank');
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        className="relative overflow-hidden flex items-center gap-4 px-5 py-4 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 rounded-2xl border border-blue-200/50 dark:border-blue-500/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
      >
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute right-20 bottom-0 w-16 h-16 bg-fuchsia-400/20 rounded-full blur-lg"></div>
        <div className="absolute left-40 top-0 w-24 h-24 bg-pink-400/10 rounded-full blur-lg"></div>
        <div className="bg-blue-500/20 dark:bg-white/10 p-3 rounded-lg backdrop-blur-sm z-10">
          <Code className="h-6 w-6 text-blue-700 dark:text-white shrink-0" />
        </div>
        <div className="flex-1 z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-bold text-gray-800 dark:text-white">
              VSCode Extension - React Native Package Checker
            </span>
            <div className="px-3 py-1 bg-gradient-to-r from-green-300 via-emerald-400 to-teal-400 dark:from-emerald-600 dark:via-green-600 dark:to-teal-600 rounded-full text-xs font-bold text-green-900 dark:text-white flex items-center gap-1.5 shadow-sm">
              <div className="h-2 w-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></div>
              <span>Available Now</span>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-white/90">
            Check New Architecture compatibility and version requirements for React Native packages
            - all in VSCode ⚡️
          </p>
        </div>
        <div className="z-10">
          <ExternalLink className="h-5 w-5 text-gray-600 dark:text-white/70" />
        </div>
      </div>
    </div>
  );
}
