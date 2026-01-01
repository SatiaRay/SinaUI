/**
 * Form utility functions for API integration
 * @module formUtils
 */

/**
 * Generates unique ID for form items
 * @function generateId
 * @param {Array} items - Array of existing items
 * @returns {number} New ID
 */
export const generateId = (items) => {
  if (!items || items.length === 0) return 1;
  return Math.max(...items.map((item) => item.id || 0)) + 1;
};

/**
 * Creates a new parameter object
 * @function createNewParameter
 * @param {Array} existingParameters - Existing parameters array
 * @returns {Object} New parameter object
 */
export const createNewParameter = (existingParameters = []) => ({
  id: generateId(existingParameters),
  name: '',
  type: 'string',
  required: false,
  description: '',
  location: 'query',
  default_value: '',
});

/**
 * Creates a new header object
 * @function createNewHeader
 * @param {Array} existingHeaders - Existing headers array
 * @returns {Object} New header object
 */
export const createNewHeader = (existingHeaders = []) => ({
  id: generateId(existingHeaders),
  key: '',
  value: '',
  required: false,
  description: '',
});

/**
 * Updates nested form data
 * @function updateNestedFormData
 * @param {Object} prevData - Previous form data
 * @param {string} section - Section name (can be nested with dots)
 * @param {string} field - Field name
 * @param {any} value - New value
 * @returns {Object} Updated form data
 */
export const updateNestedFormData = (prevData, section, field, value) => {
  if (section.includes('.')) {
    const [parent, child] = section.split('.');
    return {
      ...prevData,
      [parent]: {
        ...prevData[parent],
        [child]: value,
      },
    };
  }

  if (field === null) {
    return {
      ...prevData,
      [section]: value,
    };
  }

  return {
    ...prevData,
    [section]: {
      ...prevData[section],
      [field]: value,
    },
  };
};

/**
 * Validates required form fields
 * @function validateForm
 * @param {Object} formData - Form data to validate
 * @returns {{isValid: boolean, errors: Array}} Validation result
 */
export const validateForm = (formData) => {
  const errors = [];

  if (!formData.name?.trim()) {
    errors.push('نام API الزامی است');
  }

  if (!formData.base_url?.trim()) {
    errors.push('URL پایه API الزامی است');
  }

  // Validate URL format
  if (formData.base_url?.trim() && !isValidUrl(formData.base_url.trim())) {
    errors.push('URL پایه معتبر نیست');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates URL format
 * @function isValidUrl
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Formats tags array to string
 * @function formatTagsToString
 * @param {Array} tags - Tags array
 * @returns {string} Comma separated tags
 */
export const formatTagsToString = (tags) => {
  if (!Array.isArray(tags)) return '';
  return tags.join(', ');
};

/**
 * Parses tags string to array
 * @function parseTagsFromString
 * @param {string} tagsString - Tags string
 * @returns {Array} Tags array
 */
export const parseTagsFromString = (tagsString) => {
  if (!tagsString) return [];
  return tagsString
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag);
};
