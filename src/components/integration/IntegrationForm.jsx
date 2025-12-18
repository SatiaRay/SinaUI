import React, { useMemo, useState } from 'react';

export default function IntegrationForm({ agents, loading, fieldErrors, onSubmit }) {
  const [domain, setDomain] = useState('');
  const [agentId, setAgentId] = useState('');

  const agentOptions = useMemo(() => agents || [], [agents]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ domain, agentId });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Domain
        </label>
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          disabled={loading}
          className="
            w-full rounded-xl px-4 py-3
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            border border-gray-300 dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/40
            disabled:opacity-60
          "
        />
        {fieldErrors?.domain?.[0] ? (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {fieldErrors.domain[0]}
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          AI Agent
        </label>
        <select
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          disabled={loading}
          className="
            w-full rounded-xl px-4 py-3
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            border border-gray-300 dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/40
            disabled:opacity-60
          "
        >
          <option value="">انتخاب کن…</option>
          {agentOptions.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        {fieldErrors?.agentId?.[0] ? (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {fieldErrors.agentId[0]}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          w-full rounded-xl px-4 py-3 font-semibold
          bg-gradient-to-r from-indigo-600 to-purple-600
          text-white shadow-md
          hover:opacity-95 active:opacity-90
          disabled:opacity-60 disabled:cursor-not-allowed
          transition
        "
      >
        {loading ? 'Generating…' : 'Generate Embed Link'}
      </button>
    </form>
  );
}
