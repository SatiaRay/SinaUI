/**
 * Constants for API integration forms
 * @constant
 * @type {Object}
 */
export const FORM_CONSTANTS = {
  HTTP_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  PARAMETER_TYPES: ['string', 'number', 'boolean', 'array', 'object'],
  PARAMETER_LOCATIONS: ['query', 'header', 'path', 'body'],
  AUTH_TYPES: [
    'none',
    'api_key',
    'bearer_token',
    'basic_auth',
    'oauth2',
    'custom',
  ],
  AUTH_LOCATIONS: ['header', 'query', 'cookie'],
  RATE_LIMIT_STRATEGIES: ['fixed_window', 'sliding_window', 'token_bucket'],
  CATEGORIES: ['', 'ai', 'payment', 'crm', 'communication', 'data', 'custom'],
};

/**
 * Navigation tabs configuration
 * @constant
 * @type {Array}
 */
export const NAV_TABS = [
  {
    id: 'basic',
    label: 'اطلاعات پایه',
    icon: 'TbSettings',
    description: 'نام، توضیحات و URL پایه',
    editDescription: 'ویرایش اطلاعات پایه API',
  },
  {
    id: 'request',
    label: 'تنظیمات درخواست',
    icon: 'TbCode',
    description: 'پارامترها، هدرها و بدنه',
    editDescription: 'ویرایش پارامترها و هدرهای درخواست',
  },
  {
    id: 'auth',
    label: 'احراز هویت',
    icon: 'TbLock',
    description: 'احراز هویت و محدودیت نرخ',
    editDescription: 'ویرایش تنظیمات امنیتی و احراز هویت',
  },
  {
    id: 'ai',
    label: 'تنظیمات AI',
    icon: 'TbApi',
    description: 'تنظیمات یکپارچه‌سازی AI',
    editDescription: 'ویرایش تنظیمات یکپارچه‌سازی با AI',
  },
  {
    id: 'test',
    label: 'تست کامل API',
    icon: 'TbTestPipe',
    description: 'تست کامل API',
    editDescription: 'تست API با تنظیمات جدید',
  },
];

/**
 * Initial form state
 * @constant
 * @type {Object}
 */
export const INITIAL_FORM_STATE = {
  name: '',
  description: '',
  category: '',
  tags: [],
  base_url: '',
  endpoint_path: '',
  http_method: 'GET',
  timeout: 30,
  parameters: [
    {
      id: 1,
      name: 'api_key',
      type: 'string',
      required: true,
      description: 'API Key for authentication',
      location: 'query',
      default_value: '',
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
    enabled: false,
    content_type: 'application/json',
    schema_type: 'json',
    example: JSON.stringify({ data: { example_field: 'value' } }, null, 2),
    description: 'Request body for POST/PUT operations',
  },
  response_schema: {
    enabled: true,
    content_type: 'application/json',
    example: JSON.stringify(
      {
        success: true,
        data: { id: 1, name: 'Example Response' },
        message: 'Operation successful',
      },
      null,
      2
    ),
    validation_rules: [],
  },
  authentication: {
    type: 'api_key',
    location: 'header',
    key_name: 'Authorization',
    value_format: 'Bearer {token}',
    token: '',
  },
  rate_limiting: {
    enabled: false,
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
    function_name: '',
    description: '',
    parameters_schema: {},
  },
};
