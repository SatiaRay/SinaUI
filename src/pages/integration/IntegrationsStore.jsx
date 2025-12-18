import {
  STORAGE_KEYS,
  DEFAULT_AGENTS,
  validateDomain,
  makeNewIntegration,
} from './Contract';

/** 
 * LocalStorage helpers
 */ 
const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('localStorage read error:', key, e);
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage write error:', key, e);
  }
};

const nowISO = () => new Date().toISOString();

/** 
 * Seed (first run)
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
 * Agents
 */ 
export const listAgents = async () => {
  seedIfEmpty();
  return readJSON(STORAGE_KEYS.AGENTS, DEFAULT_AGENTS);
};

/** 
 * Integrations CRUD
 */ 
export const listIntegrations = async () => {
  seedIfEmpty();
  const items = readJSON(STORAGE_KEYS.INTEGRATIONS, []);
  return [...items].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
};

export const getIntegrationById = async (id) => {
  const items = await listIntegrations();
  return items.find((x) => x.id === id) || null;
};

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
    const err = new Error('Agent معتبر انتخاب نشده است.');
    err.code = 'VALIDATION_ERROR';
    err.fieldErrors = { agentId: ['Agent معتبر انتخاب نشده است.'] };
    throw err;
  }

  const integrations = readJSON(STORAGE_KEYS.INTEGRATIONS, []);
  const normalized = domainCheck.normalized;

  if (integrations.some((x) => x.domain === normalized && x.agentId === agentId)) {
    const err = new Error('برای این دامنه و Agent قبلاً یک یکپارچه‌سازی‌ ساخته شده است.');
    err.code = 'DUPLICATE';
    err.fieldErrors = { domain: ['Duplicate integration'] };
    throw err;
  }

  const newItem = makeNewIntegration({ domain: normalized, agent });
  writeJSON(STORAGE_KEYS.INTEGRATIONS, [newItem, ...integrations]);
  return newItem;
};

export const updateIntegration = async (id, patch) => {
  seedIfEmpty();
  const integrations = readJSON(STORAGE_KEYS.INTEGRATIONS, []);
  const idx = integrations.findIndex((x) => x.id === id);

  if (idx === -1) {
    const err = new Error('یکپارچه‌سازی‌ پیدا نشد.');
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
      const err = new Error('Agent معتبر انتخاب نشده است.');
      err.code = 'VALIDATION_ERROR';
      err.fieldErrors = { agentId: ['Agent معتبر انتخاب نشده است.'] };
      throw err;
    }
    updated.agentId = agent.id;
    updated.agentName = agent.name;
  }

  if (typeof patch.isPublic === 'boolean') {
    updated.isPublic = patch.isPublic;
  }

  updated.updatedAt = nowISO();

  const next = [...integrations];
  next[idx] = updated;
  writeJSON(STORAGE_KEYS.INTEGRATIONS, next);
  return updated;
};

export const deleteIntegration = async (id) => {
  seedIfEmpty();
  const integrations = readJSON(STORAGE_KEYS.INTEGRATIONS, []);
  writeJSON(STORAGE_KEYS.INTEGRATIONS, integrations.filter((x) => x.id !== id));
  return { success: true };
};

export const clearAllIntegrations = async () => {
  writeJSON(STORAGE_KEYS.INTEGRATIONS, []);
  return { success: true };
};