export const formatTimestamp = (
  timestamp,
  format = {
    hour: '2-digit',
    minute: '2-digit',
  }
) => {
  return new Date(timestamp).toLocaleTimeString('fa-IR', format);
};

export const copyToClipboard = (text) => {
  return navigator.clipboard.writeText(text);
};

/**
 * Removes all HTML tags from a string and returns only the text content.
 * @param {string} html - The HTML content string.
 * @returns {string} The plain text content with all tags removed.
 */
export const stripHtmlTags = (html) => {
  if (typeof html !== 'string') return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};
