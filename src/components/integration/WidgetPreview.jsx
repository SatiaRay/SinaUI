import React, { useMemo } from 'react';

export default function WidgetPreview({ embedId }) {
  const src = useMemo(() => {
    if (!embedId) return '';
    return `/integration/preview?embedId=${encodeURIComponent(embedId)}`;
  }, [embedId]);

  if (!embedId) {
    return (
      <div className="text-neutral-500 text-sm">
        یک integration انتخاب کن تا preview ببینی.
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
      <iframe
        title="chat-widget-preview"
        src={src}
        className="w-full h-[360px]"
        style={{ border: 0 }}
      />
    </div>
  );
}
