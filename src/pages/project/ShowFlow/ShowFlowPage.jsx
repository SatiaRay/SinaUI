import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Icon from './Icon'; // Import the Icon component
import { notify } from '@components/ui/toast';
import { confirm } from '@components/ui/alert/confirmation';
import ShowFlowLoading from './ShowFlowLoading';
import { useDisplay } from '../../../hooks/display';

/**
 * ShowFlowPage Component - Main project detail page
 * @component
 * @returns {JSX.Element} Rendered project detail page
 */
const ShowFlowPage = () => {
  /**
   * Get workspace ID from localStorage
   * @type {string|null}
   */
  const workspaceId = localStorage.getItem('khan-selected-workspace-id');

  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isMobile, isDesktop } = useDisplay();

  /**
   * Loading state for data
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Workspace data state
   */
  const [workspace, setWorkspace] = useState(null);

  /**
   * Project data state
   */
  const [project, setProject] = useState(null);

  /**
   * Active sidebar section
   */
  const [activeSection, setActiveSection] = useState('overview');

  /**
   * Sidebar sections
   * @type {Array<Object>}
   */
  const sidebarSections = [
    {
      id: 'overview',
      name: 'مرور کلی',
      icon: <Icon name="BarChart3" size={20} />,
    },
    { id: 'tasks', name: 'وظایف', icon: <Icon name="CheckSquare" size={20} /> },
    { id: 'members', name: 'اعضا', icon: <Icon name="Users" size={20} /> },
    { id: 'files', name: 'فایل‌ها', icon: <Icon name="Folder" size={20} /> },
    { id: 'activity', name: 'فعالیت‌ها', icon: <Icon name="Bell" size={20} /> },
    {
      id: 'settings',
      name: 'تنظیمات',
      icon: <Icon name="Settings" size={20} />,
    },
  ];

  /**
   * Get status info for a project
   * @param {string} status - Project status
   * @returns {Object} Status color and text
   */
  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return {
          color:
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          text: 'فعال',
        };
      case 'on-hold':
        return {
          color:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          text: 'در انتظار',
        };
      case 'completed':
        return {
          color:
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          text: 'تکمیل شده',
        };
      case 'planning':
        return {
          color:
            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          text: 'در حال برنامه‌ریزی',
        };
      case 'archived':
        return {
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          text: 'آرشیو شده',
        };
      default:
        return {
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          text: 'نامشخص',
        };
    }
  };

  /**
   * Format date for display
   * @param {string} dateString - Date string
   * @returns {string} Formatted date string
   */
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'تعیین نشده';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fa-IR');
    } catch (error) {
      return dateString;
    }
  };

  /**
   * Load workspace and project data
   */
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // Check if workspace ID exists in localStorage
        if (!workspaceId) {
          notify.error('فضای کاری انتخاب نشده است');
          navigate('/workspace');
          return;
        }

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

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

        // Parse workspace ID from localStorage (stored as string)
        const workspaceIdNum = parseInt(workspaceId);

        const foundWorkspace = mockWorkspaces.find(
          (w) => w.id === workspaceIdNum
        );

        if (!foundWorkspace) {
          notify.error('فضای کاری مورد نظر یافت نشد');
          navigate('/workspace');
          return;
        }
        setWorkspace(foundWorkspace);

        // Load project data
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
              creator: {
                id: 1,
                name: 'علیرضا محمدی',
                avatar: 'AM',
              },
              members: [
                {
                  id: 1,
                  name: 'علیرضا محمدی',
                  role: 'مدیر پروژه',
                  avatar: 'AM',
                },
                {
                  id: 2,
                  name: 'مریم کریمی',
                  role: 'توسعه دهنده',
                  avatar: 'MK',
                },
                { id: 3, name: 'رضا احمدی', role: 'توسعه دهنده', avatar: 'RA' },
                { id: 4, name: 'سارا نوروزی', role: 'طراح', avatar: 'SN' },
                { id: 5, name: 'محمد حسینی', role: 'تست‌کننده', avatar: 'MH' },
              ],
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
              creator: {
                id: 2,
                name: 'مریم کریمی',
                avatar: 'MK',
              },
              members: [
                { id: 2, name: 'مریم کریمی', role: 'مدیر پروژه', avatar: 'MK' },
                {
                  id: 1,
                  name: 'علیرضا محمدی',
                  role: 'مشاور فنی',
                  avatar: 'AM',
                },
                {
                  id: 6,
                  name: 'فاطمه رضایی',
                  role: 'توسعه دهنده',
                  avatar: 'FR',
                },
              ],
            },
          ];
        }

        // Parse project ID from URL params
        const projectIdNum = parseInt(projectId);

        const foundProject = projectsToSearch.find(
          (p) => p.id === projectIdNum && p.workspaceId === workspaceIdNum
        );

        if (!foundProject) {
          // Check if project exists but belongs to different workspace
          const projectInOtherWorkspace = projectsToSearch.find(
            (p) => p.id === projectIdNum
          );

          if (projectInOtherWorkspace) {
            notify.error('این پروژه متعلق به این فضای کاری نیست');
            navigate(`/projects`);
          } else {
            notify.error('پروژه مورد نظر یافت نشد');
            navigate(`/projects`);
          }
          return;
        }
        setProject(foundProject);
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
   * Handle edit project
   */
  const handleEditProject = () => {
    navigate(`/projects/edit/${projectId}`);
  };

  /**
   * Handle archive project
   * @returns {Promise<void>}
   */
  const handleArchiveProject = () => {
    confirm({
      title:
        project.status === 'archived' ? 'بازگردانی پروژه' : 'آرشیو کردن پروژه',
      text:
        project.status === 'archived'
          ? `آیا می‌خواهید پروژه "${project.name}" را از آرشیو خارج کنید؟`
          : `آیا می‌خواهید پروژه "${project.name}" را آرشیو کنید؟`,
      onConfirm: async () => {
        try {
          // Check if workspace ID exists
          if (!workspaceId) {
            notify.error('فضای کاری انتخاب نشده است');
            return;
          }

          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Parse workspace ID from localStorage (stored as string)
          const workspaceIdNum = parseInt(workspaceId);

          // Parse project ID from URL params
          const projectIdNum = parseInt(projectId);

          // Update project status
          const updatedProject = {
            ...project,
            status: project.status === 'archived' ? 'active' : 'archived',
            updatedAt: new Date().toISOString(),
          };

          // Update in localStorage
          const existingProjects = JSON.parse(
            localStorage.getItem('khan-projects') || '[]'
          );
          const updatedProjects = existingProjects.map((p) =>
            p.id === projectIdNum ? updatedProject : p
          );
          localStorage.setItem(
            'khan-projects',
            JSON.stringify(updatedProjects)
          );

          // Update state
          setProject(updatedProject);

          notify.success(
            project.status === 'archived'
              ? 'پروژه با موفقیت بازگردانی شد'
              : 'پروژه با موفقیت آرشیو شد'
          );
        } catch (error) {
          notify.error('خطا در آرشیو/بازگردانی پروژه');
          console.error('Error archiving project:', error);
        }
      },
    });
  };

  /**
   * Handle delete project
   * @returns {Promise<void>}
   */
  const handleDeleteProject = () => {
    confirm({
      title: 'حذف پروژه',
      text: `آیا مطمئن هستید که می‌خواهید پروژه "${project.name}" را حذف کنید؟ این عمل غیرقابل بازگشت است.`,
      confirmText: 'حذف کن',
      confirmColor: 'red',
      onConfirm: async () => {
        try {
          // Check if workspace ID exists
          if (!workspaceId) {
            notify.error('فضای کاری انتخاب نشده است');
            return;
          }

          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Parse project ID from URL params
          const projectIdNum = parseInt(projectId);

          // Remove from localStorage
          const existingProjects = JSON.parse(
            localStorage.getItem('khan-projects') || '[]'
          );
          const updatedProjects = existingProjects.filter(
            (p) => p.id !== projectIdNum
          );
          localStorage.setItem(
            'khan-projects',
            JSON.stringify(updatedProjects)
          );

          notify.success('پروژه با موفقیت حذف شد');

          // Redirect to projects list page
          navigate(`/projects`);
        } catch (error) {
          notify.error('خطا در حذف پروژه');
          console.error('Error deleting project:', error);
        }
      },
    });
  };

  /**
   * Get priority info
   * @param {string} priority - Priority level
   * @returns {Object} Priority color and text
   */
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'urgent':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          text: 'فوری',
        };
      case 'high':
        return {
          color:
            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
          text: 'بالا',
        };
      case 'medium':
        return {
          color:
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          text: 'متوسط',
        };
      case 'low':
        return {
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          text: 'کم',
        };
      default:
        return {
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          text: 'نامشخص',
        };
    }
  };

  /**
   * Format budget with comma separators
   * @param {string} value - Budget value
   * @returns {string} Formatted budget
   */
  const formatBudget = (value) => {
    if (!value) return 'تعیین نشده';
    return parseInt(value).toLocaleString('fa-IR') + ' تومان';
  };

  /**
   * Calculate days remaining until project end date
   * @param {string} endDate - Project end date
   * @returns {string} Days remaining or ∞ if no end date
   */
  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return '∞';

    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays.toString() : '0';
  };

  /**
   * Render active section content
   * @returns {JSX.Element} Section content
   */
  const renderSectionContent = () => {
    const statusInfo = getStatusInfo(project.status);
    const priorityInfo = getPriorityInfo(project.priority);

    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Project stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  پیشرفت کلی
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {project.progress}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {project.taskCount} وظیفه
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      project.progress < 30
                        ? 'bg-red-500'
                        : project.progress < 70
                          ? 'bg-yellow-500'
                          : project.progress < 100
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  اعضای تیم
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {project.memberCount}
                  </span>
                  <div className="flex -space-x-2">
                    {project.members &&
                      project.members.slice(0, 3).map((member) => (
                        <div
                          key={member.id}
                          className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 border-2 border-white dark:border-gray-800"
                          title={member.name}
                        >
                          {member.avatar}
                        </div>
                      ))}
                    {project.memberCount > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-800">
                        +{project.memberCount - 3}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {project.memberCount} عضو فعال
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  مهلت باقی‌مانده
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {calculateDaysRemaining(project.endDate)}
                  </span>
                  <Icon
                    name="Calendar"
                    className="text-gray-400 text-lg"
                    size={20}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {project.endDate
                    ? 'روز تا پایان پروژه'
                    : 'تاریخ پایان تعیین نشده'}
                </p>
              </div>
            </div>

            {/* Project details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                جزئیات پروژه
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    وضعیت
                  </p>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}
                  >
                    {statusInfo.text}
                  </span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    اولویت
                  </p>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${priorityInfo.color}`}
                  >
                    {priorityInfo.text}
                  </span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    بودجه
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatBudget(project.budget)}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    تاریخ ایجاد
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDateForDisplay(project.createdAt)}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    تگ‌ها
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                فعالیت‌های اخیر
              </h3>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    user: 'علیرضا محمدی',
                    action: 'وظیفه جدید ایجاد کرد',
                    time: '۲ ساعت پیش',
                  },
                  {
                    id: 2,
                    user: 'مریم کریمی',
                    action: 'وضعیت پروژه را به روز کرد',
                    time: '۴ ساعت پیش',
                  },
                  {
                    id: 3,
                    user: 'رضا احمدی',
                    action: 'فایل جدید آپلود کرد',
                    time: '۱ روز پیش',
                  },
                  {
                    id: 4,
                    user: 'سارا نوروزی',
                    action: 'نظر جدید اضافه کرد',
                    time: '۲ روز پیش',
                  },
                ].map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span>{' '}
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                وظایف پروژه ({project.taskCount})
              </h3>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors">
                + ایجاد وظیفه جدید
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              مدیریت و مشاهده تمام وظایف این پروژه
            </p>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Icon
                name="CheckSquare"
                size={48}
                className="mx-auto mb-3 opacity-50"
              />
              <p>این بخش در حال توسعه است</p>
              <p className="text-sm mt-1">
                به زودی امکان مدیریت وظایف اضافه خواهد شد
              </p>
            </div>
          </div>
        );

      case 'members':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                اعضای تیم ({project.memberCount})
              </h3>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                <Icon name="User" size={18} />
                دعوت عضو جدید
              </button>
            </div>

            <div className="space-y-4">
              {project.members &&
                project.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        {member.avatar}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <Icon name="Share2" size={18} />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Icon name="Trash2" size={18} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Icon
                name="Settings"
                size={48}
                className="mx-auto mb-3 opacity-50"
              />
              <p>این بخش در حال توسعه است</p>
              <p className="text-sm mt-1">به زودی این ویژگی اضافه خواهد شد</p>
            </div>
          </div>
        );
    }
  };

  /**
   * Show loading skeleton if data is loading
   */
  if (isLoading || !workspace || !project) {
    return <ShowFlowLoading />;
  }

  const statusInfo = getStatusInfo(project.status);

  return (
    <div className="h-full flex flex-col justify-start px-3 md:px-0 pt-4 md:pt-6">
      {/* Breadcrumb navigation */}
      <div className="md:mx-0 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link
            to="/workspace"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            فضای کاری
          </Link>
          <span>›</span>
          <Link
            to={`/projects`}
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            پروژه‌ها
          </Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {project.name}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1">
          {/* Project header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`${project.color} w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold`}
                >
                  {project.letter}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {project.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}
                    >
                      {statusInfo.text}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      در فضای کاری {workspace.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleEditProject}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                >
                  <Icon name="Edit" size={18} />
                  ویرایش
                </button>
                <button
                  onClick={handleArchiveProject}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                    project.status === 'archived'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }`}
                >
                  <Icon name="Archive" size={18} />
                  {project.status === 'archived' ? 'بازگردانی' : 'آرشیو'}
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                >
                  <Icon name="Trash2" size={18} />
                  حذف
                </button>
              </div>
            </div>

            {/* Project description */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                توضیحات
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {project.description || 'توضیحی برای این پروژه ثبت نشده است.'}
              </p>
            </div>

            {/* Project details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  تاریخ شروع
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDateForDisplay(project.startDate)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  تاریخ پایان
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDateForDisplay(project.endDate)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  ایجاد کننده
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {project.creator?.name || 'نامشخص'}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  آخرین بروزرسانی
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDateForDisplay(project.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Active section content */}
          {renderSectionContent()}
        </div>

        {/* Sidebar */}
        <div className="lg:w-80">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              بخش‌ها
            </h3>

            {/* Sidebar sections */}
            <div className="space-y-2 mb-8">
              {sidebarSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-medium">{section.name}</span>
                </button>
              ))}
            </div>

            {/* Team members */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              اعضای تیم
            </h3>
            <div className="space-y-3">
              {project.members &&
                project.members.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              {project.memberCount > 3 && (
                <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-2">
                  مشاهده همه اعضا ({project.memberCount})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowFlowPage;
