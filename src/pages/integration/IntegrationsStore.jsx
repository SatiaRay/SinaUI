import {
  STORAGE_KEYS,
  DEFAULT_AGENTS,
  validateDomain,
  makeNewIntegration,
} from './Contract';

/**
 * LocalStorage Helpers
 */
const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    console.error('localStorage read error:', key);
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('localStorage write error:', key);
  }
};

const nowISO = () => new Date().toISOString();

/**
 * Seed Initial Data
 * Populates default agents and empty integrations on first run
 */
const seedIfEmpty = () => {
  if (!readJSON(STORAGE_KEYS.AGENTS, null)?.length) {
    writeJSON(STORAGE_KEYS.AGENTS, DEFAULT_AGENTS);
  }
  if (!Array.isArray(readJSON(STORAGE_KEYS.INTEGRATIONS, null))) {
    writeJSON(STORAGE_KEYS.INTEGRATIONS, []);
  }
};

seedIfEmpty();

/**
 * List Agents
 * @return {Promise<Array>} Available agents
 */
export const listAgents = async () => {
  seedIfEmpty();
  return readJSON(STORAGE_KEYS.AGENTS, DEFAULT_AGENTS);
};

/**
 * List Integrations
 * @return {Promise<Array>} Integrations sorted newest first
 */
export const listIntegrations = async () => {
  seedIfEmpty();
  const items = readJSON(STORAGE_KEYS.INTEGRATIONS, []);
  return [...items].sort((a, b) =>
    (b.createdAt || '').localeCompare(a.createdAt || '')
  );
};

/**
 * Get Integration by ID
 * @param {string} id - Integration ID
 * @return {Promise<object|null>} Matching integration or null
 */
export const getIntegrationById = async (id) => {
  const items = await listIntegrations();
  return items.find((x) => x.id === id) || null;
};

/**
 * Create New Integration
 * @param {object} param
 * @param {string} param.domain - Target domain
 * @param {string} param.agentId - Agent ID
 * @return {Promise<object>}
 */
export const createIntegration = async ({ domain, agentId }) => {
  seedIfEmpty();

  const domainCheck = validateDomain(domain);
  if (!domainCheck.ok) {
    const err = new Error(domainCheck.message || 'Invalid domain');
    err.code = 'VALIDATION_ERROR';
    err.fieldErrors = { domain: [domainCheck.message] };
    throw err;
  }

  const agents = await listAgents();
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) {
    const err = new Error('Valid agent not selected.');
    err.code = 'VALIDATION_ERROR';
    err.fieldErrors = { agentId: ['Valid agent not selected.'] };
    throw err;
  }

  const integrations = readJSON(STORAGE_KEYS.INTEGRATIONS, []);
  const normalized = domainCheck.normalized;

  if (
    integrations.some((x) => x.domain === normalized && x.agentId === agentId)
  ) {
    const err = new Error(
      'An integration already exists for this domain and agent.'
    );
    err.code = 'DUPLICATE';
    err.fieldErrors = { domain: ['Duplicate integration'] };
    throw err;
  }

  const newItem = makeNewIntegration({ domain: normalized, agent });
  writeJSON(STORAGE_KEYS.INTEGRATIONS, [newItem, ...integrations]);
  return newItem;
};

/**
 * Update Existing Integration
 * @param {string} id - Integration ID
 * @param {object} patch - Partial update fields
 * @return {Promise<object>}
 */
export const updateIntegration = async (id, patch) => {
  seedIfEmpty();
  const integrations = readJSON(STORAGE_KEYS.INTEGRATIONS, []);
  const idx = integrations.findIndex((x) => x.id === id);

  if (idx === -1) {
    const err = new Error('Integration not found.');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const updated = { ...integrations[idx] };

  if (patch.domain != null) {
    const domainCheck = validateDomain(patch.domain);
    if (!domainCheck.ok) {
      const err = new Error(domainCheck.message || 'Invalid domain');
      err.code = 'VALIDATION_ERROR';
      err.fieldErrors = { domain: [domainCheck.message] };
      throw err;
    }
    updated.domain = domainCheck.normalized;
  }

  if (patch.agentId != null) {
    const agents = await listAgents();
    const agent = agents.find((a) => a.id === patch.agentId);
    if (!agent) {
      const err = new Error('Valid agent not selected.');
      err.code = 'VALIDATION_ERROR';
      err.fieldErrors = { agentId: ['Valid agent not selected.'] };
      throw err;
    }
    updated.agentId = agent.id;
    updated.agentName = agent.name;
  }

  if (typeof patch.isPublic === 'boolean') {
    updated.isPublic = patch.isPublic;
  }

  updated.updatedAt = nowISO();

  integrations[idx] = updated;
  writeJSON(STORAGE_KEYS.INTEGRATIONS, integrations);
  return updated;
};

/**
 * Delete Integration
 * @param {string} id - Integration ID
 * @return {Promise<object>}
 */
export const deleteIntegration = async (id) => {
  seedIfEmpty();
  const integrations = readJSON(STORAGE_KEYS.INTEGRATIONS, []);
  writeJSON(
    STORAGE_KEYS.INTEGRATIONS,
    integrations.filter((x) => x.id !== id)
  );
  return { success: true };
};

/**
 * Clear All Integrations
 * @return {Promise<object>}
 */
export const clearAllIntegrations = async () => {
  writeJSON(STORAGE_KEYS.INTEGRATIONS, []);
  return { success: true };
};
