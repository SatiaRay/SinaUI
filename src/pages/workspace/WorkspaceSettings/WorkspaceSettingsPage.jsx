import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { notify } from '@components/ui/toast';
import { MOCK_WORKSPACES, MOCK_MEMBERS } from '../mock';
import {
  OverviewSection,
  MembersSection,
  BillingPlaceholder,
  DangerZonePlaceholder,
} from './Sections';

const TABS = [
  { key: 'overview', label: 'نمای کلی' },
  { key: 'members', label: 'اعضا' },
  { key: 'billing', label: 'صورتحساب' },
  { key: 'danger', label: 'بخش خطرناک' },
];

const WorkspaceSettingsPage = () => {
  /**
   * Hook: Read workspaceId from route
   */
  const { workspaceId } = useParams();

  /**
   * Hook: Programmatic navigation
   */
  const navigate = useNavigate();

  /**
   * Active tab state
   */
  const [activeTab, setActiveTab] = useState('overview');

  /**
   * Get current workspace from mock
   */
  const workspace = useMemo(
    () => MOCK_WORKSPACES.find((w) => w.id === workspaceId),
    [workspaceId]
  );

  /**
   * Get workspace members from mock
   */
  const members = useMemo(
    () => MOCK_MEMBERS[workspaceId] || [],
    [workspaceId]
  );

  /**
   * Is current user admin/owner
   */
  const isAdmin = workspace
    ? ['admin', 'owner'].includes(workspace.my_role)
    : false;

  /**
   * Handler: Invite member (mock)
   */
  const handleInvite = () => {
    Swal.fire({
      title: 'دعوت عضو',
      text: 'فعلاً فقط فرانت پیاده شده و API نداریم.',
      icon: 'info',
      confirmButtonText: 'باشه',
    });
  };

  /**
   * Handler: Change member role (mock)
   */
  const handleRoleChange = (id, role) => {
    notify.success(`نقش کاربر ${id} به ${role} تغییر کرد (Mock)`);
  };

  /**
   * Handler: Remove member (mock)
   */
  const handleRemove = (id) => {
    Swal.fire({
      title: 'حذف عضو',
      text: 'فعلاً عملیات حذف فقط نمایشی است.',
      icon: 'warning',
      confirmButtonText: 'باشه',
    });
  };

  /**
   * Access guard: Only members can view this page
   */
  if (!workspace) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-2">شما به این فضای کاری دسترسی ندارید.</p>
        <button
          onClick={() => navigate('/workspaces')}
          className="underline text-blue-500"
        >
          بازگشت به لیست فضاهای کاری
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      {/* Header */}
      <div className="mx-3 md:mx-0 md:mb-3 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div>
          <h3 className="text-xl md:text-2xl">
            تنظیمات فضای کاری {workspace.name}
          </h3>

          {/* plan + created */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs md:text-sm">
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full
                         bg-blue-50 text-blue-700 border border-blue-100
                         dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800/50"
            >
              پلن:
              <span className="font-semibold uppercase">{workspace.plan}</span>
            </span>

            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full
                         bg-gray-50 text-gray-700 border border-gray-200
                         dark:bg-gray-700/40 dark:text-gray-200 dark:border-gray-600"
            >
              تاریخ ایجاد:
              <span className="font-semibold">{workspace.created_at}</span>
            </span>
          </div>
        </div>

        {/* Back to list */}
        <Link
          to="/workspaces"
          className="pr-4 pl-3 py-2 md:py-3 rounded-lg font-medium transition-all
                     bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 self-start md:self-auto"
        >
          لیست فضاهای کاری
        </Link>
      </div>

      {/* Tabs */}
      <div className="px-3 md:px-0 mt-3">
        <div className="flex gap-2 border-b mb-4 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 md:px-5 py-2.5 md:py-3 text-base md:text-lg font-medium
                          border-b-2 -mb-px transition-colors whitespace-nowrap
                ${
                  activeTab === t.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && <OverviewSection workspace={workspace} />}

        {activeTab === 'members' && (
          <MembersSection
            members={members}
            isAdmin={isAdmin}
            onInvite={handleInvite}
            onRoleChange={handleRoleChange}
            onRemove={handleRemove}
          />
        )}

        {activeTab === 'billing' && <BillingPlaceholder />}

        {activeTab === 'danger' && <DangerZonePlaceholder />}
      </div>
    </div>
  );
};

export default WorkspaceSettingsPage;