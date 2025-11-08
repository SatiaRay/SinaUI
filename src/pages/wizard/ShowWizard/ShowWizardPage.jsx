'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CreateWizardPage from '../CreateWizard/CreateWizardPage';
import UpdateWizardPage from '../UpdateWizard/UpdateWizardPage';
import {
  useGetWizardQuery,
  useDeleteWizardMutation,
  useToggleStatusWizardMutation,
} from '../../../store/api/AiApi';
import wizardApi from '../../../store/api/AiApi';
import ShowWizardLoading from './ShowWizardLoading';
import Error from './Error';

const ShowWizard = ({ wizard, onWizardSelect }) => {
  /**
   * Fetch wizard data by ID
   */
  const { data, isLoading, isError, error, isSuccess, refetch } =
    useGetWizardQuery(
      { id: wizard?.id, enableOnly: true },
      { skip: !wizard?.id }
    );

  const [deleteWizard] = useDeleteWizardMutation();
  const [toggleStatusWizard] = useToggleStatusWizardMutation();
  const dispatch = useDispatch();

  /**
   * Local cache
   */
  const [cachedWizard, setCachedWizard] = useState(null);

  useEffect(() => {
    if (isSuccess && data) {
      setCachedWizard(data);
    }
  }, [isSuccess, data]);

  const wizardData = cachedWizard ?? data;

  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setDelayedLoading(true);
    } else {
      const timer = setTimeout(() => setDelayedLoading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  /**
   * UI-only states
   */
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [selectedWizardForEdit, setSelectedWizardForEdit] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});

  /**
   * Handle navigation back to parent wizard
   */
  const handleBackClick = () => {
    if (wizardData?.parent_id) {
      onWizardSelect({ id: wizardData.parent_id });
    } else {
      onWizardSelect(null);
    }
  };

  /**
   * Handle navigation to selected child wizard
   */
  const handleChildClick = (childWizard) => {
    onWizardSelect(childWizard);
  };

  /**
   * Update wizard cache using RTK Query updateQueryData
   */
  const updateWizardCache = (updater) => {
    if (!wizard?.id) return;
    dispatch(
      wizardApi.util.updateQueryData(
        'getWizard',
        { id: wizard.id, enableOnly: true },
        (draft) => {
          updater(draft);
        }
      )
    );
    setCachedWizard((prev) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      updater(clone);
      return clone;
    });
  };

  /**
   * Add a new child wizard to cache
   */
  const addNewChild = (child) => {
    updateWizardCache((draft) => {
      draft.children = Array.isArray(draft.children) ? draft.children : [];
      draft.children.push(child);
    });
  };

  /**
   * Update a child wizard in cache
   */
  const handleWizardUpdated = (updatedWizard) => {
    updateWizardCache((draft) => {
      draft.children = (draft.children || []).map((c) =>
        c.id === updatedWizard.id ? { ...c, ...updatedWizard } : c
      );
    });
  };

  /**
   * Handle delete wizard with optimistic cache update
   */
  const handleDeleteWizard = async (wizardId) => {
    try {
      await deleteWizard(wizardId).unwrap();
      updateWizardCache((draft) => {
        draft.children = (draft.children || []).filter(
          (c) => c.id !== wizardId
        );
      });
    } catch (err) {
      console.error('Error deleting wizard:', err);
      alert('خطا در حذف ویزارد');
    }
  };

  /**
   * Handle toggle wizard status with optimistic update
   */
  const toggleWizardStatus = async (wizardId, currentStatus) => {
    setUpdatingStatus((prev) => ({ ...prev, [wizardId]: true }));
    try {
      await toggleStatusWizard({
        wizardId,
        endpoint: currentStatus ? 'disable' : 'enable',
      }).unwrap();
      updateWizardCache((draft) => {
        draft.children = (draft.children || []).map((c) =>
          c.id === wizardId ? { ...c, enabled: !c.enabled } : c
        );
      });
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || 'خطا در تغییر وضعیت ویزارد');
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [wizardId]: false }));
    }
  };

  /**
   * Render loading state
   */
  if ((isLoading || delayedLoading) && !cachedWizard) {
    return <ShowWizardLoading />;
  }

  /**
   * Render error state
   */
  if (isError) {
    return (
      <div>
        <Error
          message={error?.data?.message || 'خطا در دریافت ویزارد'}
          reset={() => {
            refetch();
          }}
        />
      </div>
    );
  }

  /**
   * Handle empty data case
   */
  if (!wizardData) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-4">
        ویزاردی یافت نشد
      </div>
    );
  }

  /**
   * Render wizard details and its children
   */
  return (
    <>
      {selectedWizardForEdit ? (
        <UpdateWizardPage
          wizard={selectedWizardForEdit}
          onClose={() => setSelectedWizardForEdit(null)}
          onWizardUpdated={handleWizardUpdated}
        />
      ) : showCreateWizard ? (
        <CreateWizardPage
          onWizardCreated={addNewChild}
          onClose={() => setShowCreateWizard(false)}
          parent_id={wizard.id}
        />
      ) : (
        <div className="space-y-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl dark:text-white font-semibold text-gray-800">
              {wizardData.title}
            </h2>
            <div className="flex gap-x-2">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setShowCreateWizard(true)}
              >
                ایجاد ویزارد فرزند جدید
              </button>
              <button
                onClick={handleBackClick}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2"
              >
                بازگشت
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div
              className="prose dark:prose-invert max-w-none text-gray-800 dark:text-white [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-700 dark:[&_a]:text-blue-400 dark:[&_a]:hover:text-blue-300 [&_span.katex]:text-current"
              dangerouslySetInnerHTML={{ __html: wizardData.context }}
            />
          </div>

          {wizardData.children && wizardData.children.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  زیر ویزاردها
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        عنوان
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        تاریخ ایجاد
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        وضعیت
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {wizardData.children.map((child) => (
                      <tr
                        key={child.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                          onClick={() => handleChildClick(child)}
                        >
                          {child.title}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                          onClick={() => handleChildClick(child)}
                        >
                          {new Date(child.created_at).toLocaleString('fa-IR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWizardStatus(child.id, child.enabled);
                            }}
                            disabled={!!updatingStatus[child.id]}
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors ${
                              child.enabled
                                ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                                : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {updatingStatus[child.id] ? (
                              <div className="flex items-center gap-1">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                                <span>در حال تغییر...</span>
                              </div>
                            ) : child.enabled ? (
                              'فعال'
                            ) : (
                              'غیرفعال'
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedWizardForEdit(child);
                              }}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              ویرایش
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteWizard(child.id);
                              }}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShowWizard;
