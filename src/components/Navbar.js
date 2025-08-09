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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../contexts/ThemeToggle";

const Navbar = ({ onSidebarCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [documentsDropdownOpen, setDocumentsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Navigation items (avoids duplicate JSX)
  const navItems = [
    { path: "/chat", label: "چت" },
    { path: "/voice-agent", label: "گفتگوی صوتی" },
    { path: "/wizard", label: "پاسخ‌های ویزارد" },
    { path: "/workflow", label: "گردش کار" },
    { path: "/instructions", label: "دستور العمل های بات" },
  ];

  const documentItems = [
    { path: "/document/manuals", label: "خزش دستی" },
    { path: "/document", label: "خزیده شده‌ها" },
    { path: "/crawl-url", label: "خزش URL" },
    { path: "/processes", label: "پردازش" },
  ];

  const handleLogout = async () => {
    try {
      resetUIState();
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const resetUIState = () => {
    setSidebarOpen(false);
    setDesktopSidebarCollapsed(false);
    setDocumentsDropdownOpen(false);
    setUserDropdownOpen(false);
    onSidebarCollapse(false);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => {
    setSidebarOpen(false);
    setDocumentsDropdownOpen(false);
  };
  const toggleDesktopSidebar = () => {
    const newState = !desktopSidebarCollapsed;
    setDesktopSidebarCollapsed(newState);
    onSidebarCollapse(newState);
  };
  const toggleDocumentsDropdown = () => setDocumentsDropdownOpen(!documentsDropdownOpen);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "HIDE_NAVBAR") {
        setSidebarOpen(false);
        setDesktopSidebarCollapsed(true);
        onSidebarCollapse(true);
        const toggleButton = document.querySelector(".md\\:flex.fixed.right-64.top-4");
        if (toggleButton) toggleButton.style.display = "none";
      } else if (event.data.type === "SHOW_NAVBAR") {
        setDesktopSidebarCollapsed(false);
        onSidebarCollapse(false);
        const toggleButton = document.querySelector(".md\\:flex.fixed.right-64.top-4");
        if (toggleButton) toggleButton.style.display = "block";
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSidebarCollapse]);

  const renderNavItems = (items) => (
    items.map((item) => (
      <li key={item.path} className="text-right">
        <button
          onClick={() => {
            navigate(item.path);
            closeSidebar();
          }}
          className="block w-full text-right text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          {item.label}
        </button>
      </li>
    ))
  );

  return (
    <div dir="rtl">
      <div className="md:hidden fixed top-1 right-1 z-50">
        <button
          onClick={toggleSidebar}
          className="text-gray-800 backdrop-blur-sm dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md transition-all duration-300"
        >
          {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      <button
        onClick={toggleDesktopSidebar}
        className="hidden md:flex fixed right-64 top-4 z-50 items-center justify-center w-6 h-6 bg-gray-800 dark:bg-gray-900 text-gray-300 hover:text-white rounded-l-md border border-gray-700 border-r-0 transition-all duration-300 hover:bg-gray-700"
        style={{
          transform: desktopSidebarCollapsed ? "translateX(16rem)" : "translateX(0)",
        }}
      >
        {desktopSidebarCollapsed ? (
          <ChevronLeftIcon className="h-4 w-4" />
        ) : (
          <ChevronRightIcon className="h-4 w-4" />
        )}
      </button>

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
            <button className="flex gap-1 items-center p-1 bg-gray-700 rounded-lg">
              <UserIcon className="text-white w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-2 space-y-2 overflow-hidden">
            <ul className="space-y-2">
              {renderNavItems(navItems)}
              <li>
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
                {documentsDropdownOpen && (
                  <ul className="mr-4 space-y-1">
                    {renderNavItems(documentItems)}
                  </ul>
                )}
              </li>
            </ul>
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

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 transition-opacity duration-300 opacity-100">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeSidebar}
          />
          <div className="fixed right-0 top-0 bottom-0 w-64 bg-gray-800 dark:bg-gray-900 shadow-lg transform transition-transform duration-300 translate-x-0">
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
              <div className="flex-1 py-2 space-y-2 overflow-y-auto">
                <ul className="space-y-2">
                  {renderNavItems(navItems)}
                  <li>
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
                    {documentsDropdownOpen && (
                      <ul className="mr-4 space-y-1">
                        {renderNavItems(documentItems)}
                      </ul>
                    )}
                  </li>
                </ul>
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
      )}
    </div>
  );
};

export default Navbar;