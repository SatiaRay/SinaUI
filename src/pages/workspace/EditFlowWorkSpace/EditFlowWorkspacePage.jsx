import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaSave,
  FaTrash,
  FaTag,
  FaCalendar,
} from 'react-icons/fa';
import { notify } from '../../../components/ui/toast';
import { confirm } from '../../../components/ui/alert/confirmation';
import { useDisplay } from '../../../hooks/display';
import EditFlowWorkspaceLoading from './EditFlowWorkspaceLoading';

/**
 * EditFlowWorkspacePage Component - Page for editing an existing project in a workspace
 * @component
 * @returns {JSX.Element} Rendered edit project page
 */
const EditFlowWorkspacePage = () => {
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();
  const { isMobile, isDesktop } = useDisplay();

  /**
   * Loading state for workspace and project data
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Saving state for form submission
   */
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Deleting state for project deletion
   */
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Workspace data state
   */
  const [workspace, setWorkspace] = useState(null);

  /**
   * Project data state
   */
  const [project, setProject] = useState(null);

  /**
   * Form state
   */
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    color: 'blue',
    tags: [],
    startDate: '',
    endDate: '',
    budget: '',
    priority: 'medium',
  });

  /**
   * Tag input state
   */
  const [tagInput, setTagInput] = useState('');

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
   * Available status options
   */
  const statusOptions = [
    {
      id: 'planning',
      name: 'در حال برنامه‌ریزی',
      color:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    },
    {
      id: 'active',
      name: 'فعال',
      color:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    {
      id: 'on-hold',
      name: 'در انتظار',
      color:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    {
      id: 'completed',
      name: 'تکمیل شده',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    {
      id: 'archived',
      name: 'آرشیو شده',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    },
  ];

  /**
   * Priority options
   */
  const priorityOptions = [
    {
      id: 'low',
      name: 'کم',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    },
    {
      id: 'medium',
      name: 'متوسط',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    {
      id: 'high',
      name: 'بالا',
      color:
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    },
    {
      id: 'urgent',
      name: 'فوری',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
  ];

  /**
   * Get color ID from class
   * @param {string} colorClass - The CSS class of the color
   * @returns {string} The color ID
   */
  const getColorIdFromClass = (colorClass) => {
    const color = colorOptions.find((c) => c.class === colorClass);
    return color ? color.id : 'blue';
  };

  /**
   * Format date for display
   * @param {string} dateString - Date string
   * @returns {string} Formatted date string
   */
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fa-IR');
    } catch (error) {
      return dateString;
    }
  };

  /**
   * Load workspace and project data on component mount
   */
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Get workspace data (mock)
        const mockWorkspaces = [
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
        ];

        const foundWorkspace = mockWorkspaces.find(
          (w) => w.id === parseInt(workspaceId)
        );

        if (!foundWorkspace) {
          notify.error('فضای کاری مورد نظر یافت نشد');
          navigate('/workspace');
          return;
        }
        setWorkspace(foundWorkspace);

        // Load project from localStorage or mock data
        const existingProjects = JSON.parse(
          localStorage.getItem('khan-projects') || '[]'
        );

        // If no projects in localStorage, use mock data
        let projectsToSearch = existingProjects;
        if (projectsToSearch.length === 0) {
          projectsToSearch = [
            {
              id: 1,
              workspaceId: 1,
              name: 'پروژه مدیریت وظایف',
              description: 'سیستم مدیریت وظایف تیمی با قابلیت‌های پیشرفته',
              color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
              letter: 'M',
              status: 'active',
              taskCount: 24,
              memberCount: 5,
              startDate: '2024-01-10',
              endDate: '2024-03-10',
              createdAt: '2024-01-10',
              updatedAt: '2024-01-22',
              progress: 75,
              tags: ['مدیریت', 'تیمی', 'سازمانی'],
              budget: '5000000',
              priority: 'high',
            },
            {
              id: 2,
              workspaceId: 1,
              name: 'پورتال مشتریان',
              description: 'پورتال اختصاصی برای مدیریت ارتباط با مشتریان',
              color: 'bg-gradient-to-r from-green-500 to-emerald-500',
              letter: 'P',
              status: 'active',
              taskCount: 18,
              memberCount: 3,
              startDate: '2024-01-05',
              endDate: '2024-02-15',
              createdAt: '2024-01-05',
              updatedAt: '2024-01-20',
              progress: 60,
              tags: ['مشتریان', 'پورتال', 'CRM'],
              budget: '3000000',
              priority: 'medium',
            },
          ];
        }

        const foundProject = projectsToSearch.find(
          (p) =>
            p.id === parseInt(projectId) &&
            p.workspaceId === parseInt(workspaceId)
        );

        if (!foundProject) {
          notify.error('پروژه مورد نظر یافت نشد');
          navigate(`/workspace/${workspaceId}/projects`);
          return;
        }
        setProject(foundProject);

        // Convert color class to color ID
        const colorId = getColorIdFromClass(foundProject.color);

        // Set form data with project data
        setFormData({
          name: foundProject.name || '',
          description: foundProject.description || '',
          status: foundProject.status || 'planning',
          color: colorId,
          tags: foundProject.tags || [],
          startDate: foundProject.startDate || '',
          endDate: foundProject.endDate || '',
          budget: foundProject.budget ? foundProject.budget.toString() : '',
          priority: foundProject.priority || 'medium',
        });
      } catch (error) {
        notify.error('خطا در بارگذاری اطلاعات');
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [workspaceId, projectId, navigate]);

  /**
   * Handle form input changes
   * @param {React.ChangeEvent} e - Change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For budget field, only allow numbers
    if (name === 'budget') {
      // Remove any non-numeric characters
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /**
   * Handle tag input key down
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag) && formData.tags.length < 10) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
        setTagInput('');
      }
    }
  };

  /**
   * Remove a tag
   * @param {number} index - Index of tag to remove
   */
  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  /**
   * Handle form submission (update project)
   * @param {React.FormEvent} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      notify.error('لطفاً نام پروژه را وارد کنید');
      return;
    }

    if (formData.tags.length > 10) {
      notify.error('حداکثر ۱۰ تگ مجاز است');
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Get selected color
      const selectedColor =
        colorOptions.find((c) => c.id === formData.color) || colorOptions[0];

      // Update project object
      const updatedProject = {
        ...project,
        name: formData.name,
        description: formData.description,
        color: selectedColor.class,
        letter: formData.name.charAt(0).toUpperCase(),
        status: formData.status,
        tags: formData.tags,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        budget: formData.budget || null,
        priority: formData.priority,
        updatedAt: new Date().toISOString(),
      };

      // Update in localStorage
      const existingProjects = JSON.parse(
        localStorage.getItem('khan-projects') || '[]'
      );
      const updatedProjects = existingProjects.map((p) =>
        p.id === parseInt(projectId) ? updatedProject : p
      );
      localStorage.setItem('khan-projects', JSON.stringify(updatedProjects));

      notify.success('تغییرات پروژه با موفقیت ذخیره شد!');

      // Redirect to projects list page
      navigate(`/workspace/${workspaceId}/projects`);
    } catch (error) {
      notify.error('خطا در ذخیره تغییرات. لطفاً دوباره تلاش کنید.');
      console.error('Error updating project:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle project deletion
   */
  const handleDeleteProject = () => {
    confirm({
      title: 'حذف پروژه',
      text: `آیا مطمئن هستید که می‌خواهید پروژه "${formData.name}" را حذف کنید؟ این عمل غیرقابل بازگشت است.`,
      confirmText: 'حذف کن',
      confirmColor: 'red',
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Remove from localStorage
          const existingProjects = JSON.parse(
            localStorage.getItem('khan-projects') || '[]'
          );
          const updatedProjects = existingProjects.filter(
            (p) => p.id !== parseInt(projectId)
          );
          localStorage.setItem(
            'khan-projects',
            JSON.stringify(updatedProjects)
          );

          notify.success('پروژه با موفقیت حذف شد');

          // Redirect to projects list page
          navigate(`/workspace/${workspaceId}/projects`);
        } catch (error) {
          notify.error('خطا در حذف پروژه');
          console.error('Error deleting project:', error);
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  /**
   * Handle cancel button click
   */
  const handleCancel = () => {
    confirm({
      title: 'انصراف از ویرایش',
      text: 'آیا مطمئن هستید که می‌خواهید از ویرایش پروژه انصراف دهید؟ تغییرات ذخیره نشده از بین خواهند رفت.',
      onConfirm: () => {
        navigate(`/workspace/${workspaceId}/projects`);
      },
    });
  };

  /**
   * Get selected color object
   */
  const selectedColor =
    colorOptions.find((c) => c.id === formData.color) || colorOptions[0];

  /**
   * Get selected status object
   */
  const selectedStatus =
    statusOptions.find((s) => s.id === formData.status) || statusOptions[0];

  /**
   * Get selected priority object
   */
  const selectedPriority =
    priorityOptions.find((p) => p.id === formData.priority) ||
    priorityOptions[1];

  /**
   * Show loading skeleton if data is loading
   */
  if (isLoading || !workspace || !project) {
    return <EditFlowWorkspaceLoading />;
  }

  return (
    <div className="h-full flex flex-col justify-start px-3 md:px-0 pt-4 md:pt-6">
      {/* Page header */}
      <div className="md:mx-0 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              to={`/workspace/${workspaceId}/projects`}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <FaArrowLeft className="text-lg" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                ویرایش پروژه
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
                ویرایش "{project.name}" در فضای کاری "{workspace.name}"
              </p>
            </div>
          </div>

          {/* Delete button */}
          <button
            type="button"
            onClick={handleDeleteProject}
            disabled={isDeleting}
            className={`px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg font-medium transition-colors text-sm ${
              isDeleting
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                در حال حذف...
              </>
            ) : (
              <>
                <FaTrash />
                حذف پروژه
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main form content */}
      <div className="max-w-4xl mx-auto w-full">
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
            {/* Basic information section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                اطلاعات پایه
              </h3>

              <div className="space-y-6">
                {/* Project name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نام پروژه <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="مثال: پروژه مدیریت وظایف"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={50}
                    required
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {formData.name.length}/۵۰ کاراکتر
                  </p>
                </div>

                {/* Project description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    توضیحات
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="توضیحات درباره پروژه، اهداف و خروجی‌های مورد انتظار..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {formData.description.length}/۵۰۰ کاراکتر
                  </p>
                </div>
              </div>
            </div>

            {/* Color and status selection */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Color selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    رنگ پروژه
                  </label>
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
                          className={`relative ${color.class} w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center transition-transform hover:scale-105`}
                        >
                          {formData.color === color.id && (
                            <div className="absolute inset-0 border-2 border-white rounded-lg"></div>
                          )}
                        </div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    وضعیت پروژه
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {statusOptions.map((status) => (
                      <button
                        key={status.id}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            status: status.id,
                          }))
                        }
                        className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          formData.status === status.id
                            ? 'ring-2 ring-blue-500 ring-offset-2 ' +
                              status.color
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {status.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tags section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تگ‌ها
              </label>
              <div className="mb-3">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaTag />
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="تگ را وارد کرده و Enter بزنید"
                    className="w-full px-10 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={20}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  برای اضافه کردن تگ، آن را وارد کرده و Enter بزنید (حداکثر ۱۰
                  تگ)
                </p>
              </div>

              {/* Tags list */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm flex items-center gap-2"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                اطلاعات تکمیلی
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start date - Display only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تاریخ شروع
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaCalendar />
                    </div>
                    <div className="w-full px-10 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white">
                      {formData.startDate
                        ? formatDateForDisplay(formData.startDate)
                        : 'تعیین نشده'}
                    </div>
                  </div>
                </div>

                {/* End date - Display only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تاریخ پایان
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaCalendar />
                    </div>
                    <div className="w-full px-10 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white">
                      {formData.endDate
                        ? formatDateForDisplay(formData.endDate)
                        : 'تعیین نشده'}
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    بودجه (اختیاری)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="مبلغ به تومان"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.budget && (
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        تومان
                      </div>
                    )}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اولویت
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority.id} value={priority.id}>
                        {priority.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Preview section */}
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                پیش‌نمایش تغییرات
              </h4>
              <div className="flex items-center gap-4">
                <div
                  className={`${selectedColor.class} w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold`}
                >
                  {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 dark:text-white">
                    {formData.name || 'نام پروژه'}
                  </h5>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${selectedStatus.color}`}
                    >
                      {selectedStatus.name}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${selectedPriority.color}`}
                    >
                      {selectedPriority.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                انصراف
              </button>

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
                    در حال ذخیره...
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
        </form>
      </div>
    </div>
  );
};

export default EditFlowWorkspacePage;
