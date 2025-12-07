import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { TABS } from "./Constants";
import OverviewSection from "./OverviewSection";
import MembersSection from "./MembersSection";
import BillingSection from "./BillingSection";
import DangerZoneSection from "./DangerZoneSection";
import {
  OverviewSectionLoading,
  MembersSectionLoading,
  BillingSectionLoading,
  DangerZoneSectionLoading,
} from "./WorkspaceSettingsLoading";

import { MOCK_WORKSPACES, MOCK_MEMBERS } from "../mock";

/**
 * WorkspaceSettingsPage
 * Route-level container for workspace settings.
 * Handles routing params, top-level state, and tab orchestration.
 *
 * @return {JSX.Element} Rendered workspace settings page.
 */
const WorkspaceSettingsPage = () => {
  const { workspaceId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  /**
   * useParams always returns strings in RRv6, so compare as strings
   */ 
  const workspace = useMemo(
    () =>
      MOCK_WORKSPACES.find(
        (w) => String(w.id) === String(workspaceId)
      ),
    [workspaceId]
  );

  const members = useMemo(
    () => MOCK_MEMBERS[workspaceId] || [],
    [workspaceId]
  );

  /**
   * fake loading to show skeletons on tab switch  
   */ 
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  /**
   * workspace not found
   */
  if (!workspace) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 text-center">
          <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
            Workspace not found.
          </p>
          <Link
            to="/workspaces"
            className="inline-block mt-4 px-4 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Back to workspaces
          </Link>
        </div>
      </div>
    );
  }

  const contentMap = {
    overview: loading ? (
      <OverviewSectionLoading />
    ) : (
      <OverviewSection workspace={workspace} />
    ),
    members: loading ? (
      <MembersSectionLoading />
    ) : (
      <MembersSection members={members} workspace={workspace} />
    ),
    billing: loading ? <BillingSectionLoading /> : <BillingSection />,
    danger: loading ? <DangerZoneSectionLoading /> : <DangerZoneSection />,
  };

  return (
    <div className="h-full flex flex-col pb-3 md:pb-0">
      {/* Header */}
      <div className="mx-3 md:mx-0 pb-4 pt-3 md:pt-0 border-b border-gray-600">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            تنظیمات فضای کاری {workspace.name}
          </h3>

          <Link
            to="/workspaces"
            className="px-4 py-2 rounded-lg font-medium bg-gray-300 dark:bg-gray-700 hover:bg-gray-600 transition"
          >
            لیست فضاهای کاری
          </Link>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="px-3 md:px-0 mt-6">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-sm md:text-base font-medium rounded-t-lg whitespace-nowrap transition ${
                activeTab === key
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6">{contentMap[activeTab]}</div>
      </div>
    </div>
  );
};

export default WorkspaceSettingsPage;