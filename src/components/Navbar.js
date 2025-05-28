import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../contexts/ThemeToggle';
import { Bars3Icon, XMarkIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

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
        setDesktopSidebarCollapsed(!desktopSidebarCollapsed);
    };

    return (
        <>
            {/* Mobile Menu Button - Only visible on mobile */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={toggleSidebar}
                    className="text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md transition-all duration-300"
                >
                    {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </button>
            </div>

            {/* Desktop Sidebar Toggle Button */}
            <button
                onClick={toggleDesktopSidebar}
                className="hidden md:flex fixed right-64 top-4 z-50 items-center justify-center w-6 h-6 bg-gray-800 dark:bg-gray-900 text-gray-300 hover:text-white rounded-l-md border border-gray-700 border-r-0 transition-all duration-300 hover:bg-gray-700"
                style={{ transform: desktopSidebarCollapsed ? 'translateX(16rem)' : 'translateX(0)' }}
            >
                {desktopSidebarCollapsed ? (
                    <ChevronLeftIcon className="h-4 w-4" />
                ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                )}
            </button>

            {/* Desktop Sidebar - Always visible on desktop */}
            <div 
                className={`hidden md:block fixed right-0 top-0 bottom-0 bg-gray-800 dark:bg-gray-900 shadow-lg transition-all duration-300 ${
                    desktopSidebarCollapsed ? 'w-0' : 'w-64'
                }`}
            >
                <div className={`flex flex-col h-full transition-all duration-300 ${desktopSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="p-4 border-b border-gray-700">
                        <h1 className="text-white text-lg font-bold">مدیریت چت</h1>
                    </div>
                    <div className="flex-1 px-4 py-6 space-y-2">
                        <Link
                            to="/chat"
                            className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            چت ساده
                        </Link>
                        <Link
                            to="/data-sources"
                            className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            منابع داده
                        </Link>
                        <Link
                            to="/documents"
                            className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            اسناد
                        </Link>
                        <Link
                            to="/wizard"
                            className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            پاسخ‌های ویزارد
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

            {/* Mobile Sidebar - Only visible on mobile when toggled */}
            <div
                className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
                <div
                    className={`fixed inset-0 bg-black transition-opacity duration-300 ${
                        sidebarOpen ? 'bg-opacity-50' : 'bg-opacity-0'
                    }`}
                    onClick={closeSidebar}
                ></div>
                <div
                    className={`fixed right-0 top-0 bottom-0 w-64 bg-gray-800 dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ${
                        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h2 className="text-white text-lg font-bold">مدیریت چت</h2>
                            <button
                                onClick={closeSidebar}
                                className="text-gray-300 hover:text-white transition-colors duration-200"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex-1 px-4 py-6 space-y-2">
                            <Link
                                to="/chat"
                                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
                                onClick={closeSidebar}
                            >
                                چت
                            </Link>
                            <Link
                                to="/data-sources"
                                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
                                onClick={closeSidebar}
                            >
                                منابع داده
                            </Link>
                            <Link
                                to="/documents"
                                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
                                onClick={closeSidebar}
                            >
                                اسناد
                            </Link>
                            <Link
                                to="/wizard"
                                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
                                onClick={closeSidebar}
                            >
                                پاسخ‌های ویزارد
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
        </>
    );
};

export default Navbar;