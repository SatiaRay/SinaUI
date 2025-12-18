import React, { useState } from 'react';

export default function EmbedSnippet({ snippet }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      alert('کپی انجام نشد. دستی کپی کن.');
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <pre className="text-xs whitespace-pre-wrap break-words text-gray-800 dark:text-gray-100 leading-relaxed">
        {snippet}
      </pre>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={copy}
          className="
            px-4 py-2 rounded-xl font-semibold
            bg-gray-900 text-white
            dark:bg-white dark:text-gray-900
            hover:opacity-90 transition
          "
        >
          Copy
        </button>

        {copied ? (
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            کپی شد ✅
          </span>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            برای سایت مقصد Paste کن
          </span>
        )}
      </div>
    </div>
  );
}
