import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notify } from '@components/ui/toast';
import Swal from 'sweetalert2';

// Import components
import {
  Header,
  NavigationTabs,
  Footer,
  ApiBasicInfo,
  ApiRequestConfig,
  ApiAuthConfig,
  ApiAiConfig,
  ApiTestTab,
  QuickTestPanel,
  InfoCard,
  ResponseSchemaPreview,
} from '@components/apiIntegrations';

// Import utilities
import {
  INITIAL_FORM_STATE,
  NAV_TABS,
} from '@components/apiIntegrations/utils/constants';
import {
  generateId,
  createNewParameter,
  createNewHeader,
  updateNestedFormData,
  validateForm,
} from '@components/apiIntegrations/utils/formUtils';

/**
 * CreateApiIntegrationPage Component - Main component for creating new API integrations
 * @component
 * @returns {JSX.Element} Rendered API creation page
 */
const CreateApiIntegrationPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;

      // Set mobile flag
      setIsMobile(width < 768);

      // Simple logic: if window width is less than 1630px, use vertical layout
      setIsVerticalLayout(width < 1630);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  /**
   * Handles tab selection change
   * @function handleTabChange
   * @param {string} tabId - Selected tab ID
   */
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  /**
   * Handles form input changes
   * @function handleInputChange
   * @param {string} section - Section name
   * @param {string} field - Field name
   * @param {any} value - New value
   */
  const handleInputChange = (section, field, value) => {
    setFormData((prev) => updateNestedFormData(prev, section, field, value));
  };

  /**
   * Handles adding a new parameter
   * @function addParameter
   */
  const addParameter = () => {
    setFormData((prev) => ({
      ...prev,
      parameters: [...prev.parameters, createNewParameter()],
    }));
  };

  /**
   * Handles updating a parameter
   * @function updateParameter
   * @param {number} id - Parameter ID
   * @param {string} field - Field to update
   * @param {any} value - New value
   */
  const updateParameter = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  /**
   * Handles removing a parameter
   * @function removeParameter
   * @param {number} id - Parameter ID
   */
  const removeParameter = (id) => {
    if (formData.parameters.length > 1) {
      setFormData((prev) => ({
        ...prev,
        parameters: prev.parameters.filter((param) => param.id !== id),
      }));
    }
  };

  /**
   * Handles adding a new header
   * @function addHeader
   */
  const addHeader = () => {
    setFormData((prev) => ({
      ...prev,
      headers: [...prev.headers, createNewHeader()],
    }));
  };

  /**
   * Handles updating a header
   * @function updateHeader
   * @param {number} id - Header ID
   * @param {string} field - Field to update
   * @param {any} value - New value
   */
  const updateHeader = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      headers: prev.headers.map((header) =>
        header.id === id ? { ...header, [field]: value } : header
      ),
    }));
  };

  /**
   * Handles removing a header
   * @function removeHeader
   * @param {number} id - Header ID
   */
  const removeHeader = (id) => {
    if (formData.headers.length > 1) {
      setFormData((prev) => ({
        ...prev,
        headers: prev.headers.filter((header) => header.id !== id),
      }));
    }
  };

  /**
   * Simulates API testing with real HTTP request
   * @async
   * @function testApi
   * @param {Object} testData - Test data including parameters and headers values
   */
  const testApi = async (testData = {}) => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Construct full URL with base URL and endpoint
      const fullUrl = `${formData.base_url}${formData.endpoint_path || ''}`;

      // Validate URL
      if (!fullUrl || !fullUrl.startsWith('http')) {
        throw new Error('URL نامعتبر است. باید با http یا https شروع شود.');
      }

      // Prepare request headers
      const requestHeaders = {};
      formData.headers.forEach((header) => {
        if (header.key && header.value) {
          requestHeaders[header.key] = header.value;
        }
      });

      // Prepare query parameters
      const queryParams = {};
      formData.parameters
        .filter((param) => param.location === 'query')
        .forEach((param) => {
          if (testData.parameters?.[param.name] !== undefined) {
            queryParams[param.name] = testData.parameters[param.name];
          } else if (param.default_value) {
            queryParams[param.name] = param.default_value;
          }
        });

      // Construct URL with query parameters
      let urlWithParams = fullUrl;
      if (Object.keys(queryParams).length > 0) {
        const queryString = new URLSearchParams(queryParams).toString();
        urlWithParams = `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}${queryString}`;
      }

      // Prepare request body
      let requestBody = null;
      if (
        formData.http_method === 'POST' ||
        formData.http_method === 'PUT' ||
        formData.http_method === 'PATCH'
      ) {
        if (
          formData.request_body.enabled &&
          (testData.body || formData.request_body.example)
        ) {
          try {
            requestBody = JSON.parse(
              testData.body || formData.request_body.example
            );
          } catch (error) {
            throw new Error('بدنه درخواست JSON نامعتبر است');
          }
        }
      }

      // Add authentication
      if (formData.authentication.type !== 'none') {
        const auth = formData.authentication;
        if (auth.location === 'header' && auth.key_name && auth.token) {
          const tokenValue = auth.value_format.replace('{token}', auth.token);
          requestHeaders[auth.key_name] = tokenValue;
        }
      }

      // Start timing
      const startTime = Date.now();

      // Make actual HTTP request
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        formData.timeout * 1000
      );

      try {
        const response = await fetch(urlWithParams, {
          method: formData.http_method,
          headers: requestHeaders,
          body: requestBody ? JSON.stringify(requestBody) : null,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const endTime = Date.now();
        const duration = endTime - startTime;

        // Get response data
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
          try {
            data = await response.json();
          } catch (error) {
            data = await response.text();
          }
        } else {
          data = await response.text();
        }

        // Calculate response size
        const size =
          response.headers.get('content-length') ||
          new TextEncoder().encode(JSON.stringify(data || '')).length;
        const sizeKB = (size / 1024).toFixed(1) + ' KB';

        // Prepare headers object
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        // Set test result
        const testResultData = {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          data: data,
          duration: duration,
          size: sizeKB,
          ok: response.ok,
        };

        setTestResult(testResultData);

        if (response.ok) {
          notify.success('API تست با موفقیت انجام شد!');
        } else {
          notify.error(
            `درخواست با کد وضعیت ${response.status} پاسخ داده شد: ${response.statusText}`
          );
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);

        if (fetchError.name === 'AbortError') {
          throw new Error(
            `تایم‌اوت: درخواست پس از ${formData.timeout} ثانیه پاسخ نداد`
          );
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('API Test Error:', error);

      let status = 0;
      let statusText = 'Connection Error';
      let errorData = {
        error: error.message,
        details: 'Failed to connect to the API endpoint',
        timestamp: new Date().toISOString(),
      };

      if (
        error.name === 'TypeError' &&
        error.message.includes('Failed to fetch')
      ) {
        statusText = 'Network Error';
        errorData = {
          error: 'Network Error',
          details:
            'درخواست به دلیل مسائل شبکه (مانند CORS، عدم دسترسی شبکه، یا آدرس IP نادرست) رد شد.',
          suggestion:
            'بررسی کنید: ۱) سرور فعال باشد ۲) CORS تنظیم شده باشد ۳) آدرس صحیح باشد',
          timestamp: new Date().toISOString(),
        };
      } else if (error.message.includes('تایم‌اوت')) {
        statusText = 'Timeout Error';
        errorData = {
          error: 'Timeout Error',
          details: `درخواست پس از ${formData.timeout} ثانیه بدون پاسخ ماند`,
          suggestion: 'ممکن است سرور کند باشد یا تایم‌اوت کافی نباشد',
          timestamp: new Date().toISOString(),
        };
      } else if (error.message.includes('URL نامعتبر')) {
        statusText = 'Invalid URL';
        errorData = {
          error: 'Invalid URL Error',
          details: error.message,
          suggestion: 'آدرس باید با http:// یا https:// شروع شود',
          timestamp: new Date().toISOString(),
        };
      }

      const errorResult = {
        status: status,
        statusText: statusText,
        headers: {},
        data: errorData,
        duration: 0,
        size: '0 KB',
        ok: false,
      };

      setTestResult(errorResult);
      notify.error(`خطا در تست API: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  /**
   * Handles form submission with SweetAlert2 confirmation
   * @async
   * @function handleSubmit
   */
  const handleSubmit = async () => {
    const validation = validateForm(formData);

    if (!validation.isValid) {
      notify.error(validation.errors[0]);
      return;
    }

    const result = await Swal.fire({
      title: 'ذخیره API جدید',
      text: 'آیا از صحت اطلاعات وارد شده اطمینان دارید؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ذخیره',
      cancelButtonText: 'انصراف',
      reverseButtons: true,
      customClass: {
        confirmButton:
          'bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600',
        cancelButton:
          'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600',
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        return new Promise((resolve) => {
          setIsSubmitting(true);
          setTimeout(() => {
            console.log('API Integration Data:', formData);
            setIsSubmitting(false);
            resolve(true);
          }, 1000);
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed) {
      notify.success('API با موفقیت ذخیره شد!');
      navigate('/api-integrations');
    }
  };

  /**
   * Shows delete confirmation for parameter/header
   * @async
   * @function showDeleteConfirmation
   * @param {string} itemName - Name of item to delete
   * @param {Function} onConfirm - Function to execute on confirmation
   */
  const showDeleteConfirmation = async (itemName, onConfirm) => {
    const result = await Swal.fire({
      title: 'حذف',
      text: `آیا از حذف ${itemName} مطمئن هستید؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'بله، حذف کن',
      cancelButtonText: 'انصراف',
      reverseButtons: true,
      customClass: {
        confirmButton:
          'bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600',
        cancelButton:
          'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600',
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed && onConfirm) {
      onConfirm();
    }
  };

  /**
   * Copies test response to clipboard
   * @async
   * @function copyTestResponse
   */
  const copyTestResponse = async () => {
    if (testResult) {
      try {
        const textToCopy =
          typeof testResult.data === 'object'
            ? JSON.stringify(testResult.data, null, 2)
            : testResult.data;

        await navigator.clipboard.writeText(textToCopy);
        notify.success('پاسخ کپی شد!');
      } catch (err) {
        console.error('Failed to copy:', err);
        notify.error('خطا در کپی پاسخ!');
      }
    }
  };

  // Props to pass to child components
  const commonProps = {
    formData,
    handleInputChange,
    isMobile,
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header
        navigate={navigate}
        activeTab={activeTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isMobile={isMobile}
        tabs={NAV_TABS}
        navigateToFullTest={() => setActiveTab('test')}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEditMode={false}
        onTabChange={handleTabChange}
      />

      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col md:flex-row">
          <NavigationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={NAV_TABS}
            isMobile={isMobile}
          />

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {isMobile && (
                <div className="md:hidden mb-4 sm:mb-6">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                        {NAV_TABS.find((t) => t.id === activeTab)?.icon}
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                          {NAV_TABS.find((t) => t.id === activeTab)?.label}
                        </h2>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {
                            NAV_TABS.find((t) => t.id === activeTab)
                              ?.description
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      مرحله {NAV_TABS.findIndex((t) => t.id === activeTab) + 1}{' '}
                      از {NAV_TABS.length}
                    </div>
                  </div>
                </div>
              )}

              {/* Simple layout based on window width */}
              {isVerticalLayout ? (
                // Vertical layout (window width < 1630px)
                <div className="space-y-4 sm:space-y-6">
                  {/* Main content */}
                  <div className="space-y-4 sm:space-y-6">
                    {activeTab === 'basic' && <ApiBasicInfo {...commonProps} />}

                    {activeTab === 'request' && (
                      <ApiRequestConfig
                        {...commonProps}
                        addParameter={addParameter}
                        updateParameter={updateParameter}
                        removeParameter={removeParameter}
                        addHeader={addHeader}
                        updateHeader={updateHeader}
                        removeHeader={removeHeader}
                        showDeleteConfirmation={showDeleteConfirmation}
                      />
                    )}

                    {activeTab === 'auth' && <ApiAuthConfig {...commonProps} />}

                    {activeTab === 'ai' && <ApiAiConfig {...commonProps} />}

                    {activeTab === 'test' && (
                      <ApiTestTab
                        formData={formData}
                        handleInputChange={handleInputChange}
                        testApi={testApi}
                        isTesting={isTesting}
                        testResult={testResult}
                        copyTestResponse={copyTestResponse}
                        setActiveTab={setActiveTab}
                        setTestResult={setTestResult}
                      />
                    )}
                  </div>

                  {/* Side components at the bottom */}
                  <div className="space-y-4 sm:space-y-6">
                    <QuickTestPanel
                      formData={formData}
                      testApi={testApi}
                      isTesting={isTesting}
                      testResult={testResult}
                      copyTestResponse={copyTestResponse}
                      navigateToFullTest={() => setActiveTab('test')}
                    />

                    <ResponseSchemaPreview formData={formData} />

                    <InfoCard />
                  </div>
                </div>
              ) : (
                // Horizontal layout (window width >= 1630px)
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Main content */}
                  <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {activeTab === 'basic' && <ApiBasicInfo {...commonProps} />}

                    {activeTab === 'request' && (
                      <ApiRequestConfig
                        {...commonProps}
                        addParameter={addParameter}
                        updateParameter={updateParameter}
                        removeParameter={removeParameter}
                        addHeader={addHeader}
                        updateHeader={updateHeader}
                        removeHeader={removeHeader}
                        showDeleteConfirmation={showDeleteConfirmation}
                      />
                    )}

                    {activeTab === 'auth' && <ApiAuthConfig {...commonProps} />}

                    {activeTab === 'ai' && <ApiAiConfig {...commonProps} />}

                    {activeTab === 'test' && (
                      <ApiTestTab
                        formData={formData}
                        handleInputChange={handleInputChange}
                        testApi={testApi}
                        isTesting={isTesting}
                        testResult={testResult}
                        copyTestResponse={copyTestResponse}
                        setActiveTab={setActiveTab}
                        setTestResult={setTestResult}
                      />
                    )}
                  </div>

                  {/* Sidebar on the right */}
                  <div className="space-y-4 sm:space-y-6">
                    <QuickTestPanel
                      formData={formData}
                      testApi={testApi}
                      isTesting={isTesting}
                      testResult={testResult}
                      copyTestResponse={copyTestResponse}
                      navigateToFullTest={() => setActiveTab('test')}
                    />

                    <ResponseSchemaPreview formData={formData} />

                    <InfoCard />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer
        navigate={navigate}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEditMode={false}
      />
    </div>
  );
};

export default CreateApiIntegrationPage;
