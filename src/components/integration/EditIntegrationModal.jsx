import React, { useEffect, useState } from 'react';
import { validateDomain } from '../../pages/integration/Contract';

export default function EditIntegrationModal({
  open,
  onClose,
  onSave,
  agents,
  initial,
  loading,
}) {
  const [domain, setDomain] = useState('');
  const [agentId, setAgentId] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setDomain(initial?.domain || '');
    setAgentId(initial?.agentId || '');
    setErrors({});
  }, [open, initial]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});

    const v = validateDomain(domain);
    if (!v.ok) {
      setErrors({ domain: [v.message] });
      return;
    }
    if (!agentId) {
      setErrors({ agentId: ['Agent را انتخاب کن.'] });
      return;
    }

    await onSave({ domain: v.normalized, agentId });
  };

  const inputBase =
    'w-full border rounded-md p-2 text-sm outline-none transition ' +
    'bg-white text-neutral-900 border-neutral-300 placeholder:text-neutral-400 ' +
    'focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ' +
    'dark:bg-gray-950 dark:text-neutral-100 dark:border-gray-700 dark:placeholder:text-neutral-500 ' +
    'dark:focus:ring-blue-400/30 dark:focus:border-blue-400 ' +
    'disabled:opacity-60 disabled:cursor-not-allowed';

  const labelText = 'text-sm text-neutral-800 dark:text-neutral-200';
  const helperErr = 'text-red-600 dark:text-red-400 text-xs';

  const btnBase =
    'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm transition ' +
    'disabled:opacity-60 disabled:cursor-not-allowed';

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl border border-neutral-200 dark:border-gray-800 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold text-neutral-900 dark:text-neutral-100">
            Edit Integration
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className={
              btnBase +
              ' w-9 h-9 p-0 rounded-full ' +
              'text-neutral-700 hover:bg-neutral-100 ' +
              'dark:text-neutral-200 dark:hover:bg-gray-800'
            }
            aria-label="Close"
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-3">
          <label className="grid gap-1">
            <span className={labelText}>Domain</span>
            <input
              className={inputBase}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={loading}
              placeholder="example.com"
              autoComplete="off"
            />
            {errors?.domain?.[0] ? (
              <span className={helperErr}>{errors.domain[0]}</span>
            ) : null}
          </label>

          <label className="grid gap-1">
            <span className={labelText}>AI Agent</span>
            <select
              className={inputBase}
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              disabled={loading}
            >
              <option value="">انتخاب کن…</option>
              {(agents || []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            {errors?.agentId?.[0] ? (
              <span className={helperErr}>{errors.agentId[0]}</span>
            ) : null}
          </label>

          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={
                btnBase +
                ' border border-neutral-300 text-neutral-800 hover:bg-neutral-50 ' +
                'dark:border-gray-700 dark:text-neutral-200 dark:hover:bg-gray-800'
              }
            >
              لفو
            </button>

            <button
              type="submit"
              disabled={loading}
              className={
                btnBase +
                ' bg-blue-600 text-white hover:bg-blue-700 ' +
                'dark:bg-blue-500 dark:hover:bg-blue-400'
              }
            >
              {loading ? 'Saving…' : 'ذخیره'}
            </button>
          </div>
        </form>

        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-3">
          نکته: embedId تغییر نمی‌کند؛ فقط domain/agent عوض می‌شود.
        </div>
      </div>
    </div>
  );
}
