import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { notify } from '../../../components/ui/toast';
import { confirm } from '../../../components/ui/alert/confirmation';
import { EditWorkspaceLoading } from './EditWorkspaceLoading';
import {
  FaArrowLeft,
  FaSave,
  FaTrash,
  FaUsers,
  FaProjectDiagram,
  FaCalendar,
  FaCrown,
  FaUser,
  FaLock,
  FaGlobe,
} from 'react-icons/fa';
import { useDisplay } from '../../../hooks/display';

/**
 * EditWorkspacePage Component - Page for editing workspace details
 * @component
 * @returns {JSX.Element} Rendered edit workspace page
 */
const EditWorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isMobile, isDesktop } = useDisplay();

  /**
   * Loading states
   */
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Workspace data state
   */
  const [workspace, setWorkspace] = useState(null);

  /**
   * Form state
   */
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    plan: '',
    visibility: 'private',
    color: 'blue',
  });

  /**
   * Available color options
   */
  const colorOptions = [
    {
      id: 'blue',
      name: 'آبی',
      class: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    },
    {
      id: 'green',
      name: 'سبز',
      class: 'bg-gradient-to-r from-green-500 to-emerald-500',
    },
    {
      id: 'purple',
      name: 'بنفش',
      class: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
    {
      id: 'orange',
      name: 'نارنجی',
      class: 'bg-gradient-to-r from-orange-500 to-red-500',
    },
    {
      id: 'yellow',
      name: 'زرد',
      class: 'bg-gradient-to-r from-yellow-500 to-amber-500',
    },
    {
      id: 'indigo',
      name: 'نیلی',
      class: 'bg-gradient-to-r from-indigo-500 to-blue-500',
    },
  ];

  /**
   * Available plan options
   */
  const planOptions = [
    { id: 'free', name: 'رایگان' },
    { id: 'standard', name: 'استاندارد' },
    { id: 'pro', name: 'پرو' },
    { id: 'enterprise', name: 'سازمانی' },
  ];

  /**
   * Load workspace data on component mount
   */
  useEffect(() => {
    const loadWorkspaceData = async () => {
      setIsLoading(true);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Get workspaces from localStorage (mock data)
        const workspaces = [
          {
            id: 1,
            name: 'آکمی اینک',
            description: 'شرکت توسعه نرم‌افزارهای سازمانی',
            color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
            letter: 'A',
            role: 'admin',
            plan: 'پرو',
            memberCount: 12,
            createdAt: '2023-10-15',
            updatedAt: '2024-01-20',
          },
          {
            id: 2,
            name: 'آکمی کورپ',
            description: 'هولدینگ سرمایه‌گذاری فناوری',
            color: 'bg-gradient-to-r from-green-500 to-emerald-500',
            letter: 'B',
            role: 'member',
            plan: 'استاندارد',
            memberCount: 8,
            createdAt: '2023-11-05',
            updatedAt: '2024-01-18',
          },
          {
            id: 3,
            name: 'ایویل کورپ',
            description: 'استارت‌آپ هوش مصنوعی',
            color: 'bg-gradient-to-r from-purple-500 to-pink-500',
            letter: 'C',
            role: 'admin',
            plan: 'رایگان',
            memberCount: 5,
            createdAt: '2024-01-10',
            updatedAt: '2024-01-22',
          },
          {
            id: 4,
            name: 'تکنو پارس',
            description: 'ارائه دهنده خدمات ابری',
            color: 'bg-gradient-to-r from-red-500 to-orange-500',
            letter: 'T',
            role: 'member',
            plan: 'استاندارد',
            memberCount: 15,
            createdAt: '2023-09-22',
            updatedAt: '2024-01-19',
          },
          {
            id: 5,
            name: 'ایده پردازان',
            description: 'آژانس خلاقیت و نوآوری',
            color: 'bg-gradient-to-r from-yellow-500 to-amber-500',
            letter: 'I',
            role: 'admin',
            plan: 'پرو',
            memberCount: 7,
            createdAt: '2023-12-01',
            updatedAt: '2024-01-21',
          },
          {
            id: 6,
            name: 'شرکت توسعه نرم‌افزارهای هوشمند ایران',
            description: 'توسعه‌دهنده راهکارهای هوشمند سازمانی',
            color: 'bg-gradient-to-r from-indigo-500 to-blue-500',
            letter: 'ش',
            role: 'owner',
            plan: 'پرو پیشرفته',
            memberCount: 25,
            createdAt: '2023-08-14',
            updatedAt: '2024-01-23',
          },
          {
            id: 7,
            name: 'داده کاوان',
            description: 'تحلیل داده و بیگ دیتا',
            color: 'bg-gradient-to-r from-teal-500 to-green-500',
            letter: 'د',
            role: 'member',
            plan: 'استاندارد',
            memberCount: 9,
            createdAt: '2024-01-05',
            updatedAt: '2024-01-17',
          },
          {
            id: 8,
            name: 'ابر آریا',
            description: 'ارائه خدمات زیرساخت ابری',
            color: 'bg-gradient-to-r from-gray-500 to-blue-400',
            letter: 'ا',
            role: 'admin',
            plan: 'پرو',
            memberCount: 18,
            createdAt: '2023-11-30',
            updatedAt: '2024-01-24',
          },
        ];
        const foundWorkspace = workspaces.find((w) => w.id === parseInt(id));

        if (!foundWorkspace) {
          notify.error('فضای کاری مورد نظر یافت نشد');
          navigate('/workspace');
          return;
        }

        setWorkspace(foundWorkspace);

        // Extract color id from color class
        const colorClass =
          foundWorkspace.color || 'bg-gradient-to-r from-blue-500 to-cyan-500';
        const colorOption =
          colorOptions.find((c) => colorClass.includes(c.id)) ||
          colorOptions[0];

        // Extract plan id from plan name
        const planOption =
          planOptions.find(
            (p) =>
              foundWorkspace.plan.includes(p.name) ||
              p.name.includes(foundWorkspace.plan)
          ) || planOptions[0];

        setFormData({
          name: foundWorkspace.name || '',
          description: foundWorkspace.description || '',
          plan: planOption.id,
          visibility: 'private', // Default, would come from API
          color: colorOption.id,
        });
      } catch (error) {
        notify.error('خطا در بارگذاری اطلاعات فضای کاری');
        console.error('Error loading workspace:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkspaceData();
  }, [id, navigate]);

  /**
   * Handle form input changes
   * @param {React.ChangeEvent} e - Change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle form submission
   * @param {React.FormEvent} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      notify.error('لطفاً نام فضای کاری را وارد کنید');
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update workspace in localStorage (mock)
      const workspaces = JSON.parse(
        localStorage.getItem('khan-workspaces') || '[]'
      );
      const updatedWorkspaces = workspaces.map((w) => {
        if (w.id === parseInt(id)) {
          const selectedColor = colorOptions.find(
            (c) => c.id === formData.color
          );
          const selectedPlan = planOptions.find((p) => p.id === formData.plan);

          return {
            ...w,
            name: formData.name,
            description: formData.description,
            plan: selectedPlan.name,
            color: selectedColor.class,
            letter: formData.name.charAt(0).toUpperCase(),
            updatedAt: new Date().toISOString(),
          };
        }
        return w;
      });

      localStorage.setItem(
        'khan-workspaces',
        JSON.stringify(updatedWorkspaces)
      );

      // Update current workspace if it's the active one
      const currentWorkspaceId = localStorage.getItem(
        'khan-selected-workspace-id'
      );
      if (currentWorkspaceId === id) {
        const updatedWorkspace = updatedWorkspaces.find(
          (w) => w.id === parseInt(id)
        );
        localStorage.setItem(
          'khan-selected-workspace-id',
          updatedWorkspace.id.toString()
        );
      }

      notify.success('تغییرات با موفقیت ذخیره شد');
    } catch (error) {
      notify.error('خطا در ذخیره‌سازی تغییرات');
      console.error('Error saving workspace:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle workspace deletion
   */
  const handleDeleteWorkspace = () => {
    confirm({
      title: 'حذف فضای کاری',
      text: 'آیا مطمئن هستید که می‌خواهید این فضای کاری را حذف کنید؟ این عمل غیرقابل بازگشت است.',
      confirmText: 'حذف کن',
      confirmColor: 'red',
      onConfirm: async () => {
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Remove from localStorage (mock)
          const workspaces = JSON.parse(
            localStorage.getItem('khan-workspaces') || '[]'
          );
          const filteredWorkspaces = workspaces.filter(
            (w) => w.id !== parseInt(id)
          );
          localStorage.setItem(
            'khan-workspaces',
            JSON.stringify(filteredWorkspaces)
          );

          // If deleted workspace was current, update current workspace
          const currentWorkspaceId = localStorage.getItem(
            'khan-selected-workspace-id'
          );
          if (currentWorkspaceId === id) {
            const firstWorkspace = filteredWorkspaces[0];
            if (firstWorkspace) {
              localStorage.setItem(
                'khan-selected-workspace-id',
                firstWorkspace.id.toString()
              );
            } else {
              localStorage.removeItem('khan-selected-workspace-id');
            }
          }

          notify.success('فضای کاری با موفقیت حذف شد');
          navigate('/workspace');
        } catch (error) {
          notify.error('خطا در حذف فضای کاری');
        }
      },
    });
  };

  /**
   * Handle workspace archiving
   */
  const handleArchiveWorkspace = () => {
    confirm({
      title: 'آرشیو کردن فضای کاری',
      text: 'آیا می‌خواهید این فضای کاری را آرشیو کنید؟ فضای کاری‌های آرشیو شده غیرفعال می‌شوند.',
      onConfirm: async () => {
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 800));
          notify.success('فضای کاری با موفقیت آرشیو شد');
        } catch (error) {
          notify.error('خطا در آرشیو کردن فضای کاری');
        }
      },
    });
  };

  /**
   * Get the selected color
   */
  const selectedColor =
    colorOptions.find((c) => c.id === formData.color) || colorOptions[0];

  /**
   * Get the selected plan
   */
  const selectedPlan =
    planOptions.find((p) => p.id === formData.plan) || planOptions[0];

  /**
   * Show loading skeleton if data is loading
   */
  if (isLoading || !workspace) {
    return <EditWorkspaceLoading />;
  }

  return (
    <div className="h-full flex flex-col justify-start px-3 md:px-0 pt-4 md:pt-6">
      {/* Page header */}
      <div className="md:mx-0 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              ویرایش فضای کاری
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
              اطلاعات فضای کاری "{workspace.name}" را ویرایش کنید
            </p>
          </div>
          <Link
            to="/workspace"
            className="px-4 py-2.5 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
          >
            <FaArrowLeft className="ml-2" />
            بازگشت به فهرست
          </Link>
        </div>
      </div>

      {/* Main form content - Two column layout */}
      <div className="max-w-6xl mx-auto w-full">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Left column - Form inputs */}
            <div className="lg:w-2/3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
                {/* Workspace info header */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    اطلاعات فضای کاری
                  </h3>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div
                      className={`${selectedColor.class} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold`}
                    >
                      {formData.name.charAt(0).toUpperCase() ||
                        workspace.letter}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        شناسه:{' '}
                        <span className="font-mono font-bold">
                          {workspace.id}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        ایجاد شده در:{' '}
                        {new Date(workspace.createdAt).toLocaleDateString(
                          'fa-IR'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic information */}
                <div className="space-y-6">
                  {/* Workspace name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      نام فضای کاری <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="نام فضای کاری"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={50}
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {formData.name.length}/۵۰ کاراکتر
                    </p>
                  </div>

                  {/* Workspace description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      توضیحات
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="توضیحات درباره فضای کاری و فعالیت‌های آن..."
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {formData.description.length}/۲۰۰ کاراکتر
                    </p>
                  </div>

                  {/* Workspace color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      رنگ فضای کاری
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              color: color.id,
                            }))
                          }
                          className="flex flex-col items-center gap-2"
                        >
                          <div
                            className={`relative ${color.class} w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center transition-transform hover:scale-105`}
                          >
                            {formData.color === color.id && (
                              <div className="absolute inset-0 border-2 border-white rounded-lg"></div>
                            )}
                          </div>
                          <span className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Workspace plan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      پلن فضای کاری
                    </label>
                    <select
                      name="plan"
                      value={formData.plan}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {planOptions.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      می‌توانید پلن فضای کاری را ارتقا دهید
                    </p>
                  </div>

                  {/* Workspace visibility */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      سطح دسترسی
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                          formData.visibility === 'private'
                            ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            visibility: 'private',
                          }))
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              formData.visibility === 'private'
                                ? 'bg-blue-100 dark:bg-blue-800'
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}
                          >
                            <FaLock
                              className={`${
                                formData.visibility === 'private'
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900 dark:text-white">
                                خصوصی
                              </h4>
                              {formData.visibility === 'private' && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              فقط اعضای دعوت‌شده
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                          formData.visibility === 'public'
                            ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            visibility: 'public',
                          }))
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              formData.visibility === 'public'
                                ? 'bg-blue-100 dark:bg-blue-800'
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}
                          >
                            <FaGlobe
                              className={`${
                                formData.visibility === 'public'
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900 dark:text-white">
                                عمومی
                              </h4>
                              {formData.visibility === 'public' && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              همه اعضای سازمان
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger Zone - Critical operations with destructive actions */}
                <div className="mt-12 border border-red-200 dark:border-red-800 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-red-900/5 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
                      <div>
                        <h3 className="text-xl font-bold text-red-800 dark:text-red-300">
                          عملیات حساس
                        </h3>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          این عملیات بر فضای کاری تاثیر دائمی دارد و قابل بازگشت
                          نیست.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Archive workspace option */}
                      <div className="border border-red-200 dark:border-red-800 rounded-xl p-4 bg-white dark:bg-gray-800">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                              آرشیو کردن فضای کاری
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              فضای کاری غیرفعال می‌شود اما اطلاعات آن حفظ می‌شود
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleArchiveWorkspace}
                            className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors whitespace-nowrap"
                          >
                            آرشیو کردن
                          </button>
                        </div>
                      </div>

                      {/* Delete workspace option */}
                      <div className="border border-red-200 dark:border-red-800 rounded-xl p-4 bg-white dark:bg-gray-800">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                              حذف فضای کاری
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              این عمل غیرقابل بازگشت است. همه داده‌های فضای کاری
                              حذف می‌شوند
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleDeleteWorkspace}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                          >
                            <FaTrash />
                            حذف فضای کاری
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Preview and stats */}
            <div className="lg:w-1/3">
              <div className="sticky top-6">
                {/* Preview card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    پیش‌نمایش
                  </h3>

                  <div className="flex flex-col items-center text-center">
                    {/* Workspace icon preview */}
                    <div
                      className={`${selectedColor.class} w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg mb-6`}
                    >
                      {formData.name.charAt(0).toUpperCase() ||
                        workspace.letter}
                    </div>

                    {/* Workspace info preview */}
                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {formData.name || 'نام فضای کاری'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-6 line-clamp-2">
                      {formData.description ||
                        workspace.description ||
                        'بدون توضیحات'}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span
                        className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                          selectedPlan.id === 'free'
                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                            : selectedPlan.id === 'standard'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : selectedPlan.id === 'pro'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}
                      >
                        {selectedPlan.name}
                      </span>
                      <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {formData.visibility === 'private' ? 'خصوصی' : 'عمومی'}
                      </span>
                      {workspace.role === 'admin' ||
                      workspace.role === 'owner' ? (
                        <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 flex items-center gap-1">
                          <FaCrown className="text-xs" />
                          {workspace.role === 'admin' ? 'مدیر' : 'مالک'}
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 flex items-center gap-1">
                          <FaUser className="text-xs" />
                          عضو
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    آمار فضای کاری
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <FaUsers className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            اعضا
                          </p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {workspace.memberCount || 1}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <FaProjectDiagram className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            پروژه‌ها
                          </p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {workspace.projectCount || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <FaCalendar className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ایجاد شده
                          </p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {new Date(workspace.createdAt).toLocaleDateString(
                              'fa-IR'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 md:mt-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-right">
                  <p>
                    تغییرات اعمال شده پس از ذخیره‌سازی قابل مشاهده خواهند بود.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link
                    to="/workspace"
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors text-center"
                  >
                    انصراف
                  </Link>

                  <button
                    type="submit"
                    disabled={!formData.name.trim() || isSaving}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      !formData.name.trim() || isSaving
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        در حال ذخیره‌سازی...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        ذخیره تغییرات
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorkspacePage;
