import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notify } from '../../../components/ui/toast';
import { confirm } from '../../../components/ui/alert/confirmation';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaUsers,
  FaCrown,
  FaCheck,
  FaLightbulb,
  FaLock,
  FaGlobe,
} from 'react-icons/fa';
import { useDisplay } from '../../../hooks/display';

/**
 * CreateWorkspacePage Component - Page for creating a new workspace
 * @component
 * @returns {JSX.Element} Rendered create workspace page
 */
const CreateWorkspacePage = () => {
  const navigate = useNavigate();
  const { isMobile, isDesktop } = useDisplay();

  /**
   * Loading state for simulating API call
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Form state
   */
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    plan: 'free',
    visibility: 'private',
    color: 'blue',
  });

  /**
   * Available plan options
   */
  const planOptions = [
    {
      id: 'free',
      name: 'رایگان',
      price: '۰ تومان',
      period: 'ماهانه',
      features: [
        'تا ۵ عضو',
        '۵ پروژه',
        '۱ گیگابایت فضای ذخیره‌سازی',
        'پشتیبانی پایه',
      ],
      icon: FaLightbulb,
      color: 'from-gray-400 to-gray-600',
      badge: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      popular: false,
    },
    {
      id: 'standard',
      name: 'استاندارد',
      price: '۲۹,۰۰۰',
      period: 'ماهانه',
      features: [
        'تا ۲۰ عضو',
        '۲۰ پروژه',
        '۱۰ گیگابایت فضای ذخیره‌سازی',
        'پشتیبانی اولویت‌دار',
        'گزارش‌های پیشرفته',
      ],
      icon: FaUsers,
      color: 'from-green-500 to-emerald-600',
      badge:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      popular: true,
    },
    {
      id: 'pro',
      name: 'پرو',
      price: '۹۹,۰۰۰',
      period: 'ماهانه',
      features: [
        'اعضای نامحدود',
        'پروژه‌های نامحدود',
        '۱۰۰ گیگابایت فضای ذخیره‌سازی',
        'پشتیبانی ۲۴/۷',
        'گزارش‌های کامل',
        'API دسترسی',
      ],
      icon: FaCrown,
      color: 'from-blue-500 to-purple-600',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      popular: false,
    },
  ];

  /**
   * Color options for workspace icon
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

    // Validate form
    if (!formData.name.trim()) {
      notify.error('لطفاً نام فضای کاری را وارد کنید');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a workspace letter from name
      const letter = formData.name.charAt(0).toUpperCase();

      // Create workspace object
      const newWorkspace = {
        id: Date.now(), // Temporary ID
        name: formData.name,
        description: formData.description,
        plan:
          formData.plan === 'free'
            ? 'رایگان'
            : formData.plan === 'standard'
              ? 'استاندارد'
              : 'پرو',
        color:
          colorOptions.find((c) => c.id === formData.color)?.class ||
          'bg-gradient-to-r from-blue-500 to-cyan-500',
        letter,
        role: 'owner',
        memberCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage (simulating API response)
      const existingWorkspaces = JSON.parse(
        localStorage.getItem('khan-workspaces') || '[]'
      );
      existingWorkspaces.push(newWorkspace);
      localStorage.setItem(
        'khan-workspaces',
        JSON.stringify(existingWorkspaces)
      );

      // Also set as current workspace
      localStorage.setItem(
        'khan-selected-workspace-id',
        newWorkspace.id.toString()
      );

      notify.success('فضای کاری با موفقیت ایجاد شد!');

      // Redirect to workspace index page
      navigate('/workspace');
    } catch (error) {
      notify.error('خطا در ایجاد فضای کاری. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle cancel button click
   */
  const handleCancel = () => {
    confirm({
      title: 'انصراف از ایجاد فضای کاری',
      text: 'آیا مطمئن هستید که می‌خواهید از ایجاد فضای کاری جدید انصراف دهید؟',
      onConfirm: () => {
        navigate('/workspace');
      },
    });
  };

  /**
   * Simple skeleton loading component
   */
  const SkeletonLoading = () => (
    <div className="h-full flex flex-col justify-start px-3 md:px-0 pt-4 md:pt-6">
      {/* Header skeleton */}
      <div className="md:mx-0 mb-6 md:mb-8">
        <div className="flex justify-between items-start md:items-center">
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Form skeleton - Two columns on desktop */}
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left column skeleton */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column skeleton */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
              <div className="space-y-6">
                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Show skeleton loading when isLoading is true
   */
  if (isLoading) {
    return <SkeletonLoading />;
  }

  /**
   * Get the selected plan
   */
  const selectedPlan = planOptions.find((plan) => plan.id === formData.plan);
  const selectedColor = colorOptions.find((c) => c.id === formData.color);

  return (
    <div className="h-full flex flex-col justify-start px-3 md:px-0 pt-4 md:pt-6">
      {/* Page header */}
      <div className="md:mx-0 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              ایجاد فضای کاری جدید
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
              فضای کاری جدید خود را ایجاد کنید و با تیم خود همکاری را شروع کنید
            </p>
          </div>
          <Link
            to="/workspace"
            className="px-4 py-2.5 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
          >
            بازگشت به فهرست
          </Link>
        </div>
      </div>

      {/* Main form content - Two column layout on desktop */}
      <div className="max-w-6xl mx-auto w-full">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Left column - Form inputs */}
            <div className="lg:w-2/3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
                {/* Basic information section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    اطلاعات پایه
                  </h3>

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
                        placeholder="مثال: شرکت فناوری اطلاعات"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={50}
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        نامی برای فضای کاری خود انتخاب کنید (حداکثر ۵۰ کاراکتر)
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
                  </div>
                </div>

                {/* Color selection section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    رنگ فضای کاری
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    رنگ آیکون فضای کاری خود را انتخاب کنید
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, color: color.id }))
                        }
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className={`relative ${color.class} w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center transition-transform hover:scale-105`}
                        >
                          {formData.color === color.id && (
                            <div className="absolute inset-0 border-2 border-white rounded-lg"></div>
                          )}
                          {formData.color === color.id && (
                            <FaCheck className="text-white text-sm absolute" />
                          )}
                        </div>
                        <span className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plan selection section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    انتخاب پلن
                  </h3>

                  <div className="space-y-4">
                    {planOptions.map((plan) => {
                      const Icon = plan.icon;
                      return (
                        <div
                          key={plan.id}
                          className={`relative border rounded-xl p-4 md:p-5 cursor-pointer transition-all duration-200 ${
                            formData.plan === plan.id
                              ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, plan: plan.id }))
                          }
                        >
                          {/* Popular badge */}
                          {plan.popular && (
                            <div className="absolute -top-2 right-4">
                              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                                پرفروش
                              </span>
                            </div>
                          )}

                          <div className="flex items-start gap-4">
                            {/* Plan icon */}
                            <div
                              className={`${plan.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className="text-white text-xl" />
                            </div>

                            {/* Plan details */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                    {plan.name}
                                  </h4>
                                  <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                      {plan.price}
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      تومان
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                      /{plan.period}
                                    </span>
                                  </div>
                                </div>

                                {/* Radio button */}
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                    formData.plan === plan.id
                                      ? 'border-blue-500 bg-blue-500'
                                      : 'border-gray-300 dark:border-gray-600'
                                  }`}
                                >
                                  {formData.plan === plan.id && (
                                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                  )}
                                </div>
                              </div>

                              {/* Plan features */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                                {plan.features.map((feature, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <FaCheck className="text-green-500 text-sm flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                      {feature}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Preview and additional settings */}
            <div className="lg:w-1/3">
              <div className="sticky top-6">
                {/* Preview card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    پیش‌نمایش فضای کاری
                  </h3>

                  <div className="flex flex-col items-center text-center">
                    {/* Workspace icon preview */}
                    <div
                      className={`${selectedColor?.class} w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg mb-6`}
                    >
                      {formData.name
                        ? formData.name.charAt(0).toUpperCase()
                        : '?'}
                    </div>

                    {/* Workspace info preview */}
                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {formData.name || 'نام فضای کاری'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-6 line-clamp-2">
                      {formData.description || 'توضیحات فضای کاری...'}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span
                        className={`px-3 py-1.5 text-sm font-medium rounded-full ${selectedPlan?.badge}`}
                      >
                        {selectedPlan?.name}
                      </span>
                      <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {formData.visibility === 'private' ? 'خصوصی' : 'عمومی'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visibility selection */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    سطح دسترسی
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    سطح دسترسی اعضا به فضای کاری را مشخص کنید
                  </p>

                  <div className="space-y-4">
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
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            formData.visibility === 'private'
                              ? 'bg-blue-100 dark:bg-blue-800'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          <FaLock
                            className={`text-lg ${
                              formData.visibility === 'private'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-gray-900 dark:text-white">
                              خصوصی
                            </h4>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                formData.visibility === 'private'
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}
                            >
                              {formData.visibility === 'private' && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            فقط اعضای دعوت‌شده می‌توانند به فضای کاری دسترسی
                            داشته باشند.
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
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            formData.visibility === 'public'
                              ? 'bg-blue-100 dark:bg-blue-800'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          <FaGlobe
                            className={`text-lg ${
                              formData.visibility === 'public'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-gray-900 dark:text-white">
                              عمومی
                            </h4>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                formData.visibility === 'public'
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}
                            >
                              {formData.visibility === 'public' && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            همه اعضای سازمان می‌توانند درخواست عضویت در فضای
                            کاری را بدهند.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons - Fixed at bottom on mobile, normal on desktop */}
          <div className="mt-8 md:mt-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-right">
                  <p>
                    با ایجاد فضای کاری جدید، با{' '}
                    <strong className="text-gray-800 dark:text-gray-200">
                      قوانین و شرایط
                    </strong>{' '}
                    استفاده موافقت می‌کنید.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                  >
                    انصراف
                  </button>

                  <button
                    type="submit"
                    disabled={!formData.name.trim()}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      formData.name.trim()
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span className="font-bold">ایجاد فضای کاری</span>
                    <FaArrowRight />
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

export default CreateWorkspacePage;
