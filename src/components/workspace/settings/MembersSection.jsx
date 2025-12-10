import React, { useMemo, useState } from "react";
import { UserPlus } from "lucide-react";
import { GoPlusCircle } from "react-icons/go";
import Swal from "sweetalert2";

/**
 * MembersSection
 * Renders workspace members list with search and admin actions.
 *
 * @params {Array<object>} members Initial members array.
 * @params {object} workspace Workspace data for role checking.
 * @return {JSX.Element} Rendered members section.
 */
const MembersSection = ({ members: init = [], workspace }) => {
  const isAdmin = ["owner", "admin"].includes(workspace?.my_role);
  const [search, setSearch] = useState("");
  const [list, setList] = useState(init);

  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (m) => m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q)
    );
  }, [list, search]);

  const initials = (name) =>
    name
      ?.trim()
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const toast = (msg) =>
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: msg,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });

  const invite = () =>
    Swal.fire({
      title: "دعوت عضو جدید",
      input: "email",
      inputLabel: "ایمیل فرد",
      inputPlaceholder: "مثال: user@test.com",
      inputValue: "user@test.com",
      showCancelButton: true,
      confirmButtonText: "ارسال دعوت‌نامه",
      cancelButtonText: "لغو",
      preConfirm: (e) =>
        !e || !/^\S+@\S+\.\S+$/.test(e)
          ? (Swal.showValidationMessage("ایمیل نامعتبر"), false)
          : e,
    }).then((r) => {
      if (r.isConfirmed) {
        const email = r.value;
        const name = email.split("@")[0].replace(/^\w/, (c) => c.toUpperCase());
        setList((p) => [
          ...p,
          {
            id: Date.now(),
            name,
            email,
            role: "member",
            joined_at: new Date().toLocaleDateString("fa-IR"),
          },
        ]);
        toast(`Invitation sent to ${email}`);
      }
    });

  const toggleRole = (id) => {
    const m = list.find((x) => x.id === id);
    if (!m || m.role === "owner") return;

    const toAdmin = m.role !== "admin";
    const roleFa = toAdmin ? "ادمین" : "عضو عادی";

    Swal.fire({
      title: "تغییر نقش",
      text: `آیا ${m.name} را به «${roleFa}» تبدیل کنید؟`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "بله",
      cancelButtonText: "خیر",
    }).then((r) => {
      if (r.isConfirmed) {
        setList((p) =>
          p.map((x) =>
            x.id === id ? { ...x, role: toAdmin ? "admin" : "member" } : x
          )
        );
        toast(`Role changed for ${m.name}`);
      }
    });
  };

  const removeMember = (id) => {
    const m = list.find((x) => x.id === id);
    if (!m) return;

    Swal.fire({
      title: "حذف عضو",
      text: `آیا ${m.name} حذف شود؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف کن",
      confirmButtonColor: "#d33",
    }).then((r) => {
      if (r.isConfirmed) {
        setList((p) => p.filter((x) => x.id !== id));
        toast(`${m.name} removed`);
      }
    });
  };

  const getRoleLabel = (role) =>
    role === "owner" ? "مالک" : role === "admin" ? "ادمین" : "عضو";

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-6 border border-gray-200 dark:border-gray-700">
      {/* subtle background */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

      {/* header */}
      <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-sky-500/20 dark:from-indigo-500/25 dark:to-sky-500/25">
            <UserPlus className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
          </div>
          اعضای فضای کاری
        </h4>

        {isAdmin && (
          <button
            onClick={invite}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-l from-indigo-600 via-sky-600 to-cyan-600 hover:from-indigo-500 hover:via-sky-500 hover:to-cyan-500 shadow-md hover:shadow-xl transition"
          >
            دعوت عضو جدید <GoPlusCircle size={22} />
          </button>
        )}
      </div>

      {/* search */}
      <div className="relative mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی عضو..."
          className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/60 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/60 transition"
        />
      </div>

      {/* list */}
      <div className="grid gap-3 relative">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="group relative rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/85 dark:bg-gray-800/75 p-4 md:p-5 pr-6 sm:pr-7 md:pr-9 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition"
          >
            <div className="absolute inset-y-3 right-2 sm:right-3 w-1 md:w-1.5 rounded-full bg-gradient-to-b from-indigo-500 via-sky-500 to-cyan-500 opacity-70 group-hover:opacity-100 transition" />

            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* left main info */}
              <div className="flex items-center gap-4 flex-1 min-w-0 self-center lg:self-auto">
                <div className="w-11 h-11 rounded-2xl grid place-items-center text-sm font-black bg-gradient-to-br from-indigo-100 to-sky-100 text-indigo-700 dark:from-indigo-900/40 dark:to-sky-900/30 dark:text-indigo-200 border border-indigo-200/60 dark:border-indigo-700/40 flex-shrink-0">
                  {initials(m.name)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-base text-gray-900 dark:text-white truncate">
                      {m.name || "—"}
                    </p>
                    {m.role === "owner" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
                        مالک
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{m.email}</p>
                </div>
              </div>

              {/* role & date - desktop */}
              <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center gap-4">
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {getRoleLabel(m.role)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  تاریخ عضویت: {m.joined_at || "-"}
                </span>
              </div>

              {/* actions + mobile role/date */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4 lg:ml-auto">
                <div className="flex lg:hidden flex-col items-start gap-2 w-full mt-2">
                  <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {getRoleLabel(m.role)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    تاریخ عضویت: {m.joined_at || "-"}
                  </span>
                </div>

                {isAdmin && m.role !== "owner" && (
                  <div className="flex gap-2 w-full lg:w-auto">
                    <button
                      onClick={() => toggleRole(m.id)}
                      className="flex-1 lg:flex-initial px-5 py-2.5 text-sm font-semibold rounded-xl border border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white transition"
                    >
                      تغییر نقش
                    </button>
                    <button
                      onClick={() => removeMember(m.id)}
                      className="flex-1 lg:flex-initial px-5 py-2.5 text-sm font-semibold rounded-xl border border-rose-500 text-rose-600 hover:bg-rose-500 hover:text-white transition"
                    >
                      حذف
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {!filtered.length && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
            عضوی یافت نشد.
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersSection;