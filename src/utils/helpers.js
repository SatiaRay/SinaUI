export const formatTimestamp = (timestamp, useCurrentTime = false) => {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  if (useCurrentTime || !timestamp) {
    return new Date().toLocaleTimeString('fa-IR', options);
  }

  try {
    const utcTimestamp = timestamp.endsWith('Z') ? timestamp : `${timestamp}Z`;
    const date = new Date(utcTimestamp);

    if (isNaN(date.getTime())) {
      return '--:--';
    }

    return date.toLocaleTimeString('fa-IR', options);
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '--:--';
  }
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

/**
 * Data normalizer
 *
 * [{id: 1, ...}, {id: 2, ...}] => {ids: [1, 2], entities: {1: {id:1, ...}, 2: {id:2, ...}}}
 *
 * @param {Array} dataArray which compound of objects which each self has id property
 */
export const dataNormalizer = (dataArray) => {
  let normalized = { ids: [], entities: {} };

  dataArray.map((value) => {
    normalized.ids.push(value.id);

    normalized.entities[value.id] = value;
  });

  return normalized;
};

/**
 * Merges two normalized objects with the structure:
 * {
 *   ids: string[] | number[],
 *   entities: Record<string | number, any>
 * }
 *
 * - The `ids` arrays from both inputs are combined and deduplicated.
 * - The `entities` maps are shallow-merged, where properties from `b.entities`
 *   take precedence over those from `a.entities` if the same id exists in both.
 *
 * Example:
 *   mergeNormalized(
 *     { ids: [1, 2], entities: { 1: {id: 1}, 2: {id: 2} } },
 *     { ids: [2, 3], entities: { 2: {id: 2, name: "updated"}, 3: {id: 3} } }
 *   )
 *   // =>
 *   {
 *     ids: [1, 2, 3],
 *     entities: {
 *       1: {id: 1},
 *       2: {id: 2, name: "updated"},
 *       3: {id: 3}
 *     }
 *   }
 *
 * @param {Object} a - First normalized object.
 * @param {Object} b - Second normalized object.
 * @returns {Object} A new normalized object containing the merged ids and entities.
 */
export const mergeNormalized = (a, b) => {
  return {
    ids: Array.from(new Set([...a.ids, ...b.ids])),
    entities: {
      ...a.entities,
      ...b.entities, // b overrides a if same id
    },
  };
};
