import React, { useState, useEffect, useMemo } from 'react';
import { buildEmbedSnippet, validateDomain } from './Contract';
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

      if (selected?.id) {
        setSelected(ints.find((x) => x.id === selected.id) || null);
      }
    } catch (err) {
      notify.error('خطا در بارگذاری اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  /**
  * Create Handler
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

      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
  * Delete Handler 
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
  * Toggle Public/Private 
  */
  const handleTogglePublic = async () => {
    if (!selected) return;

    const newPublic = !selected.isPublic;

    setSelected((prev) => ({ ...prev, isPublic: newPublic }));
    setIntegrations((prev) =>
      prev.map((i) => (i.id === selected.id ? { ...i, isPublic: newPublic } : i))
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
  * Edit Modal
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

      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
  * Main Render
  */
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-4 py-4 text-white rounded-b-3xl shadow-md">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur">
              <span className="text-2xl">🧩</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">یکپارچه‌سازی‌های چت</h3>
              <p className="text-sm opacity-90">دامنه + Agent → ویجت چت embed شده</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {loading && <Sppiner size={16} className="text-white" />}
            <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-sm font-medium">
              {integrations.length} یکپارچه‌سازی‌
            </span>
            {selected && (
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${selected.isPublic ? 'bg-green-500/30' : 'bg-gray-500/30'}`}>
                {selected.isPublic ? 'Public' : 'Private'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4">
        <div className="max-w-screen-2xl mx-auto grid lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-indigo-200 dark:border-indigo-900">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-white">
              <h4 className="text-lg font-bold">یکپارچه‌سازی‌ جدید</h4>
            </div>
            <div className="p-4 md:p-5">
              <IntegrationForm
                agents={agents}
                loading={loading}
                fieldErrors={fieldErrors}
                onSubmit={handleCreate}
              />
              {selectedSnippet && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h5 className="text-base font-semibold mb-2 text-indigo-700 dark:text-indigo-300">
                    Embed Snippet
                  </h5>
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800 text-xs">
                    <EmbedSnippet snippet={selectedSnippet} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-teal-200 dark:border-teal-900">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3 text-white flex justify-between items-center">
              <h4 className="text-lg font-bold">پیش‌نمایش ویجت</h4>
              {selected && (
                <div className="flex gap-2">
                  <button
                    onClick={handleTogglePublic}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-60 text-sm font-medium transition"
                  >
                    {selected.isPublic ? 'خصوصی' : 'عمومی'}
                  </button>
                  <button
                    onClick={() => openEdit(selected)}
                    className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-medium transition"
                  >
                    ویرایش
                  </button>
                </div>
              )}
            </div>
            <div className="p-4 md:p-5">
              {selected ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Domain', value: selected.domain },
                      { label: 'Agent', value: selected.agentName },
                      { label: 'Embed ID', value: selected.embedId },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 p-3 rounded-lg border border-teal-200 dark:border-teal-800"
                      >
                        <div className="text-xs text-teal-700 dark:text-teal-300">{item.label}</div>
                        <div className="font-semibold text-sm mt-1 break-all">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="h-80 md:h-96 bg-gray-50 dark:bg-gray-900 rounded-lg border-3 border-teal-300 dark:border-teal-700 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-teal-200 to-cyan-200 dark:from-teal-800 dark:to-cyan-800 px-4 py-2 text-sm font-bold text-teal-900 dark:text-teal-100">
                      Live Preview
                    </div>
                    <div className="h-full p-2 bg-white dark:bg-gray-950">
                      <WidgetPreview embedId={selected.embedId} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-80 md:h-96 flex items-center justify-center text-center">
                  <div>
                    <div className="text-5xl mb-3">✨</div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      یک یکپارچه‌سازی‌ از لیست انتخاب کنید
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 max-w-screen-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-orange-200 dark:border-orange-900">
            <div className="bg-gradient-to-r from-orange-600 to-pink-600 px-4 py-3 text-white">
              <h4 className="text-lg font-bold">لیست یکپارچه‌سازی‌های موجود</h4>
            </div>
            <div className="p-4 md:p-5">
              {integrations.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3">📭</div>
                  <p className="text-base text-gray-600 dark:text-gray-400">
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