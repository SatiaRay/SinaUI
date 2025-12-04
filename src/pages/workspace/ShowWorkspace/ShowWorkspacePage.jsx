import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaUsers,
  FaProjectDiagram,
  FaCalendar,
  FaCrown,
  FaUser,
  FaEdit,
  FaTasks,
} from 'react-icons/fa';
import { notify } from '../../../components/ui/toast';
import ShowWorkspaceLoading from './ShowWorkspaceLoading';
import { useDisplay } from '../../../hooks/display';

/**
 * ShowWorkspacePage Component - Displays workspace details
 * @component
 * @returns {JSX.Element} Rendered workspace show page
 */
const ShowWorkspacePage = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { isMobile, isDesktop } = useDisplay();

  /**
   * Loading states
   */
  const [isLoading, setIsLoading] = useState(true);
  const [workspace, setWorkspace] = useState(null);
  const [projects, setProjects] = useState([]);

  /**
   * Load workspace data on component mount
   */
  useEffect(() => {
    const loadWorkspaceData = async () => {
      setIsLoading(true);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Get workspaces from localStorage (mock data)
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
            projectCount: 5,
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
            projectCount: 3,
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
            projectCount: 2,
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

        // Load projects for this workspace (mock data)
        const mockProjects = [
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
            createdAt: '2024-01-10',
            updatedAt: '2024-01-22',
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
            createdAt: '2024-01-05',
            updatedAt: '2024-01-20',
          },
          {
            id: 3,
            workspaceId: 1,
            name: 'اپلیکیشن موبایل',
            description: 'توسعه اپلیکیشن موبایل برای پلتفرم اصلی',
            color: 'bg-gradient-to-r from-purple-500 to-pink-500',
            letter: 'A',
            status: 'on-hold',
            taskCount: 42,
            memberCount: 7,
            createdAt: '2023-12-15',
            updatedAt: '2024-01-18',
          },
          {
            id: 4,
            workspaceId: 2,
            name: 'پروژه سرمایه‌گذاری',
            description: 'مدیریت پرتفوی سرمایه‌گذاری',
            color: 'bg-gradient-to-r from-indigo-500 to-blue-500',
            letter: 'I',
            status: 'active',
            taskCount: 8,
            memberCount: 4,
            createdAt: '2024-01-08',
            updatedAt: '2024-01-19',
          },
        ];

        const workspaceProjects = mockProjects
          .filter((project) => project.workspaceId === parseInt(workspaceId))
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        setProjects(workspaceProjects);
      } catch (error) {
        notify.error('خطا در بارگذاری اطلاعات فضای کاری');
        console.error('Error loading workspace:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkspaceData();
  }, [workspaceId, navigate]);

  /**
   * Get status color and text
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
      default:
        return {
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          text: 'نامشخص',
        };
    }
  };

  /**
   * Get role text based on user role
   * @param {string} role - User role in workspace
   * @returns {string} Role text
   */
  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return 'مدیر';
      case 'member':
        return 'عضو';
      case 'owner':
        return 'مالک';
      default:
        return 'عضو';
    }
  };

  /**
   * Handle manage projects button click
   */
  const handleManageProjects = () => {
    navigate(`/workspace/${workspace.id}/projects`);
  };

  /**
   * Show loading skeleton if data is loading
   */
  if (isLoading || !workspace) {
    return <ShowWorkspaceLoading />;
  }

  return (
    <div className="h-full flex flex-col justify-start px-3 md:px-0 pt-4 md:pt-6">
      {/* Page header */}
      <div className="md:mx-0 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              to="/workspace"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <FaArrowLeft className="text-lg" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {workspace.name}
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
                اطلاعات و جزئیات فضای کاری
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/workspace/edit/${workspace.id}`}
              className="px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg font-medium transition-all bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
            >
              <FaEdit />
              ویرایش فضای کاری
            </Link>
            <Link
              to={`/workspace/${workspace.id}/projects`}
              className="px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-md hover:shadow-lg"
            >
              <FaTasks />
              مدیریت پروژه‌ها
            </Link>
          </div>
        </div>
      </div>

      {/* Main content - Two column layout */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left column - Workspace info and stats */}
          <div className="lg:w-1/3">
            <div className="sticky top-6 space-y-6">
              {/* Workspace info card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
                <div className="flex flex-col items-center text-center mb-6">
                  {/* Workspace icon */}
                  <div
                    className={`${workspace.color} w-24 h-24 rounded-xl flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-6`}
                  >
                    {workspace.letter}
                  </div>

                  {/* Workspace info */}
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {workspace.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {workspace.description}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {workspace.plan}
                    </span>
                    <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 flex items-center gap-1">
                      {workspace.role === 'admin' ||
                      workspace.role === 'owner' ? (
                        <FaCrown className="text-xs" />
                      ) : (
                        <FaUser className="text-xs" />
                      )}
                      {getRoleText(workspace.role)}
                    </span>
                  </div>
                </div>

                {/* Workspace stats */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FaUsers className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          اعضا
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {workspace.memberCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <FaProjectDiagram className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          پروژه‌ها
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {projects.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
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

          {/* Right column - Projects preview */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
              {/* Projects header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    پروژه‌ها
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    پروژه‌های فعال در این فضای کاری
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {projects.length} پروژه
                  </div>
                  {projects.length > 0 && (
                    <Link
                      to={`/workspace/${workspace.id}/projects`}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      مشاهده همه
                    </Link>
                  )}
                </div>
              </div>

              {/* Projects list or empty state */}
              {projects.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {projects.slice(0, 4).map((project) => {
                      const statusInfo = getStatusInfo(project.status);
                      return (
                        <div
                          key={project.id}
                          className="group bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-all duration-300 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`${project.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold`}
                              >
                                {project.letter}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                  {project.name}
                                </h4>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}
                                >
                                  {statusInfo.text}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                            {project.description}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <FaUsers className="text-gray-400" />
                                <span>{project.memberCount}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <FaTasks className="text-gray-400" />
                                <span>{project.taskCount} کار</span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              آپدیت:{' '}
                              {new Date(project.updatedAt).toLocaleDateString(
                                'fa-IR'
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Show "View All" button if there are more than 4 projects */}
                  {projects.length > 4 && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to={`/workspace/${workspace.id}/projects`}
                        className="w-full py-3 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <span>مشاهده همه {projects.length} پروژه</span>
                        <FaTasks />
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                /* Empty projects state */
                <div className="text-center py-12 md:py-16">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaProjectDiagram className="text-gray-400 text-4xl" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    هنوز پروژه‌ای ایجاد نشده است
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    این فضای کاری هنوز پروژه‌ای ندارد. پس از ایجاد اولین پروژه،
                    آن را در اینجا مشاهده خواهید کرد.
                  </p>
                  <button
                    onClick={handleManageProjects}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                  >
                    <FaTasks />
                    مدیریت پروژه‌ها
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowWorkspacePage;
