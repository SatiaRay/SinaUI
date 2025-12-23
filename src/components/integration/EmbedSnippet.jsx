import React, { useState } from 'react';

/**
 * Embed Snippet Component
 * @param {string} snippet - The embed script code to display
 */
export default function EmbedSnippet({ snippet }) {
  /**
   * Copy State
   */
  const [copied, setCopied] = useState(false);

  /**
   * Copy Handler
   * Copies snippet to clipboard and shows temporary feedback
   */
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      alert('کپی انجام نشد. دستی کپی کن.');
    }
  };

  /**
   * Main Render
   */
  return (
    <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="absolute top-3 left-3 flex items-center gap-2">
        {copied && (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            کپی شد ✅
          </span>
        )}
        <button
          onClick={copy}
          className="
            px-3 py-1.5 rounded-xl font-semibold text-xs
            bg-gray-900 text-white
            dark:bg-white dark:text-gray-900
            hover:opacity-90 transition
          "
        >
          Copy
        </button>
      </div>

      <pre className="text-xs whitespace-pre-wrap break-words text-gray-800 dark:text-gray-100 leading-relaxed pl-24">
        {snippet}
      </pre>
    </div>
  );
}
