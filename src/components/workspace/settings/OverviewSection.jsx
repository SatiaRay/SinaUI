import React from 'react';
import { Shield, CalendarDays, Layers3, UserCheck } from 'lucide-react';
import { InfoRow } from './Constants';

/**
 * OverviewSection
 * Shows general workspace information for the Overview tab.
 *
 * @params {object} workspace Workspace data object.
 * @return {JSX.Element} Rendered overview section.
 */
const OverviewSection = ({ workspace }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-6 border border-gray-200 dark:border-gray-700">
    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
        <Layers3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
      اطلاعات فضای کاری
    </h4>

    <div className="grid gap-3">
      <InfoRow
        label="نام فضای کاری"
        value={workspace.name}
        icon={<Shield className="w-4 h-4" />}
      />
      <InfoRow
        label="پلن"
        value={workspace.plan?.toUpperCase()}
        variant="badge-blue"
        icon={<Layers3 className="w-4 h-4" />}
      />
      <InfoRow
        label="تاریخ ایجاد"
        value={workspace.created_at}
        icon={<CalendarDays className="w-4 h-4" />}
      />
      <InfoRow
        label="نقش شما"
        value={workspace.my_role === 'owner' ? 'مالک' : workspace.my_role}
        variant="badge-gray"
        icon={<UserCheck className="w-4 h-4" />}
      />
    </div>
  </div>
);

export default OverviewSection;
