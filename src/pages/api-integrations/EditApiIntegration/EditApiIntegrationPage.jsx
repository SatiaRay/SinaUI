import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { notify } from '@components/ui/toast';
import Swal from 'sweetalert2';
import { EditApiIntegrationLoading } from './EditApiIntegrationLoading';

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
  ResponseSchemaPreview,
  InfoCard,
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
 * Simulates fetching API integration data by ID
 * @async
 * @function fetchApiIntegrationById
 * @param {string|number} id - API integration ID
 * @returns {Promise<Object>} API integration data
 */
const fetchApiIntegrationById = async (id) => {
  // In a real application, this would be an API call
  // For now, we'll simulate with mock data and delay

  // Mock data matching the structure from ApiIntegrationIndexPage
  const mockIntegrations = [
    {
      id: 1,
      name: 'OpenAI GPT-4',
      description: 'هوش مصنوعی GPT-4 برای پردازش متن',
      category: 'ai',
      tags: ['openai', 'gpt4', 'ai', 'chat'],
      base_url: 'https://api.openai.com/v1',
      endpoint_path: '/chat/completions',
      http_method: 'POST',
      timeout: 30,
      parameters: [
        {
          id: 1,
          name: 'model',
          type: 'string',
          required: true,
          description: 'Model to use for completion',
          location: 'body',
          default_value: 'gpt-4',
        },
        {
          id: 2,
          name: 'messages',
          type: 'array',
          required: true,
          description: 'Array of message objects',
          location: 'body',
          default_value: '[{"role": "user", "content": "Hello"}]',
        },
        {
          id: 3,
          name: 'temperature',
          type: 'number',
          required: false,
          description: 'Sampling temperature',
          location: 'body',
          default_value: '0.7',
        },
      ],
      headers: [
        {
          id: 1,
          key: 'Content-Type',
          value: 'application/json',
          required: true,
          description: 'Request content type',
        },
        {
          id: 2,
          key: 'Accept',
          value: 'application/json',
          required: true,
          description: 'Response content type',
        },
      ],
      request_body: {
        enabled: true,
        content_type: 'application/json',
        schema_type: 'json',
        example: JSON.stringify(
          {
            model: 'gpt-4',
            messages: [
              {
                role: 'user',
                content: 'Hello, how are you?',
              },
            ],
            temperature: 0.7,
          },
          null,
          2
        ),
        description: 'Request body for chat completion',
      },
      response_schema: {
        enabled: true,
        content_type: 'application/json',
        example: JSON.stringify(
          {
            id: 'chatcmpl-123',
            object: 'chat.completion',
            created: 1677652288,
            model: 'gpt-4',
            choices: [
              {
                index: 0,
                message: {
                  role: 'assistant',
                  content:
                    'Hello! I am doing well, thank you for asking. How can I assist you today?',
                },
                finish_reason: 'stop',
              },
            ],
            usage: {
              prompt_tokens: 9,
              completion_tokens: 12,
              total_tokens: 21,
            },
          },
          null,
          2
        ),
        validation_rules: [],
      },
      authentication: {
        type: 'bearer_token',
        location: 'header',
        key_name: 'Authorization',
        value_format: 'Bearer {token}',
        token: 'sk-proj-abc123def456ghi789jkl012mno345',
      },
      rate_limiting: {
        enabled: true,
        requests_per_minute: 60,
        requests_per_hour: 1000,
        strategy: 'fixed_window',
      },
      test_configuration: {
        enabled: true,
        auto_test_on_save: false,
        sample_data: {},
      },
      ai_agent_config: {
        expose_to_agents: true,
        function_name: 'openai_chat_completion',
        description: 'ارسال پیام به هوش مصنوعی GPT-4 و دریافت پاسخ',
        parameters_schema: {},
      },
      is_active: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-03-20T14:45:00Z',
      usage_count: 1247,
      rate_limit: 1000,
    },
    {
      id: 2,
      name: 'Claude Anthropic',
      description: 'هوش مصنوعی کلود برای مکالمات طولانی',
      category: 'ai',
      tags: ['anthropic', 'claude', 'ai'],
      base_url: 'https://api.anthropic.com/v1',
      endpoint_path: '/messages',
      http_method: 'POST',
      timeout: 30,
      parameters: [
        {
          id: 1,
          name: 'model',
          type: 'string',
          required: true,
          description: 'Claude model version',
          location: 'body',
          default_value: 'claude-3-opus-20240229',
        },
      ],
      headers: [
        {
          id: 1,
          key: 'Content-Type',
          value: 'application/json',
          required: true,
          description: 'Request content type',
        },
        {
          id: 2,
          key: 'x-api-key',
          value: '',
          required: true,
          description: 'API Key for authentication',
        },
      ],
      request_body: {
        enabled: true,
        content_type: 'application/json',
        schema_type: 'json',
        example: JSON.stringify(
          {
            model: 'claude-3-opus-20240229',
            max_tokens: 1024,
            messages: [
              {
                role: 'user',
                content: 'Hello, Claude!',
              },
            ],
          },
          null,
          2
        ),
        description: 'Request body for Claude messages',
      },
      authentication: {
        type: 'api_key',
        location: 'header',
        key_name: 'x-api-key',
        value_format: '{token}',
        token: 'sk-ant-api03-xyz789uvw456rst123opq890',
      },
      ai_agent_config: {
        expose_to_agents: true,
        function_name: 'claude_chat',
        description: 'ارسال پیام به هوش مصنوعی کلود و دریافت پاسخ',
        parameters_schema: {},
      },
      is_active: true,
    },
  ];

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const integration = mockIntegrations.find((item) => item.id === parseInt(id));

  if (!integration) {
    throw new Error('API integration not found');
  }

  return integration;
};

/**
 * Transforms API integration data to form data structure
 * @function transformToFormData
 * @param {Object} apiData - API integration data
 * @returns {Object} Form data structure
 */
const transformToFormData = (apiData) => {
  return {
    ...INITIAL_FORM_STATE,
    name: apiData.name || '',
    description: apiData.description || '',
    category: apiData.category || '',
    tags: Array.isArray(apiData.tags) ? apiData.tags : [],
    base_url: apiData.base_url || '',
    endpoint_path: apiData.endpoint_path || '',
    http_method: apiData.http_method || 'GET',
    timeout: apiData.timeout || 30,
    parameters: apiData.parameters || INITIAL_FORM_STATE.parameters,
    headers: apiData.headers || INITIAL_FORM_STATE.headers,
    request_body: apiData.request_body || INITIAL_FORM_STATE.request_body,
    response_schema:
      apiData.response_schema || INITIAL_FORM_STATE.response_schema,
    authentication: apiData.authentication || INITIAL_FORM_STATE.authentication,
    rate_limiting: apiData.rate_limiting || INITIAL_FORM_STATE.rate_limiting,
    test_configuration:
      apiData.test_configuration || INITIAL_FORM_STATE.test_configuration,
    ai_agent_config:
      apiData.ai_agent_config || INITIAL_FORM_STATE.ai_agent_config,
  };
};

/**
 * EditApiIntegrationPage Component - Main component for editing existing API integrations
 * @component
 * @returns {JSX.Element} Rendered API edit page
 */
const EditApiIntegrationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [originalData, setOriginalData] = useState(null);

  // Check if we're coming from a specific tab
  useEffect(() => {
    const state = location.state || {};
    if (state.activeTab) {
      setActiveTab(state.activeTab);
    }
  }, [location.state]);

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

  // Fetch API integration data
  useEffect(() => {
    const loadApiIntegration = async () => {
      if (!id) {
        notify.error('شناسه API مشخص نیست');
        navigate('/api-integrations');
        return;
      }

      try {
        setIsLoading(true);
        const apiData = await fetchApiIntegrationById(id);
        const formData = transformToFormData(apiData);

        setFormData(formData);
        setOriginalData(apiData);
      } catch (error) {
        console.error('Error loading API integration:', error);
        notify.error(`خطا در بارگذاری API: ${error.message}`);
        navigate('/api-integrations');
      } finally {
        setIsLoading(false);
      }
    };

    loadApiIntegration();
  }, [id, navigate]);

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
      parameters: [...prev.parameters, createNewParameter(prev.parameters)],
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
      headers: [...prev.headers, createNewHeader(prev.headers)],
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
   * Resets the form to its original state
   * @function handleResetForm
   */
  const handleResetForm = () => {
    if (originalData) {
      setFormData(transformToFormData(originalData));
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
    notify.success('فرم با موفقیت بازنشانی شد!');
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

    // Check if data has changed
    const hasChanges =
      JSON.stringify(formData) !==
      JSON.stringify(transformToFormData(originalData));

    if (!hasChanges) {
      notify.info('هیچ تغییری در داده‌ها ایجاد نشده است.');
      return;
    }

    const result = await Swal.fire({
      title: 'به‌روزرسانی API',
      text: 'آیا از صحت تغییرات اعمال شده اطمینان دارید؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ذخیره تغییرات',
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
            console.log('Updated API Integration Data:', formData);
            setIsSubmitting(false);
            resolve(true);
          }, 1000);
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed) {
      notify.success('API با موفقیت به‌روزرسانی شد!');
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
        let textToCopy;

        if (typeof testResult.data === 'object') {
          textToCopy = JSON.stringify(testResult.data, null, 2);
        } else if (testResult.data) {
          textToCopy = String(testResult.data);
        } else {
          textToCopy = 'پاسخ خالی است';
        }

        await navigator.clipboard.writeText(textToCopy);
        notify.success('پاسخ کپی شد!');
      } catch (err) {
        console.error('Failed to copy:', err);
        notify.error('خطا در کپی پاسخ!');
      }
    } else {
      notify.error('پاسخ تستی برای کپی کردن وجود ندارد');
    }
  };

  /**
   * Handles cancel button click
   * @function handleCancel
   */
  const handleCancel = () => {
    navigate('/api-integrations');
  };

  /**
   * Checks if form has changes
   * @function hasChanges
   * @returns {boolean} True if form has changes
   */
  const hasChanges = () => {
    if (!originalData) return false;
    const originalFormData = transformToFormData(originalData);
    return JSON.stringify(formData) !== JSON.stringify(originalFormData);
  };

  // Show loading skeleton
  if (isLoading) {
    return <EditApiIntegrationLoading />;
  }

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
        isEditMode={true}
        hasChanges={hasChanges()}
        apiData={originalData}
        onTabChange={handleTabChange}
      />

      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col md:flex-row">
          <NavigationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={NAV_TABS}
            isMobile={isMobile}
            isEditMode={true}
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
                          ویرایش API -{' '}
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
        handleCancel={handleCancel}
        isEditMode={true}
        hasChanges={hasChanges()}
        onReset={handleResetForm}
      />
    </div>
  );
};

export default EditApiIntegrationPage;
