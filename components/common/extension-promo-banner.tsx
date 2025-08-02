'use client';

import { ArrowUpRight, Download } from 'lucide-react';

export function ExtensionPromoBanner() {
  return (
    <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 w-full max-w-xs sm:max-w-none sm:w-auto">
      <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-50 dark:bg-purple-950/30 rounded-full border border-purple-200/50 dark:border-purple-800/30">
        <span className="text-xs text-purple-700 dark:text-purple-300 truncate sm:whitespace-nowrap">
          🎉 <span className="font-medium hidden sm:inline">New Open Source VSCode Extension:</span>
          <span className="font-medium sm:hidden">New:</span>{' '}
          <a
            href="https://medium.com/@sandipshiwakoti/react-native-version-bumper-simplify-your-version-management-5c17a9e66cb5"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline cursor-pointer"
            title="Read the full article on Medium"
          >
            React Native Version Bumper
          </a>
        </span>
        <div className="flex items-center gap-1.5">
          <a
            href="https://marketplace.visualstudio.com/items?itemName=sandipshiwakoti.vscode-react-native-version-bumper"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs bg-white hover:bg-gray-50 text-purple-600 border border-purple-200 px-2.5 py-1 rounded-md transition-colors font-medium shadow-sm hover:shadow-md"
          >
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Install</span>
          </a>
          <a
            href="https://github.com/sandipshiwakoti/vscode-react-native-version-bumper"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs bg-purple-600/10 hover:bg-purple-600/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-md transition-colors font-medium"
          >
            <ArrowUpRight className="h-3 w-3" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}
