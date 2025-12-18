import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { WIDGET_SCRIPT_BASE_URL } from './Contract';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function WidgetPreviewPage() {
  const q = useQuery();
  const embedId = q.get('embedId') || '';

  const scriptSrc = useMemo(() => {
    const id = String(embedId || '').trim();
    return `${WIDGET_SCRIPT_BASE_URL}?id=${encodeURIComponent(id)}`;
  }, [embedId]);

  useEffect(() => {
    if (!embedId) return;

    const existing = document.getElementById('khan-widget-script');
    if (existing) existing.remove();

    const s = document.createElement('script');
    s.id = 'khan-widget-script';
    s.src = scriptSrc;
    s.async = true;
    document.body.appendChild(s);

    return () => {
      const el = document.getElementById('khan-widget-script');
      if (el) el.remove();
    };
  }, [embedId, scriptSrc]);

  return (
    <div className="w-full h-screen bg-neutral-50 p-4">
      <div className="text-sm text-neutral-700 mb-2">
        <b>Widget Preview</b> — embedId: <code>{embedId || '-'}</code>
      </div>

      <div className="border border-neutral-200 rounded-lg bg-white h-[85vh] p-4">
        {!embedId ? (
          <div className="text-neutral-500">
            embedId ندادید. آدرس را اینطوری باز کنید:
            <br />
            <code>/integration/preview?embedId=emb_xxx</code>
          </div>
        ) : (
          <div className="text-neutral-500 text-sm">
            اگر ویجت شما خودش UI را روی صفحه inject می‌کند، همینجا باید ظاهر شود.
          </div>
        )}
      </div>
    </div>
  );
}
