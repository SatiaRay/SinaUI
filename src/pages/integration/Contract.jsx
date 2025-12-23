/**
 * Chat Integration Contract (Frontend-only)
 */

/**
 * Widget Script URL
 */
const API_ORIGIN =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_CHAT_API_URL ||
  process.env.REACT_APP_AI_SERVICE;

export const WIDGET_SCRIPT_BASE_URL =
  process.env.REACT_APP_WIDGET_SCRIPT_URL ||
  (API_ORIGIN
    ? `${String(API_ORIGIN).replace(/\/+$/, '')}/widget.js`
    : 'https://our-app.com/widget.js');

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  INTEGRATIONS: 'chat_integrations_v1',
  AGENTS: 'chat_integration_agents_v1',
};

/**
 * Types (JSDoc)
 * @typedef {Object} Agent
 * @property {string} id
 * @property {string} name
 * @property {string=} type
 */

/**
 *  Demo agents
 */
export const DEFAULT_AGENTS = [
  { id: 'agent_sales', name: 'Sales Bot' },
  { id: 'agent_support', name: 'Support Bot' },
  { id: 'agent_hr', name: 'HR Assistant' },
];

/**
 * Create embed snippet from embedId
 * @param {string} embedId
 * @returns {string}
 */
export const buildEmbedSnippet = (embedId) => {
  const safeId = String(embedId || '').trim();
  return `<script src="${WIDGET_SCRIPT_BASE_URL}?id=${encodeURIComponent(
    safeId
  )}"></script>`;
};

/**
 * Normalize domain input:
 * @param {string} raw
 * @returns {string}
 */
export const normalizeDomain = (raw) => {
  if (!raw) return '';
  let d = String(raw).trim().toLowerCase();

  d = d.replace(/^https?:\/\//, '');
  d = d.replace(/\/+$/, '');
  return d;
};

/**
 * Simple domain validation for UI (not security-grade)
 * @param {string} domain
 * @returns {{ok: boolean, message?: string, normalized?: string}}
 */
export const validateDomain = (domain) => {
  const d = normalizeDomain(domain);

  if (!d) return { ok: false, message: 'دامنه را وارد کنید.' };
  if (/\s/.test(d))
    return { ok: false, message: 'دامنه نباید فاصله داشته باشد.' };
  if (/[/?#]/.test(d))
    return {
      ok: false,
      message: 'فقط دامنه را وارد کنید (بدون مسیر/Query).',
    };

  if (/^localhost(:\d{2,5})?$/.test(d)) return { ok: true, normalized: d };

  const basicDomainRegex =
    /^(?=.{1,253}$)([a-z0-9-]+\.)+[a-z]{2,63}(:\d{2,5})?$/i;

  if (!basicDomainRegex.test(d))
    return {
      ok: false,
      message: 'فرمت دامنه معتبر نیست. مثال: example.com',
    };

  return { ok: true, normalized: d };
};

/**
 * ID helpers
 */
const safeUUID = () => {
  try {
    if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
  } catch (_) {}
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
};

export const makeIntegrationId = () => `int_${safeUUID().replace(/-/g, '')}`;

export const makeEmbedId = () => `emb_${safeUUID().replace(/-/g, '')}`;

/**
 * Factory: create a new integration object (contract-safe)
 * @param {{domain: string, agent: Agent}} params
 * @returns {ChatIntegration}
 */
export const makeNewIntegration = ({ domain, agent }) => {
  const now = new Date().toISOString();
  const normalizedDomain = normalizeDomain(domain);

  return {
    id: makeIntegrationId(),
    domain: normalizedDomain,
    agentId: agent.id,
    agentName: agent.name,
    embedId: makeEmbedId(),
    createdAt: now,
    updatedAt: now,
    isPublic: false,
  };
};
