import React, { useState, useEffect, useMemo } from 'react';
import { buildEmbedSnippet } from './Contract';
import {
  listAgents,
  listIntegrations,
  createIntegration,
  deleteIntegration,
  updateIntegration,
} from './IntegrationsStore';

import { notify } from '../../components/ui/toast';
import { confirm } from '../../components/ui/alert/confirmation';
import { Sppiner } from '../../components/ui/sppiner';
import IntegrationForm from '../../components/integration/IntegrationForm';
import EmbedSnippet from '../../components/integration/EmbedSnippet';
import IntegrationsList from '../../components/integration/IntegrationsList';
import WidgetPreview from '../../components/integration/WidgetPreview';
import EditIntegrationModal from '../../components/integration/EditIntegrationModal';

/**
 * Chat Integrations Management Page
 */
const ChatIntegrationsPage = () => {
  /**
   * Local State
   */
  const [agents, setAgents] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const selectedSnippet = useMemo(
    () => (selected?.embedId ? buildEmbedSnippet(selected.embedId) : ''),
    [selected]
  );

  /**
   * Load Data
   */
  const refresh = async () => {
    setLoading(true);
    try {
      const [a, ints] = await Promise.all([listAgents(), listIntegrations()]);
      setAgents(a);
      setIntegrations(ints);
      if (selected?.id) setSelected(ints.find(x => x.id === selected.id) || null);
    } catch {
      notify.error('خطا در بارگذاری اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  /**
   * Create Handler
   * @param {object} param
   * @param {string} param.domain
   * @param {string} param.agentId
   */
  const handleCreate = async ({ domain, agentId }) => {
    setLoading(true);
    setFieldErrors({});
    try {
      const created = await createIntegration({ domain, agentId });
      await refresh();
      setSelected(created);
      notify.success('یکپارچه‌سازی‌ با موفقیت ساخته شد');
    } catch (err) {
      notify.error(err.message || 'خطا در ساخت یکپارچه‌سازی‌');
      if (err.fieldErrors) setFieldErrors(err.fieldErrors);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete Handler
   * @param {string} id
   */
  const handleDelete = (id) => {
    confirm({
      title: 'حذف یکپارچه‌سازی‌',
      text: 'آیا مطمئن هستید که می‌خواهید این یکپارچه‌سازی‌ را حذف کنید؟ این عمل قابل بازگشت نیست.',
      onConfirm: async () => {
        setIntegrations(prev => prev.filter(i => i.id !== id));
        if (selected?.id === id) setSelected(null);
        try {
          await deleteIntegration(id);
          notify.success('یکپارچه‌سازی‌ با موفقیت حذف شد');
        } catch {
          notify.error('خطا در حذف یکپارچه‌سازی‌');
          await refresh();
        }
      },
    });
  };

  /**
   * Toggle Public/Private Status
   */
  const handleTogglePublic = async () => {
    if (!selected) return;
    const newPublic = !selected.isPublic;

    setSelected(prev => ({ ...prev, isPublic: newPublic }));
    setIntegrations(prev => prev.map(i => (i.id === selected.id ? { ...i, isPublic: newPublic } : i)));

    try {
      await updateIntegration(selected.id, { isPublic: newPublic });
      notify.success(`یکپارچه‌سازی‌ اکنون ${newPublic ? 'عمومی' : 'خصوصی'} شد`);
    } catch {
      notify.error('خطا در تغییر وضعیت');
      await refresh();
    }
  };

  /**
   * Edit Modal Controls
   */
  const openEdit = (item) => {
    setEditTarget(item);
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditTarget(null);
    setFieldErrors({});
  };

  /**
   * Edit Save Handler
   * @param {object} param
   * @param {string} param.domain
   * @param {string} param.agentId
   */
  const handleEditSave = async ({ domain, agentId }) => {
    setLoading(true);
    setFieldErrors({});
    try {
      const updated = await updateIntegration(editTarget.id, { domain, agentId });
      await refresh();
      setSelected(updated);
      closeEdit();
      notify.success('یکپارچه‌سازی با موفقیت ویرایش شد');
    } catch (err) {
      notify.error(err.message || 'خطا در ویرایش یکپارچه‌سازی‌');
      if (err.fieldErrors) setFieldErrors(err.fieldErrors);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Main Render
   */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-4 py-3 text-white rounded-2xl shadow-md">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur">
              <span className="text-xl">🧩</span>
            </div>
            <h3 className="text-xl font-bold">یکپارچه‌سازی‌های چت</h3>
          </div>
          <div className="flex items-center gap-2">
            {loading && <Sppiner size={14} className="text-white" />}
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-sm font-medium">
              {integrations.length} یکپارچه‌سازی‌
            </span>
            {selected && (
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${selected.isPublic ? 'bg-green-500/30' : 'bg-gray-500/30'}`}>
                {selected.isPublic ? 'Public' : 'Private'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 md:p-3">
        {/* Security Note */}
        <div className="max-w-screen-2xl mx-auto mb-3">
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 shadow-sm">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-lg">⚠️</div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-lg font-bold text-amber-900 dark:text-amber-200">نکته امنیتی</h4>
                  <span className="inline-flex items-center rounded-full border border-amber-300/60 dark:border-amber-700 px-2.5 py-0.5 text-sm font-semibold text-amber-900 dark:text-amber-200 bg-white/40 dark:bg-black/10">
                    Domain / CORS
                  </span>
                </div>
                <p className="mt-1 text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                  دامنه باید تأیید و در لیست مجاز باشد؛ در غیر اینصورت ممکن است ویجت درست بارگذاری نشود.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="max-w-screen-2xl mx-auto grid lg:grid-cols-2 gap-3">
          {/* Create Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-indigo-200 dark:border-indigo-900">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-white">
              <h4 className="text-lg font-bold">یکپارچه‌سازی‌ جدید</h4>
            </div>
            <div className="p-3">
              <IntegrationForm agents={agents} loading={loading} fieldErrors={fieldErrors} onSubmit={handleCreate} />
              {selectedSnippet && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <h5 className="text-sm font-semibold mb-2 text-indigo-700 dark:text-indigo-300">Embed Snippet</h5>
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-2 border border-indigo-200 dark:border-indigo-800 text-xs">
                    <EmbedSnippet snippet={selectedSnippet} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-teal-200 dark:border-teal-900">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-3 py-2 text-white flex justify-between items-center">
              <h4 className="text-lg font-bold">پیش‌نمایش ویجت</h4>
              {selected && (
                <div className="flex gap-1.5">
                  <button onClick={handleTogglePublic} disabled={loading} className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-60 text-xs font-medium transition">
                    {selected.isPublic ? 'خصوصی' : 'عمومی'}
                  </button>
                  <button onClick={() => openEdit(selected)} className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-medium transition">
                    ویرایش
                  </button>
                </div>
              )}
            </div>
            <div className="p-3">
              {selected ? (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-teal-300/70 dark:border-teal-700 overflow-hidden shadow-inner">
                  <div className="p-2 bg-white dark:bg-gray-950">
                    <WidgetPreview embedId={selected.embedId} />
                  </div>
                </div>
              ) : (
                <div className="h-[clamp(120px,18vh,180px)] flex items-center justify-center text-center">
                  <div>
                    <div className="text-3xl mb-1">✨</div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      یک یکپارچه‌سازی‌ از لیست انتخاب کنید
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="mt-4 max-w-screen-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-orange-200 dark:border-orange-900">
            <div className="bg-gradient-to-r from-orange-600 to-pink-600 px-3 py-2 text-white">
              <h4 className="text-lg font-bold">لیست یکپارچه‌سازی‌ها</h4>
            </div>
            <div className="p-3">
              {integrations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    هنوز هیچ یکپارچه‌سازی‌ای ایجاد نشده است.
                  </p>
                </div>
              ) : (
                <IntegrationsList
                  items={integrations}
                  selectedId={selected?.id}
                  onSelect={setSelected}
                  onDelete={handleDelete}
                  onEdit={openEdit}
                  loading={loading}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <EditIntegrationModal
        open={editOpen}
        onClose={closeEdit}
        onSave={handleEditSave}
        agents={agents}
        initial={editTarget}
        loading={loading}
        fieldErrors={fieldErrors}
      />
    </div>
  );
};

export default ChatIntegrationsPage;