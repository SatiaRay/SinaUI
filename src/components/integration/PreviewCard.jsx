import React, { useMemo } from 'react';

/**
 * Widget Preview Component
 * @param {string} embedId - The embed ID for the widget to preview
 */
export default function WidgetPreview({ embedId }) {
  /**
   * Generate Preview URL
   * @return {string} Full preview page URL or empty string if no embedId
   */
  const src = useMemo(() => {
    return embedId
      ? `/integration/preview?embedId=${encodeURIComponent(embedId)}`
      : '';
  }, [embedId]);

  /**
   * Empty State
   */
  if (!embedId) {
    return (
      <div className="text-neutral-500 text-sm">
        یک integration انتخاب کن تا preview ببینی.
      </div>
    );
  }

  /**
   * Main Render - Iframe Preview
   */
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
      <iframe
        title="chat-widget-preview"
        src={src}
        className="w-full h-[360px]"
        style={{ border: 0 }}
        loading="lazy"
      />
    </div>
  );
}
