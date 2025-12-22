import React, { useState, useEffect, useMemo } from 'react';
import { buildEmbedSnippet } from '../Contract';
import {
  listAgents,
  listIntegrations,
  createIntegration,
  deleteIntegration,
  updateIntegration,
} from '../IntegrationsStore';

import { notify } from '../../../components/ui/toast';
import { confirm } from '../../../components/ui/alert/confirmation';
import { Sppiner } from '../../../components/ui/sppiner';

import IntegrationForm from '../../../components/integration/IntegrationForm';
import EmbedSnippet from '../../../components/integration/EmbedSnippet';
import IntegrationsList from '../../../components/integration/IntegrationsList';
import WidgetPreview from '../../../components/integration/WidgetPreview';
import EditIntegrationModal from '../../../components/integration/EditIntegrationModal';

import { ChatIntegrationsLoading } from './IntegrationIndexLoading';

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
  const [initialLoading, setInitialLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const selectedSnippet = useMemo(
    () => (selected?.embedId ? buildEmbedSnippet(selected.embedId) : ''),
    [selected]
  );

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /**
   * Load Data
   */
  const refresh = async () => {
    setLoading(true);
    try {
      const [a, ints] = await Promise.all([listAgents(), listIntegrations()]);
      if (initialLoading) await sleep(300);

      setAgents(a);
      setIntegrations(ints);

      if (selected?.id) {
        setSelected(ints.find((x) => x.id === selected.id) || null);
      }
    } catch {
      notify.error('خطا در بارگذاری اطلاعات');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  /**
   * Show Skeleton only on first load
   */
  if (initialLoading) {
    return <ChatIntegrationsLoading />;
  }

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
        setIntegrations((prev) => prev.filter((i) => i.id !== id));
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

    setSelected((prev) => ({ ...prev, isPublic: newPublic }));
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === selected.id ? { ...i, isPublic: newPublic } : i
      )
    );

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
      const updated = await updateIntegration(editTarget.id, {
        domain,
        agentId,
      });
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-2 md:px-3 py-2 flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 mt-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                <span className="text-xl">🧩</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                یکپارچه‌سازی‌های چت
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {loading && <Sppiner size={14} />}
              <span className="px-3 py-1.5 rounded-full bg-gray-200 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                {integrations.length} یکپارچه‌سازی‌
              </span>
              {selected && (
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${selected.isPublic ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  {selected.isPublic ? 'Public' : 'Private'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pt-2">
          {/* Security Note */}
          <div className="mb-3">
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 shadow-sm">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 text-lg">⚠️</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-bold text-amber-900 dark:text-amber-200">
                      نکته امنیتی
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-800/50 border border-amber-300 dark:border-amber-700">
                      Domain / CORS
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                    دامنه باید تأیید و در لیست مجاز باشد؛ در غیر اینصورت ممکن است ویجت درست بارگذاری نشود.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-3">
            {/* Create Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2">
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  یکپارچه‌سازی‌ جدید
                </h4>
              </div>
              <div className="p-3">
                <IntegrationForm
                  agents={agents}
                  loading={loading}
                  fieldErrors={fieldErrors}
                  onSubmit={handleCreate}
                />
                {selectedSnippet && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Embed Snippet
                    </h5>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 border border-gray-200 dark:border-gray-700 text-xs">
                      <EmbedSnippet snippet={selectedSnippet} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 flex justify-between items-center">
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  پیش‌نمایش ویجت
                </h4>
                {selected && (
                  <div className="flex gap-1.5">
                    <button
                      onClick={handleTogglePublic}
                      disabled={loading}
                      className="px-2.5 py-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-60 text-xs"
                    >
                      {selected.isPublic ? 'خصوصی' : 'عمومی'}
                    </button>
                    <button
                      onClick={() => openEdit(selected)}
                      className="px-2.5 py-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-xs"
                    >
                      ویرایش
                    </button>
                  </div>
                )}
              </div>
              <div className="p-3">
                {selected ? (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
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
          <div className="mt-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2">
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  لیست یکپارچه‌سازی‌ها
                </h4>
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
    </div>
  );
};

export default ChatIntegrationsPage;