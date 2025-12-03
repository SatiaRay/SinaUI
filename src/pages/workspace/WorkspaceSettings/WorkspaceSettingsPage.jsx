import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  TABS,
  OverviewSection,
  MembersSection,
  BillingPlaceholder,
  DangerZonePlaceholder,
} from "../WorkspaceSections/WorkspaceSections";

import {
  OverviewSectionLoading,
  MembersSectionLoading,
  BillingPlaceholderLoading,
  DangerZonePlaceholderLoading,
} from "../WorkspaceSections/WorkspaceSectionsLoading"; 

import { MOCK_WORKSPACES, MOCK_MEMBERS } from "../mock";

const WorkspaceSettingsPage = () => {
  const { workspaceId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const [tabLoading, setTabLoading] = useState(false);

  const workspace = useMemo(
    () => MOCK_WORKSPACES.find((w) => w.id === workspaceId),
    [workspaceId]
  );

  const members = useMemo(
    () => MOCK_MEMBERS[workspaceId] || [],
    [workspaceId]
  );

  useEffect(() => {
    setTabLoading(true);
    const t = setTimeout(() => setTabLoading(false), 600); 
    return () => clearTimeout(t);
  }, [activeTab]);

  const renderTabContent = () => {
    if (tabLoading) {
      if (activeTab === "overview") return <OverviewSectionLoading />;
      if (activeTab === "members") return <MembersSectionLoading />;
      if (activeTab === "billing") return <BillingPlaceholderLoading />;
      if (activeTab === "danger") return <DangerZonePlaceholderLoading />;
      return null;
    }

    if (activeTab === "overview") return <OverviewSection workspace={workspace} />;
    if (activeTab === "members")
      return (
        <MembersSection
          members={members}
          workspace={workspace}
          setMembers={() => {}}
        />
      );
    if (activeTab === "billing") return <BillingPlaceholder />;
    if (activeTab === "danger") return <DangerZonePlaceholder />;

    return null;
  };

  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      {/* Header */}
      <div className="mx-3 md:mx-0 md:mb-3 pb-4 pt-3 md:pt-0 border-b border-gray-600 flex flex-col gap-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            تنظیمات فضای کاری {workspace?.name}
          </h3>

          <Link
            to="/workspaces"
            className="px-4 py-2 rounded-lg font-medium transition-all
                       bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            لیست فضاهای کاری
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-3 md:px-0 mt-4">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
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
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-500"}
                `}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-4">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default WorkspaceSettingsPage;
