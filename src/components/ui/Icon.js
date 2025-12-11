import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';

/**
 *  Icon Component with lazy loading
 * Uses dynamic imports to reduce initial bundle size
 * Icons are loaded on-demand when needed
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.name - Icon name (PascalCase format)
 * @param {number|string} [props.size=20] - Icon size
 * @param {string} [props.className=""] - Additional CSS classes
 * @param {string} [props.color] - Icon color
 * @param {number} [props.strokeWidth=2] - Stroke width
 * @param {boolean} [props.absoluteStrokeWidth] - Use absolute stroke width
 * @param {React.ReactNode} [props.fallback] - Custom fallback component
 * @param {React.ReactNode} [props.errorFallback] - Custom error fallback
 * @param {boolean} [props.showLoading=true] - Show loading animation
 * @param {Object} rest - Additional icon props
 * @returns {JSX.Element} Rendered icon component
 */
const Icon = ({
  name,
  size = 20,
  className = '',
  color,
  strokeWidth = 2,
  absoluteStrokeWidth = false,
  fallback,
  errorFallback,
  showLoading = true,
  ...rest
}) => {
  const [IconComponent, setIconComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Cache for loaded icons to prevent reloading
   */
  const iconCache = useMemo(() => ({}), []);

  /**
   * Normalize icon name to PascalCase format
   * @param {string} iconName - Raw icon name
   * @returns {string} Normalized icon name
   */
  const normalizeIconName = useCallback((iconName) => {
    if (!iconName) return '';

    return iconName
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase();
  }, []);

  // Get normalized icon name
  const normalizedName = useMemo(
    () => normalizeIconName(name),
    [name, normalizeIconName]
  );

  /**
   * Load icon dynamically from lucide-react
   * @async
   * @returns {Promise<void>}
   */
  const loadIcon = useCallback(async () => {
    if (!normalizedName) {
      setError('Icon name is required');
      setLoading(false);
      return;
    }

    // Check cache first
    if (iconCache[normalizedName]) {
      setIconComponent(() => iconCache[normalizedName]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Dynamic import with webpack chunk name
      const iconModule = await import(
        /* webpackChunkName: "lucide-icon-[request]" */
        `lucide-react/dist/esm/icons/${normalizedName}.js`
      );

      // Get icon component from module
      const iconComponent = iconModule.default || iconModule[normalizedName];

      if (!iconComponent) {
        throw new Error(`Icon "${name}" not found`);
      }

      // Cache the icon
      iconCache[normalizedName] = iconComponent;
      setIconComponent(() => iconComponent);
    } catch (err) {
      console.error(`Error loading icon ${normalizedName}:`, err);
      setError(`Icon "${name}" not found`);
    } finally {
      setLoading(false);
    }
  }, [normalizedName, name, iconCache]);

  // Load icon when name changes
  useEffect(() => {
    if (name) {
      loadIcon();
    }
  }, [name, loadIcon]);

  /**
   * Loading fallback component
   */
  const LoadingFallback = useMemo(() => {
    if (fallback) return () => fallback;

    if (showLoading) {
      return () => (
        <div className="inline-flex items-center justify-center">
          <Loader2
            size={size}
            className={`animate-spin ${className}`}
            color={color}
            strokeWidth={strokeWidth}
            {...rest}
          />
        </div>
      );
    }

    return () => <div style={{ width: size, height: size }} />;
  }, [fallback, showLoading, size, className, color, strokeWidth, rest]);

  /**
   * Error fallback component
   */
  const ErrorFallbackComponent = useMemo(() => {
    if (errorFallback) return () => errorFallback;

    return () => (
      <div
        className={`inline-flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 ${className}`}
        style={{
          width: size,
          height: size,
          color: '#9ca3af',
        }}
        title={`Icon "${name}" not found`}
      >
        <span style={{ fontSize: Math.max(12, size * 0.5) }}>?</span>
      </div>
    );
  }, [errorFallback, className, size, name]);

  // Show loading state
  if (loading) {
    return <LoadingFallback />;
  }

  // Show error state
  if (error || !IconComponent) {
    return <ErrorFallbackComponent />;
  }

  // Render the icon
  return (
    <IconComponent
      size={size}
      className={`stroke-current ${className}`}
      color={color}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth={absoluteStrokeWidth}
      {...rest}
    />
  );
};

/**
 * Error boundary for icon loading errors
 */
const IconWithErrorBoundary = React.memo((props) => {
  const [hasError, setHasError] = useState(false);

  // Reset error when icon name changes
  useEffect(() => {
    setHasError(false);
  }, [props.name]);

  if (hasError) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <span className="text-red-600 dark:text-red-400 text-sm">⚠️</span>
        <span className="text-red-700 dark:text-red-300 text-sm">
          Error loading icon
        </span>
      </div>
    );
  }

  return (
    <Icon
      {...props}
      errorFallback={
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <span className="text-red-600 dark:text-red-400 text-sm">⚠️</span>
          <span className="text-red-700 dark:text-red-300 text-sm">
            Icon "{props.name}" not available
          </span>
        </div>
      }
    />
  );
});

IconWithErrorBoundary.displayName = 'Icon';

export default IconWithErrorBoundary;
