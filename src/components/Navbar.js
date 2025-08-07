import {
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../contexts/ThemeToggle";

const Navbar = ({ onSidebarCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [documentsDropdownOpen, setDocumentsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(false);

  const handleLogout = async () => {
    try {
      setDesktopSidebarCollapsed(false);
      setSidebarOpen(false);
      setDocumentsDropdownOpen(false);
      setUserDropdownOpen(false);
      onSidebarCollapse(false);

      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setDocumentsDropdownOpen(false);
  };

  const toggleDesktopSidebar = () => {
    const newState = !desktopSidebarCollapsed;
    setDesktopSidebarCollapsed(newState);
    onSidebarCollapse(newState);
  };

  const toggleDocumentsDropdown = () => {
    setDocumentsDropdownOpen(!documentsDropdownOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "HIDE_NAVBAR") {
        setSidebarOpen(false);
        setDesktopSidebarCollapsed(true);
        onSidebarCollapse(true);
        const toggleButton = document.querySelector(
          ".md\\:flex.fixed.right-64.top-4"
        );
        if (toggleButton) toggleButton.style.display = "none";
      } else if (event.data.type === "SHOW_NAVBAR") {
        setDesktopSidebarCollapsed(false);
        onSidebarCollapse(false);
        const toggleButton = document.querySelector(
          ".md\\:flex.fixed.right-64.top-4"
        );
        if (toggleButton) toggleButton.style.display = "block";
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSidebarCollapse]);

  return (
    <>
      {/* {user && (
        <div className="flex items-center space-x-2">
          <div className="relative text-left">
            <button
              onClick={toggleUserDropdown}
              className="flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <UserCircleIcon className="h-6 w-6 ml-3" />
              <span className="font-medium">
                {`${user.first_name} ${user.last_name}` || user.email}
              </span>
            </button>
          
          </div>
        </div>
     )}  */}

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

      <button
        onClick={toggleDesktopSidebar}
        className="hidden md:flex fixed right-64 top-4 z-50 items-center justify-center w-6 h-6 bg-gray-800 dark:bg-gray-900 text-gray-300 hover:text-white rounded-l-md border border-gray-700 border-r-0 transition-all duration-300 hover:bg-gray-700"
        style={{
          transform: desktopSidebarCollapsed
            ? "translateX(16rem)"
            : "translateX(0)",
        }}
      >
        {desktopSidebarCollapsed ? (
          <ChevronLeftIcon className="h-4 w-4" />
        ) : (
          <ChevronRightIcon className="h-4 w-4" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block fixed right-0 top-0 bottom-0 bg-gray-800 dark:bg-gray-900 shadow-lg transition-all duration-300 ${
          desktopSidebarCollapsed ? "w-0" : "w-64"
        }`}
      >
        <div
          className={`flex flex-col h-full transition-all duration-300 ${
            desktopSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-64"
          }`}
        >
          <div className="p-4 border-b flex w-full justify-between border-gray-700 whitespace-nowrap overflow-hidden">
            <h1 className="text-white text-lg font-bold">مدیریت چت</h1>
            <button
              onClick={() => setUserInfo(!userInfo)}
              className="flex gap-1 items-center p-1 hover:bg-blue-500 bg-gray-700 rounded-lg"
            >
              <UserIcon className="text-white w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 w-full p-2 space-y-2 overflow-hidden relative">
            {userInfo && (
              <div className="flex gap-1 p-1 rounded-lg flex-col w-60 bg-gray-400 absolute z-10">
                <p className="py-1 bg-gray-600 px-1 text-white text-sm text-center rounded-lg w-full text-red-6-00">
                  {user.first_name}
                </p>
                <p className="py-1 bg-gray-600 px-1 text-white text-sm text-center rounded-lg w-full">
                  {user.last_name}
                </p>
                <p className="py-1 bg-gray-600 px-1 text-white text-sm text-center rounded-lg w-full">
                  {user.email}
                </p>
              </div>
            )}

            <Link
              to="/chat"
              className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
            >
              چت
            </Link>
            <Link
              to="/voice-agent"
              className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
            >
              گفتگوی صوتی
            </Link>
            <div>
              <button
                onClick={toggleDocumentsDropdown}
                className="flex items-center w-full text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
              >
                اسناد
                <ChevronDownIcon
                  className={`h-4 w-4 mr-2 transition-transform duration-200 ${
                    documentsDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`mr-4 overflow-hidden transition-all duration-200 ${
                  documentsDropdownOpen
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <Link
                  to="/document/manuals"
                  className="block text-gray-400 hover:bg-gray-600 hover:text-white px-8 py-1 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  خزش دستی
                </Link>
                <Link
                  to="/document"
                  className="block text-gray-400 hover:bg-gray-600 hover:text-white px-8 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  خزیده شده‌ها
                </Link>
                <Link
                  to="/crawl-url"
                  className="block text-gray-400 hover:bg-gray-600 hover:text-white px-8 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                  onClick={closeSidebar}
                >
                  خزش URL
                </Link>

                <Link
                  to="/processes"
                  className="block text-gray-400 hover:bg-gray-600 hover:text-white px-8 py-1 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  پردازش
                </Link>
              </div>
            </div>
            <Link
              to="/wizard"
              className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
            >
              پاسخ‌های ویزارد
            </Link>
            <Link
              to="/workflow"
              className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
            >
              گردش کار
            </Link>
            <Link
              to="/instructions"
              className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
            >
              دستور العمل های بات
            </Link>
          </div>
          <div className="p-4 border-t border-gray-700 overflow-hidden">
            <div className="flex items-center mb-2 w-full justify-between">
              <span className="text-gray-300 text-sm">حالت نمایش</span>
              <ThemeToggle />
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 bg-gray-600"
            >
              <p className="text-sm text-white">خروج</p>

              <ArrowLeftEndOnRectangleIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            sidebarOpen ? "bg-opacity-50" : "bg-opacity-0"
          }`}
          onClick={closeSidebar}
        ></div>
        <div
          className={`fixed right-0 top-0 bottom-0 w-64 bg-gray-800 dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex gap-2">
                <button className="flex gap-1 items-center p-1 bg-gray-700 rounded-lg">
                  <UserIcon className="text-white w-4 h-4" />
                </button>

                <h2 className="text-white text-lg font-bold">مدیریت چت</h2>
              </div>

              <button
                onClick={closeSidebar}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 py-2 space-y-2">
              <Link
                to="/chat"
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
                onClick={closeSidebar}
              >
                چت
              </Link>
              <Link
                to="/voice-agent"
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
              >
                گفتگوی صوتی
              </Link>
              <div>
                <button
                  onClick={toggleDocumentsDropdown}
                  className="flex items-center w-full text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  اسناد
                  <ChevronDownIcon
                    className={`h-4 w-4 mr-2 transition-transform duration-200 ${
                      documentsDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`mr-4 overflow-hidden transition-all duration-200 ${
                    documentsDropdownOpen
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <Link
                    to="/document/manuals"
                    className="block text-gray-400 hover:bg-gray-600 hover:text-white px-8 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                    onClick={closeSidebar}
                  >
                    خزش دستی
                  </Link>
                  <Link
                    to="/document"
                    className="block text-gray-400 hover:bg-gray-600 hover:text-white px-8 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                    onClick={closeSidebar}
                  >
                    خزیده شده‌ها
                  </Link>
                  <Link
                    to="/crawl-url"
                    className="block text-gray-400 hover:bg-gray-600 hover:text-white px-8 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                    onClick={closeSidebar}
                  >
                    خزش URL
                  </Link>

                  <Link
                    to="/processes"
                    className="block text-gray-400 hover:bg-gray-600 hover:text-white px-8 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                    onClick={closeSidebar}
                  >
                    پردازش
                  </Link>
                </div>
              </div>
              <Link
                to="/wizard"
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
                onClick={closeSidebar}
              >
                پاسخ‌های ویزارد
              </Link>
              <Link
                to="/workflow"
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                onClick={closeSidebar}
              >
                گردش کار
              </Link>
              <Link
                to="/instructions"
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                onClick={closeSidebar}
              >
                دستور العمل های بات
              </Link>
            </div>
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">حالت نمایش</span>
                <ThemeToggle />
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 bg-gray-600 justify-center text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <p className="text-sm text-white">خروج</p>

                <ArrowLeftEndOnRectangleIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
