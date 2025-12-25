import { useState, useRef, useEffect } from 'react';
import {
  FaTrash,
  FaEdit,
  FaCrown,
  FaUser,
  FaUsers,
  FaEye,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { notify } from '../ui/toast';

/**
 * WorkspaceCard Component - Displays workspace information with interactive controls (Mobile Optimized)
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.workspace - Workspace data object
 * @param {Function} props.handleDelete - Function to handle workspace deletion
 * @param {Function} props.onWorkspaceSelect - Function to handle workspace selection
 * @param {boolean} props.isCurrent - Whether this workspace is the current active one
 * @returns {JSX.Element} Rendered workspace card component
 */
const WorkspaceCard = ({
  workspace,
  handleDelete,
  onWorkspaceSelect,
  isCurrent = false,
}) => {
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);

  // Local state for workspace plan
  const [localPlan, setLocalPlan] = useState(workspace.plan);

  // Check if title is truncated on mount and resize
  useEffect(() => {
    const checkTitleTruncation = () => {
      if (titleRef.current && containerRef.current) {
        const titleElement = titleRef.current;
        const containerElement = containerRef.current;

        // Calculate available width for title (container width minus icon space)
        const containerWidth = containerElement.offsetWidth;
        const iconSpace = 28; // Space for role icon (20px + 8px gap)
        const availableWidth = containerWidth - iconSpace - 16; // 16px for safety margin

        // Check if title is wider than available space
        const isTruncated = titleElement.scrollWidth > availableWidth;
        setIsTitleTruncated(isTruncated);
      }
    };

    // Initial check
    checkTitleTruncation();

    // Add resize listener
    window.addEventListener('resize', checkTitleTruncation);

    // Check again after a short delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(checkTitleTruncation, 100);

    return () => {
      window.removeEventListener('resize', checkTitleTruncation);
      clearTimeout(timeoutId);
    };
  }, [workspace.name, workspace.role]);

  /**
   * Get plan color based on plan type
   * @param {string} plan - Workspace plan
   * @returns {Object} CSS classes for plan
   */
  const getPlanColor = (plan) => {
    switch (plan) {
      case 'پرو':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-purple-600',
          text: 'text-white',
          badge:
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        };
      case 'پرو پیشرفته':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-pink-600',
          text: 'text-white',
          badge:
            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        };
      case 'استاندارد':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
          text: 'text-white',
          badge:
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        };
      case 'رایگان':
        return {
          bg: 'bg-gradient-to-r from-gray-400 to-gray-600',
          text: 'text-white',
          badge:
            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-400 to-cyan-500',
          text: 'text-white',
          badge:
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        };
    }
  };

  /**
   * Get role icon based on user role
   * @param {string} role - User role in workspace
   * @returns {JSX.Element} Role icon
   */
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return (
          <FaCrown className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500 flex-shrink-0" />
        );
      case 'member':
        return (
          <FaUser className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
        );
      case 'owner':
        return (
          <FaCrown className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-500 flex-shrink-0" />
        );
      default:
        return (
          <FaUser className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
        );
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
   * Handles card click for workspace selection
   * @function handleCardClick
   */
  const handleCardClick = () => {
    if (onWorkspaceSelect) {
      onWorkspaceSelect(workspace);
    } else {
      navigate(`/workspace/${workspace.id}`);
    }
  };

  /**
   * Handles delete button click with event propagation prevention
   * @function handleDeleteClick
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (handleDelete) {
      handleDelete(workspace.id);
    }
  };

  /**
   * Handles edit button click with event propagation prevention
   * @function handleEditClick
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/workspace/edit/${workspace.id}`);
  };

  /**
   * Handles show button click with event propagation prevention
   * @function handleShowClick
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleShowClick = (e) => {
    e.stopPropagation();
    navigate(`/workspace/${workspace.id}`);
  };

  const planColors = getPlanColor(localPlan);

  return (
    <div
      ref={containerRef}
      onClick={handleCardClick}
      className={`group w-full min-h-[140px] md:min-h-[160px] bg-white dark:bg-gray-800 
                  rounded-xl md:rounded-2xl border transition-all duration-300 
                  cursor-pointer transform hover:-translate-y-1 md:hover:-translate-y-1 
                  relative overflow-hidden ${
                    isCurrent
                      ? 'border-blue-500 shadow-md md:shadow-lg shadow-blue-500/20'
                      : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md md:hover:shadow-xl'
                  }`}
    >
      {/* Current workspace indicator */}
      {isCurrent && (
        <div className="absolute top-2 md:top-3 right-2 md:right-3 z-10">
          <div className="px-2 md:px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full animate-pulse">
            فعال
          </div>
        </div>
      )}

      <div className="h-full flex flex-col px-4 sm:px-5 md:px-6 py-4 md:py-5">
        {/* Header section with workspace icon and name - FIXED TRUNCATE */}
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            {/* Workspace icon */}
            <div
              className={`${workspace.color} w-10 h-10 md:w-14 md:h-14 
                          rounded-lg md:rounded-xl flex items-center justify-center 
                          text-white text-lg md:text-2xl font-bold 
                          shadow-md md:shadow-lg flex-shrink-0`}
            >
              {workspace.letter}
            </div>

            {/* Workspace info with PROPER truncate implementation */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 w-full">
                {/* Title container with proper truncation */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3
                      ref={titleRef}
                      className="text-base md:text-xl font-bold text-gray-900 dark:text-white
                                truncate overflow-hidden text-ellipsis whitespace-nowrap
                                min-w-0"
                      style={{
                        maxWidth: '100%',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={isTitleTruncated ? workspace.name : undefined}
                    >
                      {workspace.name}
                    </h3>
                  </div>
                </div>

                {/* Role icon - always visible, doesn't affect truncation */}
                <div className="flex-shrink-0 ml-1">
                  {getRoleIcon(workspace.role)}
                </div>
              </div>

              {/* Description with proper line clamp */}
              <div className="mt-1 overflow-hidden">
                <p
                  className="text-xs md:text-sm text-gray-600 dark:text-gray-400
                            overflow-hidden text-ellipsis"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                  title={workspace.description || 'بدون توضیحات'}
                >
                  {workspace.description || 'بدون توضیحات'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace metadata and actions */}
        <div className="mt-auto pt-3 md:pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
            <div className="flex items-center flex-wrap gap-2 md:gap-4 min-w-0">
              {/* Plan badge */}
              <div
                className={`px-2.5 md:px-3 py-1 md:py-1.5 text-xs font-medium rounded-full 
                          ${planColors.badge} flex items-center gap-1 md:gap-1.5 
                          whitespace-nowrap flex-shrink-0 max-w-full`}
              >
                <span className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  {localPlan}
                </span>
              </div>

              {/* Role badge */}
              <div
                className="flex items-center gap-1 md:gap-1.5 text-xs md:text-sm
                              text-gray-600 dark:text-gray-400 whitespace-nowrap
                              flex-shrink-0"
              >
                <span className="flex-shrink-0">
                  {getRoleIcon(workspace.role)}
                </span>
                <span className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  {getRoleText(workspace.role)}
                </span>
              </div>

              {/* Members count */}
              <div
                className="flex items-center gap-1 md:gap-1.5 text-xs md:text-sm
                              text-gray-600 dark:text-gray-400 whitespace-nowrap
                              flex-shrink-0"
              >
                <FaUsers className="text-gray-400 text-xs md:text-sm flex-shrink-0" />
                <span className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  {workspace.memberCount || 0} عضو
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 md:gap-2 justify-end flex-shrink-0">
              {/* Show button */}
              <button
                onClick={handleShowClick}
                className="p-1.5 md:p-2 text-blue-500 hover:bg-blue-50
                         dark:hover:bg-blue-900/20 rounded-lg transition-colors
                         duration-200 group/edit flex-shrink-0"
                title="نمایش فضای کاری"
                aria-label={`نمایش فضای کاری ${workspace.name}`}
              >
                <FaEye
                  className="text-blue-500 text-sm md:text-base
                                 group-hover/edit:scale-110 transition-transform
                                 duration-200"
                />
              </button>

              {/* Edit button */}
              <button
                onClick={handleEditClick}
                className="p-1.5 md:p-2 text-blue-500 hover:bg-blue-50
                         dark:hover:bg-blue-900/20 rounded-lg transition-colors
                         duration-200 group/edit flex-shrink-0"
                title="ویرایش فضای کاری"
                aria-label={`ویرایش فضای کاری ${workspace.name}`}
              >
                <FaEdit
                  className="text-blue-500 text-sm md:text-base
                                  group-hover/edit:scale-110 transition-transform
                                  duration-200"
                />
              </button>

              {/* Delete button */}
              <button
                onClick={handleDeleteClick}
                className="p-1.5 md:p-2 text-red-500 hover:bg-red-50
                         dark:hover:bg-red-900/20 rounded-lg transition-colors
                         duration-200 group/delete flex-shrink-0"
                title="حذف فضای کاری"
                aria-label={`حذف فضای کاری ${workspace.name}`}
              >
                <FaTrash
                  className="text-red-500 text-sm md:text-base
                                   group-hover/delete:scale-110 transition-transform
                                   duration-200"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 ${planColors.bg} 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      ></div>

      {/* Hover effect overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      pointer-events-none"
      ></div>
    </div>
  );
};

export default WorkspaceCard;
