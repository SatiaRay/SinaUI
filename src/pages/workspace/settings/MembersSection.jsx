import React, { useMemo, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { GoPlusCircle } from 'react-icons/go';
import Swal from 'sweetalert2';

/**
 * MembersSection
 * Renders workspace members list with search and admin actions.
 *
 * @params {Array<object>} members Initial members array.
 * @params {object} workspace Workspace data for role checking.
 * @return {JSX.Element} Rendered members section.
 */
const MembersSection = ({ members: init = [], workspace }) => {
  const isAdmin = ['owner', 'admin'].includes(workspace?.my_role);
  const [search, setSearch] = useState('');
  const [list, setList] = useState(init);

  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q)
    );
  }, [list, search]);

  const initials = (name) =>
    name
      ?.trim()
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  const toast = (msg) =>
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: msg,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });

  const invite = () =>
    Swal.fire({
      title: 'دعوت عضو جدید',
      input: 'email',
      inputLabel: 'ایمیل فرد',
      inputPlaceholder: 'مثال: user@test.com',
      inputValue: 'user@test.com',
      showCancelButton: true,
      confirmButtonText: 'ارسال دعوت‌نامه',
      cancelButtonText: 'لغو',
      preConfirm: (e) =>
        !e || !/^\S+@\S+\.\S+$/.test(e)
          ? (Swal.showValidationMessage('ایمیل نامعتبر'), false)
          : e,
    }).then((r) => {
      if (r.isConfirmed) {
        const email = r.value;
        setList((p) => [
          ...p,
          {
            id: Date.now(),
            name: email.split('@')[0].replace(/^\w/, (c) => c.toUpperCase()),
            email,
            role: 'member',
            joined_at: new Date().toLocaleDateString('fa-IR'),
          },
        ]);
        toast(`Invitation sent to ${email}`);
      }
    });

  const toggleRole = (id) => {
    const m = list.find((x) => x.id === id);
    if (!m || m.role === 'owner') return;

    const toAdmin = m.role !== 'admin';
    const roleFa = toAdmin ? 'ادمین' : 'عضو عادی';

    Swal.fire({
      title: 'تغییر نقش',
      text: `آیا ${m.name} را به «${roleFa}» تبدیل کنید؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'بله',
      cancelButtonText: 'خیر',
    }).then((r) => {
      if (r.isConfirmed) {
        setList((p) =>
          p.map((x) =>
            x.id === id ? { ...x, role: toAdmin ? 'admin' : 'member' } : x
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
      title: 'حذف عضو',
      text: `آیا ${m.name} حذف شود؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'بله، حذف کن',
      confirmButtonColor: '#d33',
    }).then((r) => {
      if (r.isConfirmed) {
        setList((p) => p.filter((x) => x.id !== id));
        toast(`${m.name} removed`);
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          اعضای فضای کاری
        </h4>

        {isAdmin && (
          <button
            onClick={invite}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            دعوت عضو جدید <GoPlusCircle size={22} />
          </button>
        )}
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="جستجوی عضو..."
        className="w-full sm:w-72 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <div className="grid gap-3">
        {filtered.map((m) => (
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
                    {m.name || '—'}
                  </p>
                  {m.role === 'owner' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                      مالک
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {m.email}
                </p>
              </div>
            </div>

            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center gap-4">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {m.role === 'owner'
                  ? 'مالک'
                  : m.role === 'admin'
                    ? 'ادمین'
                    : 'عضو'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                تاریخ عضویت: {m.joined_at || '-'}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4 lg:ml-auto">
              <div className="flex lg:hidden flex-col items-center gap-2 w-full mt-3">
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {m.role === 'owner'
                    ? 'مالک'
                    : m.role === 'admin'
                      ? 'ادمین'
                      : 'عضو'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  تاریخ عضویت: {m.joined_at || '-'}
                </span>
              </div>

              {isAdmin && m.role !== 'owner' && (
                <div className="flex gap-2 w-full lg:w-auto">
                  <button
                    onClick={() => toggleRole(m.id)}
                    className="flex-1 lg:flex-initial px-5 py-2.5 text-sm font-semibold border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg transition"
                  >
                    تغییر نقش
                  </button>
                  <button
                    onClick={() => removeMember(m.id)}
                    className="flex-1 lg:flex-initial px-5 py-2.5 text-sm font-semibold border border-red-500 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition"
                  >
                    حذف
                  </button>
                </div>
              )}
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
