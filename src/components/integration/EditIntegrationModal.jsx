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

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl border border-neutral-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold">Edit Integration</div>
          <button onClick={onClose} disabled={loading}>✕</button>
        </div>

        <form onSubmit={submit} className="grid gap-3">
          <label className="grid gap-1 text-sm">
            <span>Domain</span>
            <input
              className="border rounded-md p-2"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={loading}
              placeholder="example.com"
            />
            {errors?.domain?.[0] ? (
              <span className="text-red-600 text-xs">{errors.domain[0]}</span>
            ) : null}
          </label>

          <label className="grid gap-1 text-sm">
            <span>AI Agent</span>
            <select
              className="border rounded-md p-2"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              disabled={loading}
            >
              <option value="">انتخاب کن…</option>
              {(agents || []).map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            {errors?.agentId?.[0] ? (
              <span className="text-red-600 text-xs">{errors.agentId[0]}</span>
            ) : null}
          </label>

          <div className="flex gap-2 justify-end mt-2">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>

        <div className="text-xs text-neutral-500 mt-3">
          نکته: embedId تغییر نمی‌کند؛ فقط domain/agent عوض می‌شود.
        </div>
      </div>
    </div>
  );
}