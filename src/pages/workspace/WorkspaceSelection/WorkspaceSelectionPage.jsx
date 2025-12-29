import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  Star,
} from 'lucide-react';
import { notify } from '../../../components/ui/toast';
import { WorkspaceSelectionLoading } from './WorkspaceSelectionLoading';

/**
 * Interface for Workspace object structure
 * @interface Workspace
 * @property {string} id - Unique identifier for the workspace
 * @property {string} name - Display name of the workspace
 * @property {string} [subtitle] - Optional subtitle or role description
 * @property {number} [memberCount] - Number of members in the workspace
 * @property {string} [logo] - URL to workspace logo/image
 * @property {string} accentColor - Primary accent color for the workspace
 * @property {string} gradientFrom - Start color for gradient backgrounds
 * @property {string} gradientTo - End color for gradient backgrounds
 * @property {number} [notifications] - Count of unread notifications
 * @property {string} [lastActive] - Last active time string
 * @property {boolean} [isPremium] - Whether workspace has premium status
 */

/**
 * Props interface for WorkspaceSelectionPage component
 * @interface WorkspaceSelectionPageProps
 * @property {function} [onWorkspaceSelect] - Callback function when workspace is selected
 */

/**
 * Simple Avatar component replacement
 * @component
 * @param {Object} props - Avatar component props
 * @param {string} [props.src] - Image source URL
 * @param {string} props.alt - Alt text for image
 * @param {React.ReactNode} props.children - Fallback content
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Inline styles
 * @returns {JSX.Element} Avatar component
 */
const SimpleAvatar = ({ src, alt, children, className = '', style = {} }) => {
  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

/**
 * WorkspaceSelectionPage Component - Main workspace selection page with carousel interface
 * Allows users to select a workspace with animated carousel, keyboard navigation,
 * and visual effects. Selected workspace ID is stored in localStorage.
 *
 * Special handling for "add-new" workspace which is always the first item and has unique appearance.
 * The component starts with the first regular workspace (ws-1) selected by default.
 *
 * @component
 * @param {WorkspaceSelectionPageProps} props - Component props
 * @returns {JSX.Element} Rendered workspace selection page
 *
 * @example
 * <WorkspaceSelectionPage onWorkspaceSelect={(id) => console.log(id)} />
 */
const WorkspaceSelectionPage = ({ onWorkspaceSelect }) => {
  /**
   * Navigation hook for programmatic routing
   * @type {import('react-router-dom').NavigateFunction}
   */
  const navigate = useNavigate();

  /**
   * Regular workspaces data - excludes the "add-new" workspace
   * @type {Workspace[]}
   */
  const REGULAR_WORKSPACES = [
    {
      id: 'ws-1',
      name: 'فضای اصلی',
      subtitle: 'مدیر اصلی',
      memberCount: 24,
      accentColor: '#0078D4',
      gradientFrom: '#0078D4',
      gradientTo: '#00BCF2',
      notifications: 5,
      lastActive: '۲ دقیقه پیش',
      isPremium: true,
    },
    {
      id: 'ws-2',
      name: 'تیم طراحی',
      subtitle: 'طراح ارشد',
      memberCount: 12,
      accentColor: '#8961CC',
      gradientFrom: '#8961CC',
      gradientTo: '#B146C2',
      notifications: 2,
      lastActive: '۱۰ دقیقه پیش',
    },
    {
      id: 'ws-3',
      name: 'پروژه ویژه',
      subtitle: 'توسعه‌دهنده',
      memberCount: 8,
      accentColor: '#107C10',
      gradientFrom: '#107C10',
      gradientTo: '#55B058',
      lastActive: '۱ ساعت پیش',
      isPremium: true,
    },
    {
      id: 'ws-4',
      name: 'تیم محتوا',
      subtitle: 'نویسنده',
      memberCount: 15,
      accentColor: '#FF8C00',
      gradientFrom: '#FF8C00',
      gradientTo: '#FFB900',
      notifications: 12,
      lastActive: '۳۰ دقیقه پیش',
    },
    {
      id: 'ws-5',
      name: 'بازاریابی',
      subtitle: 'مدیر بازاریابی',
      memberCount: 18,
      accentColor: '#E81123',
      gradientFrom: '#E81123',
      gradientTo: '#F7630C',
      lastActive: '۲ ساعت پیش',
    },
  ];

  /**
   * Special "add-new" workspace with unique properties
   * @type {Workspace}
   */
  const ADD_NEW_WORKSPACE = {
    id: 'add-new',
    name: 'افزودن جدید',
    subtitle: '',
    accentColor: '#6B7280',
    gradientFrom: '#6B7280',
    gradientTo: '#9CA3AF',
  };

  /**
   * Combined workspaces array with "add-new" always at index 0
   * @type {Workspace[]}
   */
  const ALL_WORKSPACES = [ADD_NEW_WORKSPACE, ...REGULAR_WORKSPACES];

  /**
   * Check if a workspace is the "add-new" workspace
   * @param {Workspace} workspace - Workspace to check
   * @returns {boolean} True if workspace is "add-new"
   */
  const isAddNewWorkspace = (workspace) => workspace.id === 'add-new';

  /**
   * Get the index of the first regular workspace (ws-1)
   * @type {number}
   */
  const FIRST_REGULAR_WORKSPACE_INDEX = 1;

  /**
   * Current carousel index state - Starts with first regular workspace (ws-1)
   * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
   */
  const [currentIndex, setCurrentIndex] = useState(
    FIRST_REGULAR_WORKSPACE_INDEX
  );

  /**
   * Selected workspace index state
   * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
   */
  const [selectedIndex, setSelectedIndex] = useState(-1);

  /**
   * Component loaded state for initial animation
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Loading state for data fetching simulation
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Ref to store current workspace for stable reference
   * Starts with the first regular workspace (ws-1)
   * @type {React.MutableRefObject<Workspace>}
   */
  const currentWorkspaceRef = useRef(
    ALL_WORKSPACES[FIRST_REGULAR_WORKSPACE_INDEX]
  );

  /**
   * Get current workspace based on carousel index
   * @type {Workspace}
   */
  const currentWorkspace = ALL_WORKSPACES[currentIndex];

  /**
   * Update ref when current workspace changes
   */
  useEffect(() => {
    currentWorkspaceRef.current = currentWorkspace;
  }, [currentWorkspace]);

  /**
   * Initialize component and simulate data loading
   * Sets up initial animations and loads workspace data
   */
  useEffect(() => {
    // Hide navbar when component mounts
    if (window.parent) {
      window.parent.postMessage({ type: 'HIDE_NAVBAR' }, '*');
    }

    const initializeComponent = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsLoading(false);

      // Initial load animation
      setTimeout(() => setIsLoaded(true), 100);
    };

    initializeComponent();

    // Cleanup function to show navbar when component unmounts
    return () => {
      if (window.parent) {
        window.parent.postMessage({ type: 'SHOW_NAVBAR' }, '*');
      }
    };
  }, []);

  /**
   * Handle navigation to next workspace in carousel
   * Only works when no workspace is currently selected
   */
  const handleNext = () => {
    if (selectedIndex === -1) {
      // In RTL layout, "next" should move to the right visually
      setCurrentIndex((prev) => (prev + 1) % ALL_WORKSPACES.length);
    }
  };

  /**
   * Handle navigation to previous workspace in carousel
   * Only works when no workspace is currently selected
   */
  const handlePrevious = () => {
    if (selectedIndex === -1) {
      // In RTL layout, "previous" should move to the left visually
      setCurrentIndex(
        (prev) => (prev - 1 + ALL_WORKSPACES.length) % ALL_WORKSPACES.length
      );
    }
  };

  /**
   * Handle workspace selection
   * Triggers selection animation, stores workspace ID in localStorage,
   * and navigates to the appropriate page
   */
  const handleSelect = () => {
    const workspace = currentWorkspaceRef.current;

    if (isAddNewWorkspace(workspace)) {
      console.log('Add new workspace');
      navigate('/workspace/create');
      return;
    }

    // Set selected state for animation
    setSelectedIndex(currentIndex);

    // Store selected workspace ID in localStorage
    localStorage.setItem('khan-selected-workspace-id', workspace.id);

    // Show success notification
    notify.success(`فضای کاری "${workspace.name}" انتخاب شد`);

    // Show navbar before navigation
    if (window.parent) {
      window.parent.postMessage({ type: 'SHOW_NAVBAR' }, '*');
    }

    // Trigger selection animation and callback
    setTimeout(() => {
      if (onWorkspaceSelect) {
        onWorkspaceSelect(workspace.id);
      } else {
        // Navigate to dashboard or return to previous page
        const returnPath = window.history.state?.from || '/chat';
        navigate(returnPath, { replace: true });
      }
    }, 800);
  };

  /**
   * Handle direct workspace selection by index
   * @param {number} index - Index of workspace to select
   */
  const handleDirectSelect = (index) => {
    if (selectedIndex === -1) {
      setCurrentIndex(index);
    }
  };

  /**
   * Setup keyboard navigation for carousel
   * Arrow keys for navigation, Enter/Space for selection
   * Fixed: ArrowRight should go to next, ArrowLeft should go to previous
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext(); // Fixed: ArrowRight should go to next
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious(); // Fixed: ArrowLeft should go to previous
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, selectedIndex]);

  /**
   * State for responsive values
   */
  const [responsiveValues, setResponsiveValues] = useState({
    isMobile: false,
    isTablet: false,
    titleSize: 'text-5xl',
    containerPadding: 'px-8',
    carouselHeight: 'h-[420px]',
    avatarSize: 'w-48 h-48',
    centerAvatarSize: 'w-48 h-48',
    arrowSize: 'w-20 h-20',
    arrowIconSize: 'w-10 h-10',
    offsetMultiplier: 220,
    visibleCount: 2,
    showStats: true,
    textSize: 'text-base',
  });

  /**
   * Update responsive values on window resize
   */
  useEffect(() => {
    const updateResponsiveValues = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;

      setResponsiveValues({
        isMobile,
        isTablet,
        titleSize: isMobile ? 'text-3xl' : isTablet ? 'text-4xl' : 'text-5xl',
        containerPadding: isMobile ? 'px-4' : 'px-8',
        carouselHeight: isMobile
          ? 'h-[320px]'
          : isTablet
            ? 'h-[380px]'
            : 'h-[420px]',
        avatarSize: isMobile
          ? 'w-32 h-32'
          : isTablet
            ? 'w-40 h-40'
            : 'w-48 h-48',
        centerAvatarSize: isMobile
          ? 'w-40 h-40'
          : isTablet
            ? 'w-44 h-44'
            : 'w-48 h-48',
        arrowSize: isMobile
          ? 'w-12 h-12'
          : isTablet
            ? 'w-16 h-16'
            : 'w-20 h-20',
        arrowIconSize: isMobile
          ? 'w-6 h-6'
          : isTablet
            ? 'w-8 h-8'
            : 'w-10 h-10',
        offsetMultiplier: isMobile ? 180 : isTablet ? 200 : 220,
        visibleCount: isMobile ? 1 : 2,
        showStats: !isMobile,
        textSize: isMobile ? 'text-sm' : 'text-base',
      });
    };

    updateResponsiveValues();
    window.addEventListener('resize', updateResponsiveValues);
    return () => window.removeEventListener('resize', updateResponsiveValues);
  }, []);

  /**
   * Show loading state while data is being fetched
   */
  if (isLoading) {
    return <WorkspaceSelectionLoading />;
  }

  return (
    <div className="h-screen w-full bg-[#0e1b2e] relative overflow-hidden flex flex-col">
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Dynamic gradient background */}
      <div className="absolute inset-0 transition-all duration-1000">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e1b2e] via-[#1a2942] to-[#0e1b2e]" />

        {/* Animated gradient orbs - Responsive sizes */}
        <div
          className="absolute -bottom-32 -left-32 opacity-50 transition-all duration-1000"
          style={{
            width: responsiveValues.isMobile
              ? '400px'
              : responsiveValues.isTablet
                ? '500px'
                : '700px',
            height: responsiveValues.isMobile
              ? '400px'
              : responsiveValues.isTablet
                ? '500px'
                : '700px',
            background: `radial-gradient(circle, ${currentWorkspace.accentColor}50 0%, ${currentWorkspace.accentColor}20 40%, transparent 70%)`,
            filter: 'blur(60px)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />

        <div
          className="absolute -top-32 -right-32 opacity-40 transition-all duration-1000"
          style={{
            width: responsiveValues.isMobile
              ? '300px'
              : responsiveValues.isTablet
                ? '400px'
                : '600px',
            height: responsiveValues.isMobile
              ? '300px'
              : responsiveValues.isTablet
                ? '400px'
                : '600px',
            background: `radial-gradient(circle, ${currentWorkspace.accentColor}40 0%, ${currentWorkspace.accentColor}15 40%, transparent 70%)`,
            filter: 'blur(50px)',
            animation: 'pulse 5s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 transition-all duration-1000"
          style={{
            width: responsiveValues.isMobile
              ? '400px'
              : responsiveValues.isTablet
                ? '600px'
                : '800px',
            height: responsiveValues.isMobile
              ? '400px'
              : responsiveValues.isTablet
                ? '600px'
                : '800px',
            background: `radial-gradient(circle, ${currentWorkspace.accentColor}30 0%, transparent 60%)`,
            filter: 'blur(80px)',
            animation: 'pulse 6s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(${currentWorkspace.accentColor}30 1px, transparent 1px), linear-gradient(90deg, ${currentWorkspace.accentColor}30 1px, transparent 1px)`,
            backgroundSize: responsiveValues.isMobile
              ? '30px 30px'
              : '50px 50px',
          }}
        />

        {/* Bottom wave */}
        <svg
          className="absolute bottom-0 left-0 w-full opacity-20 transition-all duration-1000"
          style={{ height: responsiveValues.isMobile ? '192px' : '384px' }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill={currentWorkspace.accentColor}
            fillOpacity="0.4"
            d="M0,192 C240,128 480,224 720,192 C960,160 1200,256 1440,192 L1440,320 L0,320 Z"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,192 C240,128 480,224 720,192 C960,160 1200,256 1440,192 L1440,320 L0,320 Z;
                M0,224 C240,160 480,256 720,224 C960,192 1200,288 1440,224 L1440,320 L0,320 Z;
                M0,192 C240,128 480,224 720,192 C960,160 1200,256 1440,192 L1440,320 L0,320 Z
              "
            />
          </path>
        </svg>
      </div>

      {/* Content */}
      <div
        className={`relative z-10 flex-1 flex flex-col items-center justify-center ${responsiveValues.containerPadding} transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        {/* Title with gradient - Fixed gradient rendering issue */}
        <div
          className={`text-center ${responsiveValues.isMobile ? 'mb-12' : 'mb-20'}`}
        >
          <div className="relative">
            {/* Use CSS class for gradient instead of inline style */}
            <h1
              className={`${responsiveValues.titleSize} font-bold mb-4 tracking-wide transition-all duration-700 gradient-title`}
              style={{
                '--gradient-from': '#ffffff',
                '--gradient-to': currentWorkspace.accentColor,
              }}
            >
              چه کسی امروز کار می‌کند؟
            </h1>
          </div>
          <p className={`${responsiveValues.textSize} text-white/50`}>
            فضای کاری خود را انتخاب کنید
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full max-w-5xl">
          {/* Left Arrow - Fixed: Should go to previous workspace */}
          <button
            onClick={handlePrevious}
            disabled={selectedIndex !== -1}
            className={`absolute ${responsiveValues.isMobile ? 'left-2' : 'left-4'} top-1/2 -translate-y-1/2 z-20 ${responsiveValues.arrowSize} rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-110 hover:border-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl group`}
            style={{
              boxShadow: `0 8px 32px ${currentWorkspace.accentColor}30`,
            }}
          >
            <ChevronLeft
              className={`${responsiveValues.arrowIconSize} text-white group-hover:scale-110 transition-transform`}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Right Arrow - Fixed: Should go to next workspace */}
          <button
            onClick={handleNext}
            disabled={selectedIndex !== -1}
            className={`absolute ${responsiveValues.isMobile ? 'right-2' : 'right-4'} top-1/2 -translate-y-1/2 z-20 ${responsiveValues.arrowSize} rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-110 hover:border-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl group`}
            style={{
              boxShadow: `0 8px 32px ${currentWorkspace.accentColor}30`,
            }}
          >
            <ChevronRight
              className={`${responsiveValues.arrowIconSize} text-white group-hover:scale-110 transition-transform`}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Workspace avatars carousel */}
          <div
            className={`flex items-center justify-center ${responsiveValues.carouselHeight} relative overflow-visible`}
          >
            {ALL_WORKSPACES.map((workspace, index) => {
              const offset = index - currentIndex;
              const isCenter = index === currentIndex;
              const isVisible =
                Math.abs(offset) <= responsiveValues.visibleCount;
              const isSelected = selectedIndex === index;
              const isAddNew = isAddNewWorkspace(workspace);

              return (
                <div
                  key={workspace.id}
                  className={`absolute transition-all duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  style={{
                    transform: `
                      translateX(${offset * responsiveValues.offsetMultiplier}px)
                      scale(${isCenter ? 1 : responsiveValues.isMobile ? 0.7 : 0.65})
                      rotateY(${offset * -8}deg)
                    `,
                    transformStyle: 'preserve-3d',
                    zIndex: isCenter ? 10 : 5 - Math.abs(offset),
                    // Special filter handling for add-new workspace
                    filter: isCenter
                      ? 'none'
                      : isAddNew
                        ? 'brightness(0.85) saturate(0.8)'
                        : 'blur(2px) brightness(0.7)',
                  }}
                >
                  <button
                    onClick={() =>
                      isCenter ? handleSelect() : handleDirectSelect(index)
                    }
                    disabled={!isCenter || selectedIndex !== -1}
                    className={`group flex flex-col items-center ${responsiveValues.isMobile ? 'gap-4' : 'gap-6'} transition-all duration-700 ${!isCenter ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="relative">
                      {/* Premium badge - Only show for regular workspaces in center */}
                      {isCenter && !isAddNew && workspace.isPremium && (
                        <div
                          className={`absolute -top-2 -right-2 z-20 ${responsiveValues.isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-xl animate-bounce`}
                        >
                          <Star
                            className={`${responsiveValues.isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-white fill-white`}
                          />
                        </div>
                      )}

                      {/* Notification badge - Only show for regular workspaces in center */}
                      {isCenter &&
                        !isAddNew &&
                        workspace.notifications &&
                        workspace.notifications > 0 && (
                          <div
                            className={`absolute -top-2 -left-2 z-20 ${responsiveValues.isMobile ? 'min-w-6 h-6 px-1.5' : 'min-w-8 h-8 px-2'} rounded-full flex items-center justify-center shadow-xl animate-pulse`}
                            style={{
                              background: `linear-gradient(135deg, ${workspace.gradientFrom} 0%, ${workspace.gradientTo} 100%)`,
                            }}
                          >
                            <span
                              className={`text-white ${responsiveValues.isMobile ? 'text-xs' : 'text-xs'} font-bold`}
                            >
                              {workspace.notifications}
                            </span>
                          </div>
                        )}

                      {/* Multi-layered glow effects - Only for regular workspaces in center */}
                      {isCenter && !isAddNew && (
                        <>
                          {/* Outer glow - pulsing */}
                          <div
                            className="absolute rounded-full opacity-60 transition-all duration-700"
                            style={{
                              inset: responsiveValues.isMobile
                                ? '-4px'
                                : responsiveValues.isTablet
                                  ? '-6px'
                                  : '-8px',
                              background: `radial-gradient(circle, ${workspace.accentColor}40 0%, transparent 70%)`,
                              filter: 'blur(30px)',
                              animation: 'pulse 3s ease-in-out infinite',
                            }}
                          />

                          {/* Middle glow - rotating */}
                          <div
                            className="absolute rounded-full opacity-50"
                            style={{
                              inset: responsiveValues.isMobile
                                ? '-3px'
                                : responsiveValues.isTablet
                                  ? '-4px'
                                  : '-6px',
                              background: `conic-gradient(from 0deg, ${workspace.gradientFrom}, ${workspace.gradientTo}, ${workspace.gradientFrom})`,
                              filter: 'blur(20px)',
                              animation: 'spin 8s linear infinite',
                            }}
                          />

                          {/* Inner ring - gradient border */}
                          <div
                            className="absolute rounded-full opacity-80"
                            style={{
                              inset: responsiveValues.isMobile
                                ? '-2px'
                                : responsiveValues.isTablet
                                  ? '-3px'
                                  : '-4px',
                              background: `linear-gradient(135deg, ${workspace.gradientFrom} 0%, ${workspace.gradientTo} 100%)`,
                              filter: 'blur(10px)',
                            }}
                          />
                        </>
                      )}

                      {/* Simple glow effect for add-new workspace in center */}
                      {isCenter && isAddNew && (
                        <div
                          className="absolute rounded-full opacity-40 transition-all duration-700"
                          style={{
                            inset: responsiveValues.isMobile
                              ? '-3px'
                              : responsiveValues.isTablet
                                ? '-4px'
                                : '-6px',
                            background: `radial-gradient(circle, ${workspace.accentColor}30 0%, transparent 70%)`,
                            filter: 'blur(20px)',
                            animation: 'pulse 3s ease-in-out infinite',
                          }}
                        />
                      )}

                      {/* Selection ripple effect - For all workspaces */}
                      {isSelected && (
                        <>
                          <div
                            className="absolute rounded-full animate-ping"
                            style={{
                              inset: responsiveValues.isMobile
                                ? '-3px'
                                : responsiveValues.isTablet
                                  ? '-4px'
                                  : '-5px',
                              background: `linear-gradient(135deg, ${workspace.gradientFrom} 0%, ${workspace.gradientTo} 100%)`,
                            }}
                          />
                          <div
                            className="absolute rounded-full animate-ping"
                            style={{
                              inset: responsiveValues.isMobile
                                ? '-5px'
                                : responsiveValues.isTablet
                                  ? '-6px'
                                  : '-8px',
                              background: `linear-gradient(135deg, ${workspace.gradientFrom} 0%, ${workspace.gradientTo} 100%)`,
                              animationDelay: '0.2s',
                            }}
                          />
                        </>
                      )}

                      {/* Avatar Container */}
                      <div
                        className="relative"
                        style={{
                          animation: isCenter
                            ? 'float 6s ease-in-out infinite'
                            : 'none',
                        }}
                      >
                        {isAddNew ? (
                          <div
                            className={`
                              ${isCenter ? responsiveValues.centerAvatarSize : responsiveValues.avatarSize}
                              rounded-full bg-slate-700/30 backdrop-blur-md
                              flex items-center justify-center transition-all duration-700
                              border-4 ${isCenter ? 'border-white/20' : 'border-white/10'}
                              shadow-2xl
                            `}
                            style={{
                              boxShadow: isCenter
                                ? `0 20px 60px ${workspace.accentColor}40, inset 0 0 20px rgba(255,255,255,0.1)`
                                : `0 10px 30px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.05)`,
                            }}
                          >
                            <Plus
                              className={`${isCenter ? (responsiveValues.isMobile ? 'w-16 h-16' : responsiveValues.isTablet ? 'w-18 h-18' : 'w-20 h-20') : responsiveValues.isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-white/70 transition-all duration-700`}
                            />
                          </div>
                        ) : (
                          <div className="relative">
                            <SimpleAvatar
                              src={workspace.logo}
                              alt={workspace.name}
                              className={`
                                ${isCenter ? responsiveValues.centerAvatarSize : responsiveValues.avatarSize}
                                transition-all duration-700
                                border-4 ${isCenter ? 'border-white/20' : 'border-white/10'}
                                shadow-2xl rounded-full overflow-hidden
                                flex items-center justify-center
                              `}
                              style={{
                                boxShadow: isCenter
                                  ? `0 20px 60px ${workspace.accentColor}80, inset 0 0 20px rgba(255,255,255,0.1)`
                                  : `0 10px 30px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.05)`,
                                background: `linear-gradient(135deg, ${workspace.gradientFrom} 0%, ${workspace.gradientTo} 100%)`,
                              }}
                            >
                              <Building2
                                className={`${isCenter ? (responsiveValues.isMobile ? 'w-20 h-20' : responsiveValues.isTablet ? 'w-22 h-22' : 'w-24 h-24') : responsiveValues.isMobile ? 'w-14 h-14' : 'w-16 h-16'} text-white transition-all duration-700 drop-shadow-2xl`}
                              />
                            </SimpleAvatar>

                            {/* Shimmer effect - enhanced for regular workspaces */}
                            {isCenter && (
                              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                                <div
                                  className="absolute inset-0 -translate-x-full"
                                  style={{
                                    background:
                                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                                    animation:
                                      'shimmer 3s ease-in-out infinite',
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info section - only for center */}
                    {isCenter && (
                      <div
                        className={`flex flex-col items-center ${responsiveValues.isMobile ? 'gap-2' : 'gap-3'} transition-all duration-700`}
                        style={{
                          minHeight: responsiveValues.isMobile
                            ? '80px'
                            : '120px',
                        }}
                      >
                        {/* Name - Fixed gradient text */}
                        <div className="relative">
                          <span
                            className={`${responsiveValues.isMobile ? 'text-xl' : 'text-2xl'} font-bold transition-all duration-700`}
                            style={{
                              color: 'transparent',
                              background: `linear-gradient(135deg, #ffffff 0%, ${workspace.accentColor} 100%)`,
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                              position: 'relative',
                              zIndex: 1,
                              textShadow: `0 0 30px ${workspace.accentColor}40`,
                            }}
                          >
                            {workspace.name}
                          </span>
                        </div>

                        {/* Status badge - Only for regular workspaces */}
                        {!isAddNew && workspace.subtitle && (
                          <div
                            className={`flex items-center gap-2 ${responsiveValues.isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} rounded-full bg-white/5 backdrop-blur-md border border-white/10`}
                            style={{
                              boxShadow: `0 4px 16px ${workspace.accentColor}20`,
                            }}
                          >
                            <div
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{
                                background: `linear-gradient(135deg, ${workspace.gradientFrom} 0%, ${workspace.gradientTo} 100%)`,
                                boxShadow: `0 0 8px ${workspace.accentColor}`,
                              }}
                            />
                            <span
                              className={`${responsiveValues.isMobile ? 'text-xs' : 'text-sm'} text-white/70`}
                            >
                              {workspace.subtitle}
                            </span>
                          </div>
                        )}

                        {/* Stats - Only show for regular workspaces on desktop/tablet */}
                        {responsiveValues.showStats && !isAddNew && (
                          <div
                            className={`flex items-center ${responsiveValues.isMobile ? 'gap-2' : 'gap-4'} text-white/50 ${responsiveValues.isMobile ? 'text-xs' : 'text-xs'}`}
                          >
                            {workspace.memberCount && (
                              <div className="flex items-center gap-1.5">
                                <Users
                                  className={`${responsiveValues.isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`}
                                />
                                <span>{workspace.memberCount} عضو</span>
                              </div>
                            )}
                            {workspace.lastActive && (
                              <div className="flex items-center gap-1.5">
                                <Clock
                                  className={`${responsiveValues.isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`}
                                />
                                <span>{workspace.lastActive}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Select hint */}
                        <div
                          className={`mt-2 ${responsiveValues.isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} rounded-full bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10`}
                          style={{
                            boxShadow: `0 4px 16px ${workspace.accentColor}30`,
                          }}
                        >
                          <span
                            className={`${responsiveValues.isMobile ? 'text-xs' : 'text-xs'} text-white/60`}
                          >
                            {isSelected
                              ? 'در حال ورود...'
                              : isAddNew
                                ? 'برای ایجاد فضای جدید'
                                : 'برای ورود Enter بزنید'}
                          </span>
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced dots indicator - Fixed color issue */}
        <div
          className={`flex items-center ${responsiveValues.isMobile ? 'gap-2' : 'gap-3'} mt-8 ${responsiveValues.isMobile ? 'mb-4' : 'mb-0'}`}
        >
          {ALL_WORKSPACES.map((workspace, index) => {
            // Calculate the visual position for RTL
            const visualIndex = ALL_WORKSPACES.length - 1 - index;
            const isActive = currentIndex === visualIndex;
            const activeWorkspace = ALL_WORKSPACES[currentIndex];

            return (
              <button
                key={index}
                onClick={() =>
                  selectedIndex === -1 && setCurrentIndex(visualIndex)
                }
                disabled={selectedIndex !== -1}
                className={`
                  transition-all duration-500 rounded-full relative overflow-hidden
                  ${isActive ? (responsiveValues.isMobile ? 'w-8 h-2' : 'w-12 h-3') : responsiveValues.isMobile ? 'w-2 h-2' : 'w-3 h-3'}
                  disabled:opacity-30 hover:scale-125
                `}
                style={{
                  background: isActive
                    ? `linear-gradient(90deg, ${activeWorkspace.gradientFrom} 0%, ${activeWorkspace.gradientTo} 100%)`
                    : 'rgba(255, 255, 255, 0.2)',
                  boxShadow: isActive
                    ? `0 4px 12px ${activeWorkspace.accentColor}60`
                    : 'none',
                }}
              >
                {isActive && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                      animation: 'shimmer 2s ease-in-out infinite',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Keyboard hint - enhanced */}
        <div
          className={`flex items-center ${responsiveValues.isMobile ? 'gap-4' : 'gap-6'} ${responsiveValues.isMobile ? 'text-xs' : 'text-xs'} text-white/30 ${responsiveValues.isMobile ? 'mt-4' : 'mt-8'}`}
        >
          <div className="flex items-center gap-2">
            <kbd
              className={`${responsiveValues.isMobile ? 'px-2 py-1' : 'px-3 py-1.5'} rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/50 font-mono`}
            >
              ←
            </kbd>
            <kbd
              className={`${responsiveValues.isMobile ? 'px-2 py-1' : 'px-3 py-1.5'} rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/50 font-mono`}
            >
              →
            </kbd>
            <span>حرکت</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd
              className={`${responsiveValues.isMobile ? 'px-2 py-1' : 'px-3 py-1.5'} rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/50 font-mono`}
            >
              Enter
            </kbd>
            <span>انتخاب</span>
          </div>
        </div>
      </div>

      {/* CSS Animations and styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        /* Gradient title styles */
        .gradient-title {
          background: linear-gradient(135deg, var(--gradient-from) 0%, var(--gradient-to) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          transition: --gradient-to 0.7s ease;
        }
        
        /* Fallback for browsers that don't support CSS variables */
        @supports not (background: linear-gradient(135deg, var(--gradient-from) 0%, var(--gradient-to) 100%)) {
          .gradient-title {
            background: linear-gradient(135deg, #ffffff 0%, ${currentWorkspace.accentColor} 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        }
      `}</style>
    </div>
  );
};

export default WorkspaceSelectionPage;
