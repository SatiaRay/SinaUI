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

const NavList = ({ items, onNavigate, className = "", closeSidebar }) => (
  <ul className='flex flex-col gap-2'>
    {items.map(({ path, label }) => (
      <li key={path} className="text-right">
        <button
          onClick={() => {
            onNavigate(path);
            closeSidebar?.();
          }}
          className="block w-full text-right text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
        >
          {label}
        </button>
      </li>
    ))}
  </ul>
);

const Navbar = ({ onSidebarCollapse }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [documentsDropdownOpen, setDocumentsDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(false);

  const navItems = [
    { path: "/chat", label: "چت" },
    { path: "/voice-agent", label: "گفتگوی صوتی" },
    { path: "/wizard", label: "پاسخ‌های ویزارد" },
    { path: "/workflow", label: "گردش کار" },
    { path: "/instructions", label: "دستور العمل های بات" },
    { path: "/setting", label: "تنظیمات" },
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
    setUserInfo(false);
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

  return (
    <div dir="rtl">
      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-1 right-1 z-50">
        <button
          onClick={toggleSidebar}
          className="text-gray-800 backdrop-blur-sm dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-md transition-all duration-300"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop sidebar toggle button */}
      <button
        onClick={toggleDesktopSidebar}
        className="hidden md:flex fixed right-64 top-4 z-50 items-center justify-center w-6 h-6 bg-gray-800 dark:bg-gray-900 text-gray-300 hover:text-white rounded-l-md border border-gray-700 border-r-0 transition-all duration-300 hover:bg-gray-700"
        style={{ transform: desktopSidebarCollapsed ? "translateX(16rem)" : "translateX(0)" }}
        aria-label="Toggle desktop sidebar"
      >
        {desktopSidebarCollapsed ? (
          <ChevronLeftIcon className="h-4 w-4" />
        ) : (
          <ChevronRightIcon className="h-4 w-4" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed right-0 top-0 bottom-0 bg-gray-800 dark:bg-gray-900 shadow-lg transition-all duration-300 ${
          desktopSidebarCollapsed ? "w-0" : "w-64"
        }`}
        aria-expanded={!desktopSidebarCollapsed}
      >
        <div
          className={`flex flex-col h-full transition-all duration-300 ${
            desktopSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-64"
          }`}
        >
          <header className="p-4 border-b flex w-full justify-between border-gray-700 whitespace-nowrap overflow-hidden">
            <h1 className="text-white text-lg font-bold">مدیریت چت</h1>
            <button
              onClick={() => setUserInfo((v) => !v)}
              className="flex gap-1 items-center p-1 hover:bg-blue-500 bg-gray-700 rounded-lg"
              aria-expanded={userInfo}
              aria-label="User info toggle"
            >
              <UserIcon className="text-white w-5 h-5" />
            </button>
          </header>

          <nav className="flex-1 p-2 overflow-hidden">
            <NavList items={navItems} onNavigate={navigate} />
            {/* Documents dropdown */}
            <div className="mt-2">
              <button
                onClick={toggleDocumentsDropdown}
                className="flex items-center w-full text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                aria-expanded={documentsDropdownOpen}
                aria-controls="documents-dropdown"
              >
                اسناد
                <ChevronDownIcon
                  className={`h-4 w-4 mr-2 transition-transform duration-200 ${
                    documentsDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                id="documents-dropdown"
                className={`mr-4 overflow-hidden transition-all duration-200 ${
                  documentsDropdownOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <NavList items={documentItems} onNavigate={navigate} />
              </div>
            </div>
          </nav>

          <footer className="p-4 border-t border-gray-700 overflow-hidden">
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
          </footer>
        </div>
      </aside>

      {/* Mobile Sidebar */}
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
                  <button className="flex gap-1 items-center p-1 bg-gray-700 rounded-lg" aria-label="User info">
                    <UserIcon className="text-white w-4 h-4" />
                  </button>
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
                <NavList items={navItems} onNavigate={navigate} closeSidebar={closeSidebar} />
                <div className="mt-2">
                  <button
                    onClick={toggleDocumentsDropdown}
                    className="flex items-center w-full text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    aria-expanded={documentsDropdownOpen}
                    aria-controls="mobile-documents-dropdown"
                  >
                    اسناد
                    <ChevronDownIcon
                      className={`h-4 w-4 mr-2 transition-transform duration-200 ${
                        documentsDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {documentsDropdownOpen && (
                    <ul id="mobile-documents-dropdown" className="mr-4 space-y-1">
                      <NavList items={documentItems} onNavigate={navigate} closeSidebar={closeSidebar} />
                    </ul>
                  )}
                </div>
              </nav>

              <footer className="p-4 border-t border-gray-700">
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
              </footer>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Navbar;
