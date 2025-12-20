import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { WIDGET_SCRIPT_BASE_URL } from './Contract';

/**
 * Widget Preview Page
 */
const WidgetPreviewPage = () => {
  /**
   * Extract embedId from URL query
   */
  const query = new URLSearchParams(useLocation().search);
  const embedId = query.get('embedId')?.trim() || '';

  /**
   * Build widget script URL
   * @return {string} Full script URL with encoded embedId
   */
  const scriptSrc = useMemo(
    () => embedId ? `${WIDGET_SCRIPT_BASE_URL}?id=${encodeURIComponent(embedId)}` : '',
    [embedId]
  );

  /**
   * Load / Unload widget script
   */
  useEffect(() => {
    if (!embedId || !scriptSrc) return;

    document.getElementById('khan-widget-script')?.remove();

    const script = document.createElement('script');
    script.id = 'khan-widget-script';
    script.src = scriptSrc;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.getElementById('khan-widget-script')?.remove();
    };
  }, [embedId, scriptSrc]);

  /**
   * Main Render
   */
  return (
    <div className="w-full h-screen bg-neutral-50 p-4">
      <div className="text-sm text-neutral-700 mb-2">
        <b>Widget Preview</b> — embedId: <code>{embedId || '-'}</code>
      </div>

      <div className="border border-neutral-200 rounded-lg bg-white h-[85vh] p-4">
        {!embedId ? (
          <div className="text-neutral-500">
            embedId مشخص نشده است. آدرس را به شکل زیر باز کنید:
            <br />
            <code className="text-xs">/integration/preview?embedId=emb_xxx</code>
          </div>
        ) : (
          <div className="text-neutral-500 text-sm">
            ویجت باید به صورت خودکار در این صفحه ظاهر شود.
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetPreviewPage;