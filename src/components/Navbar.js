import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import ThemeToggle from '@contexts/ThemeToggle';
import Swal from 'sweetalert2';

import {
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  FaRobot,
  FaMicrophone,
  FaMagic,
  FaProjectDiagram,
  FaBook,
  FaCog,
  FaFileAlt,
  FaLink,
  FaFolderOpen,
  FaChartLine,
} from 'react-icons/fa';

import { IoDocuments } from 'react-icons/io5';
import { toEnglishLetter } from '../utils/translate';

const NavList = ({ items, onNavigate, closeSidebar }) => (
  <ul className="flex flex-col gap-2">
    {items.map(({ path, label, icon: Icon }) => (
      <li key={path} className="text-right">
        <button
          onClick={() => {
            onNavigate(path);
            closeSidebar?.();
          }}
          className="flex items-center gap-2 w-full text-right text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
        >
          {Icon && (
            <Icon className="w-4 h-4 text-gray-300 group-hover:text-white" />
          )}
          {label}
        </button>
      </li>
    ))}
  </ul>
);

const Navbar = ({ onSidebarCollapse }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [documentsDropdownOpen, setDocumentsDropdownOpen] = useState(false);
  const navItems = [
    { path: '/chat', label: 'چت', icon: FaRobot },
    { path: '/wizard', label: 'پاسخ‌های هوشمند', icon: FaMagic },
    { path: '/workflow', label: 'گردش کار', icon: FaProjectDiagram },
    { path: '/instructions', label: 'دستورالعمل‌ها', icon: FaBook },
    { path: '/monitoring', label: 'مانیتورینگ', icon: FaChartLine },
  ];

  const documentItems = [
    { path: '/document/manuals', label: 'مستندات دستی ', icon: FaBook },
    { path: '/document', label: 'مستندات', icon: FaFileAlt },
    { path: '/crawl-url', label: 'جمع‌آوری URL', icon: FaLink },
    { path: '/processes', label: 'فرایندها', icon: FaProjectDiagram },
  ];

  const handleLogout = async () => {
    try {
      resetUIState();
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  function getBadgeLetters(name = '') {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] || '';
    const second = parts[1]?.[0] || '';
    return (first + second).toUpperCase();
  }

  const resetUIState = () => {
    setSidebarOpen(false);
    setDesktopSidebarCollapsed(false);
    setDocumentsDropdownOpen(false);
    onSidebarCollapse(false);
  };

  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const closeSidebar = () => {
    setSidebarOpen(false);
    setDocumentsDropdownOpen(false);
  };
  const toggleDesktopSidebar = () => {
    setDesktopSidebarCollapsed((prev) => {
      const newState = !prev;
      onSidebarCollapse(newState);
      return newState;
    });
  };
  const toggleDocumentsDropdown = () => setDocumentsDropdownOpen((v) => !v);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'HIDE_NAVBAR') {
        setSidebarOpen(false);
        setDesktopSidebarCollapsed(true);
        onSidebarCollapse(true);
      } else if (event.data.type === 'SHOW_NAVBAR') {
        setDesktopSidebarCollapsed(false);
        onSidebarCollapse(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSidebarCollapse]);

  return (
    <div dir="rtl">
      <div className="md:hidden fixed top-1 right-1 z-50">
        <button
          onClick={toggleSidebar}
          className="text-gray-800 backdrop-blur-sm dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-md transition-all duration-300"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      <button
        onClick={toggleDesktopSidebar}
        className="hidden md:flex fixed right-64 top-4 z-50 items-center justify-center w-6 h-6 bg-gray-800 dark:bg-gray-900 text-gray-300 hover:text-white rounded-l-md border border-gray-700 border-r-0 transition-all duration-300 hover:bg-gray-700"
        style={{
          transform: desktopSidebarCollapsed
            ? 'translateX(16rem)'
            : 'translateX(0)',
        }}
        aria-label="Toggle desktop sidebar"
      >
        {desktopSidebarCollapsed ? (
          <ChevronLeftIcon className="h-4 w-4" />
        ) : (
          <ChevronRightIcon className="h-4 w-4" />
        )}
      </button>

      <aside
        className={`hidden md:block fixed right-0 top-0 bottom-0 bg-gray-800 dark:bg-gray-900 shadow-lg transition-all duration-300 ${
          desktopSidebarCollapsed ? 'w-0' : 'w-64'
        }`}
        aria-expanded={!desktopSidebarCollapsed}
      >
        <div
          className={`flex flex-col h-full transition-all duration-300 ${
            desktopSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-64'
          }`}
        >
          <header className="p-4 border-b flex w-full justify-between border-gray-700 whitespace-nowrap overflow-hidden">
            <h1 className="text-white text-lg font-bold">مدیریت چت</h1>
            <ThemeToggle />
          </header>

          <nav className="flex-1 p-2 overflow-hidden">
            <NavList items={navItems} onNavigate={navigate} />
            <div className="mt-2">
              <button
                onClick={toggleDocumentsDropdown}
                className="flex items-center gap-2 w-full text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                aria-expanded={documentsDropdownOpen}
                aria-controls="documents-dropdown"
              >
                <FaFolderOpen className="w-4 h-4 text-gray-300 group-hover:text-white" />

                <p>اسناد</p>
                <ChevronDownIcon
                  className={`h-4 w-4 mr-2 transition-transform duration-200 ${
                    documentsDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                id="documents-dropdown"
                className={`mr-4 overflow-hidden transition-all duration-200 ${
                  documentsDropdownOpen
                    ? 'max-h-48 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <NavList items={documentItems} onNavigate={navigate} />
              </div>
            </div>
            <button
              onClick={() => navigate('/setting')}
              className="flex mt-1 items-center gap-2 w-full text-right text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
            >
              <FaCog className="w-4 h-4 text-gray-300 group-hover:text-white" />
              <p>تنظیمات</p>
            </button>
          </nav>

          <footer className="p-2 flex border-t items-center justify-center border-gray-700  overflow-hidden">
            <div className="h-full w-full h-14 flex items-center gap-2">
              <span className="w-12 h-10 flex font-sans -mb-1 items-center justify-center font-bold text-white rounded-full bg-blue-500">
                {getBadgeLetters(user?.name) || 'U'}
              </span>

              <div className="h-full w-full h-14 flex justify-center flex-col gap-1">
                <p className="text-white text-xs w-32 truncate">
                  {user ? `${user.name}` : 'Guest'}
                </p>
                <p className="text-white text-xs w-32 truncate">
                  {user?.email || 'example@example.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-end hover:scale-105 gap-2 justify-end text-gray-300 hover:text-white rounded-md text-sm font-medium transition-colors duration-200"
            >
              <ArrowLeftEndOnRectangleIcon className="w-10 h-6 text-white" />
            </button>
          </footer>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 transition-opacity duration-300 opacity-100">
          <div
            className="fixed inset-0 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeSidebar}
          />
          <aside
            className="fixed right-0 top-0 bottom-0 w-64 bg-gray-800 dark:bg-gray-900 shadow-lg transform transition-transform duration-300 translate-x-0"
            aria-label="Mobile sidebar"
          >
            <div className="flex flex-col h-full">
              <header className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex gap-2 items-center">
                  <ThemeToggle />

                  <h2 className="text-white text-lg font-bold">مدیریت چت</h2>
                </div>
                <button
                  onClick={closeSidebar}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="Close sidebar"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </header>

              <nav className="flex-1 py-2 overflow-y-auto">
                <NavList
                  items={navItems}
                  onNavigate={navigate}
                  closeSidebar={closeSidebar}
                />
                <div className="mt-2">
                  <button
                    onClick={toggleDocumentsDropdown}
                    className="flex items-center gap-2 w-full text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    aria-expanded={documentsDropdownOpen}
                    aria-controls="mobile-documents-dropdown"
                  >
                    <FaFolderOpen className="w-4 h-4 text-gray-300 group-hover:text-white" />

                    <p>اسناد</p>
                    <ChevronDownIcon
                      className={`h-4 w-4 mr-2 transition-transform duration-200 ${
                        documentsDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {documentsDropdownOpen && (
                    <ul
                      id="mobile-documents-dropdown"
                      className="mr-4 space-y-1"
                    >
                      <NavList
                        items={documentItems}
                        onNavigate={navigate}
                        closeSidebar={closeSidebar}
                      />
                    </ul>
                  )}
                </div>
                <button
                  onClick={() => navigate('/setting')}
                  className="flex mt-1 items-center gap-2 w-full text-right text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  <FaCog className="w-4 h-4 text-gray-300 group-hover:text-white" />
                  <p>تنظیمات</p>
                </button>
              </nav>

              <footer className="p-4 border-t border-gray-700 flex items-center justify-center">
                <div className="h-full w-full h-14 flex items-center gap-2">
                  <span className="w-12 h-10 flex font-sans px-1 items-center justify-center font-bold text-white rounded-full bg-blue-500">
                    {getBadgeLetters(user?.name) || 'U'}
                  </span>
                  <div className="h-full w-full h-14 flex justify-center flex-col gap-1">
                    <p className="text-white text-xs w-32 truncate">
                      {user ? `${user.name}` : 'Guest'}
                    </p>
                    <p className="text-white text-xs w-32 truncate">
                      {user?.email || 'example@example.com'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-end hover:scale-105 gap-2 justify-end text-gray-300 hover:text-white rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <ArrowLeftEndOnRectangleIcon className="w-10 h-6 text-white" />
                </button>
              </footer>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Navbar;
