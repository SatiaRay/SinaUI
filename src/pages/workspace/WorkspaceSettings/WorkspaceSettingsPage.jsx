import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TABS, OverviewSection, MembersSection, BillingPlaceholder, DangerZonePlaceholder } from './Sections';
import { MOCK_WORKSPACES, MOCK_MEMBERS } from '../mock';

/**
 * WorkspaceSettingsPage – workspace settings with tabs
 */
const WorkspaceSettingsPage = () => {
  const { workspaceId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  /**
   * Workspace data (mock for now)
   */
  const workspace = useMemo(
    () => MOCK_WORKSPACES.find((w) => w.id === workspaceId),
    [workspaceId]
  );

  /**
   * Workspace members (mock for now)
   */
  const members = useMemo(
    () => MOCK_MEMBERS[workspaceId] || [],
    [workspaceId]
  );

  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      {/* Header */}
      <div className="mx-3 md:mx-0 md:mb-3 pb-4 pt-3 md:pt-0 border-b border-gray-600 flex flex-col gap-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            تنظیمات فضای کاری {workspace.name}
          </h3>

          {/* Back to list */}
          <Link
            to="/workspaces"
            className="px-4 py-2 rounded-lg font-medium transition-all
                       bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            لیست فضاهای کاری
          </Link>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
          <span
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full
                       bg-blue-50 text-blue-700 border border-blue-100
                       dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800/50"
          >
            پلن:
            <span className="font-bold uppercase">{workspace.plan}</span>
          </span>

          <span
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full
                       bg-gray-50 text-gray-700 border border-gray-200
                       dark:bg-gray-700/40 dark:text-gray-200 dark:border-gray-600"
          >
            تاریخ ایجاد:
            <span className="font-bold">{workspace.created_at}</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-3 md:px-0 mt-4">
        <div
          className="
            flex gap-2 border-b border-gray-200 dark:border-gray-700
            overflow-x-auto scrollbar-hide
          "
        >
          {TABS.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`
                  px-4 py-2 text-sm md:text-base font-medium rounded-t-lg whitespace-nowrap
                  transition-colors
                  ${isActive
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'}
                `}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-4">
          {activeTab === 'overview' && <OverviewSection workspace={workspace} />}
          {activeTab === 'members' && (
            <MembersSection
              members={members}
              workspace={workspace}
              setMembers={() => {}}
            />
          )}
          {activeTab === 'billing' && <BillingPlaceholder />}
          {activeTab === 'danger' && <DangerZonePlaceholder />}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettingsPage;