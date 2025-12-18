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
      notify.success('Integration با موفقیت ساخته شد');
    } catch (err) {
      notify.error(err.message || 'خطا در ساخت Integration');

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
      title: 'حذف Integration',
      text: 'آیا مطمئن هستید که می‌خواهید این Integration را حذف کنید؟ این عمل قابل بازگشت نیست.',
      onConfirm: async () => {
        setIntegrations((prev) => prev.filter((i) => i.id !== id));
        if (selected?.id === id) setSelected(null);

        try {
          await deleteIntegration(id);
          notify.success('Integration با موفقیت حذف شد');
        } catch {
          notify.error('خطا در حذف Integration');
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
      notify.success(`Integration اکنون ${newPublic ? 'عمومی' : 'خصوصی'} شد`);
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
      notify.success('Integration با موفقیت ویرایش شد');
    } catch (err) {
      notify.error(err.message || 'خطا در ویرایش Integration');

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
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-6 py-5 text-white rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur">
              <span className="text-3xl">🧩</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold">Chat Integrations</h3>
              <p className="text-base opacity-90 mt-1">
                دامنه + Agent → ویجت چت embed شده
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {loading && <Sppiner size={18} className="text-white" />}
            <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur text-base font-medium">
              {integrations.length} Integration
            </span>
            {selected && (
              <span className={`px-4 py-2 rounded-full font-medium text-sm ${selected.isPublic ? 'bg-green-500/30' : 'bg-gray-500/30'}`}>
                {selected.isPublic ? 'Public' : 'Private'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-indigo-200 dark:border-indigo-900">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
              <h4 className="text-xl font-bold">ساخت Integration جدید</h4>
            </div>
            <div className="p-6">
              <IntegrationForm
                agents={agents}
                loading={loading}
                fieldErrors={fieldErrors}
                onSubmit={handleCreate}
              />
              {selectedSnippet && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h5 className="text-lg font-semibold mb-3 text-indigo-700 dark:text-indigo-300">
                    Embed Snippet
                  </h5>
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
                    <EmbedSnippet snippet={selectedSnippet} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-teal-200 dark:border-teal-900">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4 text-white flex justify-between items-center">
              <h4 className="text-xl font-bold">پیش‌نمایش ویجت</h4>
              {selected && (
                <div className="flex gap-3">
                  <button
                    onClick={handleTogglePublic}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-60 font-medium transition"
                  >
                    {selected.isPublic ? 'خصوصی کن' : 'عمومی کن'}
                  </button>
                  <button
                    onClick={() => openEdit(selected)}
                    className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 font-medium transition"
                  >
                    ویرایش
                  </button>
                </div>
              )}
            </div>
            <div className="p-6">
              {selected ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'دامنه', value: selected.domain },
                      { label: 'Agent', value: selected.agentName },
                      { label: 'Embed ID', value: selected.embedId },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 p-4 rounded-xl border border-teal-200 dark:border-teal-800"
                      >
                        <div className="text-sm text-teal-700 dark:text-teal-300">{item.label}</div>
                        <div className="font-bold mt-1 break-all">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="h-96 bg-gray-50 dark:bg-gray-900 rounded-xl border-4 border-teal-300 dark:border-teal-700 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-teal-200 to-cyan-200 dark:from-teal-800 dark:to-cyan-800 px-5 py-3 font-bold text-teal-900 dark:text-teal-100">
                      Live Preview
                    </div>
                    <div className="h-full p-3 bg-white dark:bg-gray-950">
                      <WidgetPreview embedId={selected.embedId} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center text-center">
                  <div>
                    <div className="text-6xl mb-4">✨</div>
                    <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                      یک Integration از لیست انتخاب کنید
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-orange-200 dark:border-orange-900">
            <div className="bg-gradient-to-r from-orange-600 to-pink-600 px-6 py-4 text-white">
              <h4 className="text-xl font-bold">لیست Integrationهای موجود</h4>
            </div>
            <div className="p-6">
              {integrations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    هنوز هیچ Integrationی ساخته نشده است.
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