import React from "react";
import { Shield, CalendarDays, Layers3, UserCheck } from "lucide-react";
import { InfoRow } from "./Constants";

/**
 * OverviewSection
 * Shows general workspace information for the Overview tab.
 */
const OverviewSection = ({ workspace }) => (
  <div className="relative overflow-hidden rounded-3xl border border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-b from-white to-gray-50/60 dark:from-gray-900 dark:to-gray-900/60 shadow-[0_12px_35px_-14px_rgba(0,0,0,0.35)] p-5 md:p-7">
    {/* background glow blobs */}
    <div className="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-400/25 via-fuchsia-400/15 to-sky-400/25 dark:from-indigo-500/30 dark:via-fuchsia-500/20 dark:to-sky-500/30 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-400/20 via-cyan-400/10 to-indigo-400/20 dark:from-emerald-500/25 dark:via-cyan-500/15 dark:to-indigo-500/25 blur-3xl" />

    {/* header */}
    <div className="relative mb-6 flex items-center justify-between">
      <h4 className="flex items-center gap-3 text-lg md:text-xl font-black text-gray-900 dark:text-white tracking-tight">
        <span className="grid place-items-center h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-sky-500 text-white shadow-lg shadow-indigo-500/30">
          <Layers3 className="h-5 w-5" />
        </span>
        اطلاعات فضای کاری
      </h4>
    </div>

    {/* rows */}
    <div className="relative grid gap-3 md:gap-4">
      <div className="group relative rounded-2xl bg-white/80 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/70 p-3 md:p-4 transition hover:shadow-md hover:-translate-y-[1px]">
        <div className="absolute inset-y-2 right-2 w-1.5 rounded-full bg-gradient-to-b from-indigo-500 to-sky-500 opacity-70 group-hover:opacity-100 transition" />
        <InfoRow
          label="نام فضای کاری"
          value={workspace.name}
          icon={<Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
        />
      </div>

      <div className="group relative rounded-2xl bg-white/80 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/70 p-3 md:p-4 transition hover:shadow-md hover:-translate-y-[1px]">
        <div className="absolute inset-y-2 right-2 w-1.5 rounded-full bg-gradient-to-b from-fuchsia-500 to-pink-500 opacity-70 group-hover:opacity-100 transition" />
        <InfoRow
          label="پلن"
          value={workspace.plan?.toUpperCase()}
          variant="badge-blue"
          icon={<Layers3 className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" />}
        />
      </div>

      <div className="group relative rounded-2xl bg-white/80 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/70 p-3 md:p-4 transition hover:shadow-md hover:-translate-y-[1px]">
        <div className="absolute inset-y-2 right-2 w-1.5 rounded-full bg-gradient-to-b from-emerald-500 to-cyan-500 opacity-70 group-hover:opacity-100 transition" />
        <InfoRow
          label="تاریخ ایجاد"
          value={workspace.created_at}
          icon={<CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
        />
      </div>

      <div className="group relative rounded-2xl bg-white/80 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/70 p-3 md:p-4 transition hover:shadow-md hover:-translate-y-[1px]">
        <div className="absolute inset-y-2 right-2 w-1.5 rounded-full bg-gradient-to-b from-amber-500 to-rose-500 opacity-70 group-hover:opacity-100 transition" />
        <InfoRow
          label="نقش شما"
          value={workspace.my_role === "owner" ? "مالک" : workspace.my_role}
          variant="badge-gray"
          icon={<UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
        />
      </div>

    </div>
  </div>
);

export default OverviewSection;