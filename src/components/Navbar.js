import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Bars3Icon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [desktopSidebarVisible, setDesktopSidebarVisible] = useState(true);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const toggleDesktopSidebar = () => {
        setDesktopSidebarVisible(!desktopSidebarVisible);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={toggleSidebar}
                    className="text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md transition-all duration-300"
                >
                    {sidebarOpen ? (
                        <XMarkIcon className="h-6 w-6" />
                    ) : (
                        <Bars3Icon className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Desktop Toggle Button */}
            <div className="hidden md:block fixed top-4 right-4 z-50">
                <button
                    onClick={toggleDesktopSidebar}
                    className="text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md transition-all duration-300 bg-white dark:bg-gray-800 shadow-md"
                >
                    {desktopSidebarVisible ? (
                        <ChevronRightIcon className="h-6 w-6" />
                    ) : (
                        <ChevronLeftIcon className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Sidebar - Desktop */}
            <div className={`hidden md:block fixed right-0 top-0 bottom-0 bg-gray-800 dark:bg-gray-900 shadow-lg z-10 transition-all duration-300 ease-in-out ${desktopSidebarVisible ? 'w-64' : 'w-0'}`}>
                <div className={`flex flex-col h-full w-64 transition-all duration-300 ${desktopSidebarVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="p-4 border-b border-gray-700">
                        <h1 className="text-white text-lg font-bold">مدیریت موتوری</h1>
                    </div>
                    <div className="flex-1 px-4 py-6 space-y-2">
                        <Link
                            to="/accidents"
                            className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            onClick={closeSidebar}
                        >
                            تصادفات
                        </Link>
                        <Link
                            to="/vehicles"
                            className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            onClick={closeSidebar}
                        >
                            خودروها
                        </Link>
                        <Link
                            to="/stations"
                            className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            onClick={closeSidebar}
                        >
                            ایستگاه‌ها
                        </Link>
                        <Link
                            to="/passes"
                            className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            onClick={closeSidebar}
                        >
                            پاس‌های نگهبانی
                        </Link>
                        <Link
                            to="/guard-logs"
                            className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            onClick={closeSidebar}
                        >
                            لوح نگهبانی
                        </Link>
                        <Link
                            to="/personnel"
                            className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            onClick={closeSidebar}
                        >
                            پرسنل
                        </Link>
                        <Link
                            to="/roles"
                            className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            onClick={closeSidebar}
                        >
                            نقش‌ها
                        </Link>
                        <Link
                            to="/role-permissions"
                            className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            onClick={closeSidebar}
                        >
                            دسترسی‌های نقش
                        </Link>
                        <Link
                            to="/oils"
                            className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            onClick={closeSidebar}
                        >
                            انواع روغن‌ها
                        </Link>
                        <Link
                            to="/chat"
                            className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-200"
                            onClick={closeSidebar}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            چت
                        </Link>
                    </div>
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-300 text-sm">حالت نمایش</span>
                            <ThemeToggle />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            خروج
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div 
                    className={`fixed inset-0 bg-black transition-opacity duration-300 ${sidebarOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`} 
                    onClick={closeSidebar}
                ></div>
                <div className={`fixed right-0 top-0 bottom-0 w-64 bg-gray-800 dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h2 className="text-white text-lg font-bold">مدیریت موتوری</h2>
                            <button
                                onClick={closeSidebar}
                                className="text-gray-300 hover:text-white transition-colors duration-200"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex-1 px-4 py-6 space-y-2">
                            <Link
                                to="/accidents"
                                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
                                onClick={closeSidebar}
                            >
                                تصادفات
                            </Link>
                            <Link
                                to="/vehicles"
                                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
                                onClick={closeSidebar}
                            >
                                خودروها
                            </Link>
                            <Link
                                to="/stations"
                                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
                                onClick={closeSidebar}
                            >
                                ایستگاه‌ها
                            </Link>
                            <Link
                                to="/passes"
                                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
                                onClick={closeSidebar}
                            >
                                پاس‌های نگهبانی
                            </Link>
                            <Link
                                to="/guard-logs"
                                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
                                onClick={closeSidebar}
                            >
                                لوح نگهبانی
                            </Link>
                            <Link
                                to="/oils"
                                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
                                onClick={closeSidebar}
                            >
                                انواع روغن‌ها
                            </Link>
                            <Link
                                to="/chat"
                                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                                onClick={closeSidebar}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                چت
                            </Link>
                        </div>
                        <div className="p-4 border-t border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-300 text-sm">حالت نمایش</span>
                                <ThemeToggle />
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                خروج
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Wrapper */}
            <div className={`transition-all duration-300 ${desktopSidebarVisible ? 'md:mr-64' : 'md:mr-0'}`}>
                {/* Your main content goes here */}
            </div>
        </>
    );
};

export default Navbar; 