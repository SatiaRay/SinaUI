// AlertBox.js
import React, { useState, useEffect } from 'react';
import Icon from '@components/ui/Icon';
import { confirm } from '@components/ui/alert/confirmation';
import { notify } from '@components/ui/toast';

/**
 * کامپوننت AlertBox برای نمایش ماژول‌های تعبیه‌شده اسکریپت
 * @param {Object} props
 * @param {string} props.scriptSrc - آدرس منبع اسکریپت
 * @param {string} props.dataToken - توکن اسکریپت
 * @param {string} props.title - عنوان آلرت باکس
 * @param {string} props.description - توضیحات آلرت باکس
 * @param {boolean} props.defaultOpen - آیا آلرت به صورت پیش‌فرض باز باشد
 */
const AlertBox = ({
  scriptSrc = 'https://khan.satia.co/public/chat.js',
  dataToken,
  title = 'ماژول تعبیه‌شده',
  description = 'این باکس حاوی یک ماژول اسکریپت تعبیه‌شده است',
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  /**
   * مدیریت بارگذاری اسکریپت
   */
  const handleScriptLoad = () => {
    setScriptLoaded(true);
    notify.success('اسکریپت با موفقیت بارگذاری شد');
  };

  /**
   * مدیریت خطای اسکریپت
   */
  const handleScriptError = () => {
    setScriptLoaded(false);
    notify.error('خطا در بارگذاری اسکریپت');
  };

  /**
   * تغییر وضعیت نمایش آلرت باکس
   */
  const toggleAlertBox = () => {
    setIsOpen(!isOpen);
  };

  /**
   * کپی کردن کود تعبیه
   */
  const handleCopyEmbedCode = () => {
    const embedCode = `<script src="${scriptSrc}" data-token="${dataToken}"></script>`;
    
    confirm({
      title: 'کپی کود تعبیه',
      text: 'آیا می‌خواهید کود تعبیه را در کلیپ‌بورد کپی کنید؟',
      onConfirm: () => {
        navigator.clipboard.writeText(embedCode)
          .then(() => notify.success('کود تعبیه در کلیپ‌بورد کپی شد'))
          .catch(() => notify.error('خطا در کپی کردن کود'));
      },
    });
  };

  /**
   * بارگذاری اسکریپت هنگام باز شدن آلرت باکس
   */
  useEffect(() => {
    if (isOpen && !scriptLoaded && dataToken) {
      const scriptId = 'embedded-module-script';
      
      // حذف اسکریپت موجود اگر وجود دارد
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }

      // ایجاد المان اسکریپت جدید
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = scriptSrc;
      script.setAttribute('data-token', dataToken);
      script.async = true;
      
      script.onload = handleScriptLoad;
      script.onerror = handleScriptError;

      document.body.appendChild(script);

      // تابع تمیزکاری
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [isOpen, scriptSrc, dataToken, scriptLoaded]);

  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
      {/* هدر آلرت باکس */}
      <div 
        className="flex items-center justify-between p-4 bg-gray-900 cursor-pointer hover:bg-gray-850 transition-colors"
        onClick={toggleAlertBox}
      >
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ml-3 ${scriptLoaded ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <div>
            <h4 className="font-medium text-lg">{title}</h4>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {scriptLoaded ? 'بارگذاری شد' : 'در حال بارگذاری...'}
          </span>
          <Icon 
            name={isOpen ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-gray-400"
          />
        </div>
      </div>

      {/* محتوای آلرت باکس */}
      {isOpen && (
        <div className="p-4">
          {/* اطلاعات اسکریپت */}
          <div className="mb-4 p-3 bg-gray-900 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">آدرس منبع اسکریپت</span>
              <button
                onClick={handleCopyEmbedCode}
                className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Icon name="Copy" size={16} />
                کپی کود
              </button>
            </div>
            <code className="text-sm text-gray-400 break-all">
              &lt;script src="{scriptSrc}" data-token="{dataToken}"&gt;&lt;/script&gt;
            </code>
          </div>

          {/* کانتینر ماژول تعبیه‌شده */}
          <div className="relative">
            {!dataToken ? (
              <div className="text-center p-6 border-2 border-dashed border-gray-700 rounded-lg">
                <Icon name="AlertCircle" size={48} className="mx-auto text-yellow-500 mb-3" />
                <p className="text-gray-400">برای بارگذاری ماژول، توکن الزامی است</p>
              </div>
            ) : (
              <div id="embedded-module-container" className="min-h-[200px]">
                {/* اسکریپت محتوا را در اینجا رندر می‌کند */}
                {!scriptLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                      <p className="text-gray-400">در حال بارگذاری ماژول تعبیه‌شده...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* نوار وضعیت */}
          <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <span className={`flex items-center gap-2 ${scriptLoaded ? 'text-green-500' : 'text-yellow-500'}`}>
                <Icon name={scriptLoaded ? "CheckCircle" : "Clock"} size={16} />
                {scriptLoaded ? 'ماژول آماده است' : 'در حال راه‌اندازی'}
              </span>
              <span className="text-gray-400">
                منبع: {new URL(scriptSrc).hostname}
              </span>
            </div>
            
            <button
              onClick={toggleAlertBox}
              className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertBox;