import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { UserPlus, Shield, CalendarDays, Layers3, UserCheck } from "lucide-react";
import { GoPlusCircle } from "react-icons/go";
import Swal from "sweetalert2";

import {
  OverviewSectionLoading,
  MembersSectionLoading,
  BillingPlaceholderLoading,
  DangerZonePlaceholderLoading,
} from "./WorkspaceSettingsLoading";

import { MOCK_WORKSPACES, MOCK_MEMBERS } from "../mock";

/**
 * Tabs   
 */
const TABS = [
  { key: "overview", label: "نمای کلی" },
  { key: "members", label: "اعضا" },
  { key: "billing", label: "صورتحساب" },
  { key: "danger", label: "بخش خطرناک" },
];

/**
 * InfoRow
 */
const InfoRow = ({ label, value, variant = "default", icon }) => {
  const badgeStyles = {
    "badge-blue": "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800/50",
    "badge-gray": "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/50 dark:text-gray-100 dark:border-gray-600",
  };

  const isBadge = variant !== "default";
  const style = isBadge ? badgeStyles[variant] : "text-base md:text-lg font-extrabold text-gray-900 dark:text-white";

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/50 border border-gray-200/70 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      <div className="flex items-center gap-3">
        {icon && (
          <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-200 flex-shrink-0">
            {icon}
          </span>
        )}
        <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">{label}</span>
      </div>
      {isBadge ? (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${style}`}>
          {value || "—"}
        </span>
      ) : (
        <span className={style}>{value || "—"}</span>
      )}
    </div>
  );
};

/**
 * Overview 
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
      <InfoRow label="نام فضای کاری" value={workspace.name} icon={<Shield className="w-4 h-4" />} />
      <InfoRow label="پلن" value={workspace.plan?.toUpperCase()} variant="badge-blue" icon={<Layers3 className="w-4 h-4" />} />
      <InfoRow label="تاریخ ایجاد" value={workspace.created_at} icon={<CalendarDays className="w-4 h-4" />} />
      <InfoRow
        label="نقش شما"
        value={workspace.my_role === "owner" ? "مالک" : workspace.my_role}
        variant="badge-gray"
        icon={<UserCheck className="w-4 h-4" />}
      />
    </div>
  </div>
);

/**
 * Members Section 
 */
const MembersSection = ({ members: init = [], workspace }) => {
  const isAdmin = ["owner", "admin"].includes(workspace?.my_role);
  const [search, setSearch] = useState("");
  const [list, setList] = useState(init);

  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(m => m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q));
  }, [list, search]);

  const initials = name => (name?.trim().split(" ").map(p => p[0]).join("").slice(0,2).toUpperCase()) || "U";

  const toast = msg => Swal.fire({ toast: true, position: "top-end", icon: "success", title: msg, timer: 2000, timerProgressBar: true, showConfirmButton: false });

  const invite = () => Swal.fire({
    title: "دعوت عضو جدید",
    input: "email",
    inputLabel: "ایمیل فرد",
    inputPlaceholder: "مثال: user@test.com",
    inputValue: "user@test.com",
    showCancelButton: true,
    confirmButtonText: "ارسال دعوت‌نامه",
    cancelButtonText: "لغو",
    preConfirm: e => !e || !/^\S+@\S+\.\S+$/.test(e) ? (Swal.showValidationMessage("ایمیل نامعتبر"), false) : e
  }).then(r => {
    if (r.isConfirmed) {
      const email = r.value;
      setList(p => [...p, {
        id: Date.now(),
        name: email.split("@")[0].replace(/^\w/, c => c.toUpperCase()),
        email,
        role: "member",
        joined_at: new Date().toLocaleDateString("fa-IR")
      }]);
      toast(`دعوت‌نامه برای ${email} ارسال شد`);
    }
  });

  const toggleRole = id => {
    const m = list.find(x => x.id === id);
    if (m.role === "owner") return;
    const toAdmin = m.role !== "admin";
    const roleFa = toAdmin ? "ادمین" : "عضو عادی";

    Swal.fire({
      title: "تغییر نقش",
      text: `آیا ${m.name} را به «${roleFa}» تبدیل کنید؟`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "بله",
      cancelButtonText: "خیر",
    }).then(r => {
      if (r.isConfirmed) {
        setList(p => p.map(x => x.id === id ? { ...x, role: toAdmin ? "admin" : "member" } : x));
        toast(`نقش ${m.name} به ${roleFa} تغییر کرد`);
      }
    });
  };

  const remove = id => {
    const m = list.find(x => x.id === id);
    Swal.fire({
      title: "حذف عضو",
      text: `آیا ${m.name} حذف شود؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف کن",
      confirmButtonColor: "#d33",
    }).then(r => {
      if (r.isConfirmed) {
        setList(p => p.filter(x => x.id !== id));
        toast(`${m.name} حذف شد`);
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl"><UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div>
          اعضای فضای کاری
        </h4>
        {isAdmin && (
          <button onClick={invite} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl flex items-center gap-2">
            دعوت عضو جدید <GoPlusCircle size={22} />
          </button>
        )}
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="جستجوی عضو..."
        className="w-full sm:w-72 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <div className="grid gap-3">
      {filtered.map(m => (
        <div
        key={m.id}
          className="relative flex flex-col lg:flex-row lg:items-center gap-4 px-5 py-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0 self-center lg:self-auto">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/40 flex-shrink-0">
              {initials(m.name)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-base text-gray-900 dark:text-white truncate">
                  {m.name || "—"}
                </p>
                {m.role === "owner" && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                    مالک
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{m.email}</p>
            </div>
          </div>

          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center gap-4">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {m.role === "owner" ? "مالک" : m.role === "admin" ? "ادمین" : "عضو"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              تاریخ عضویت: {m.joined_at || "-"}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4 lg:ml-auto">
            <div className="flex lg:hidden flex-col items-center gap-2 w-full mt-3">
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {m.role === "owner" ? "مالک" : m.role === "admin" ? "ادمین" : "عضو"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              تاریخ عضویت: {m.joined_at || "-"}
            </span>
          </div>

            {isAdmin && m.role !== "owner" && (
              <div className="flex gap-2 w-full lg:w-auto">
                <button
                  onClick={() => toggleRole(m.id)}
                  className="flex-1 lg:flex-initial px-5 py-2.5 text-sm font-semibold border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg transition"
                >
                  تغییر نقش
                </button>
                <button
                  onClick={() => remove(m.id)}
                  className="flex-1 lg:flex-initial px-5 py-2.5 text-sm font-semibold border border-red-500 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition"
                >
                  حذف
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

        {!filtered.length && <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">عضوی یافت نشد.</div>}
      </div>
    </div>
  );
};

/**
 * Placeholders 
 */
const BillingPlaceholder = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
    <p className="text-gray-600 dark:text-gray-300">بخش صورتحساب به‌زودی اضافه می‌شود.</p>
  </div>
);

const DangerZonePlaceholder = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-red-200 dark:border-red-700 text-center">
    <p className="text-red-600 dark:text-red-300">بخش خطرناک (حذف/ترک فضای کاری) بعداً فعال می‌شود.</p>
  </div>
);

/**
 *  Main Page
 */ 
const WorkspaceSettingsPage = () => {
  const { workspaceId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  const workspace = useMemo(() => MOCK_WORKSPACES.find(w => w.id === workspaceId), [workspaceId]);
  const members = useMemo(() => MOCK_MEMBERS[workspaceId] || [], [workspaceId]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const contentMap = {
    overview: loading ? <OverviewSectionLoading /> : <OverviewSection workspace={workspace} />,
    members: loading ? <MembersSectionLoading /> : <MembersSection members={members} workspace={workspace} />,
    billing: loading ? <BillingPlaceholderLoading /> : <BillingPlaceholder />,
    danger: loading ? <DangerZonePlaceholderLoading /> : <DangerZonePlaceholder />,
  };

  const CurrentContent = contentMap[activeTab];

  return (
    <div className="h-full flex flex-col pb-3 md:pb-0">
      <div className="mx-3 md:mx-0 pb-4 pt-3 md:pt-0 border-b border-gray-600">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            تنظیمات فضای کاری {workspace?.name}
          </h3>
          <Link to="/workspaces" className="px-4 py-2 rounded-lg font-medium bg-gray-300 dark:bg-gray-700 hover:bg-gray-600 transition">
            لیست فضاهای کاری
          </Link>
        </div>
      </div>

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

        <div className="mt-6">
          {CurrentContent}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettingsPage;