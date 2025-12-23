// hooks/useIcon.js
import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Hook for dynamic icon loading with caching
 *
 * @hook
 * @param {string} iconName - Icon name to load
 * @param {Object} options - Hook options
 * @param {boolean} [options.preload=false] - Preload the icon
 * @param {boolean} [options.cache=true] - Enable caching
 * @returns {Object} Hook result
 */
export const useIcon = (iconName, options = {}) => {
  const { preload = false, cache = true } = options;

  const [iconComponent, setIconComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Shared cache between instances
  const iconCache = useMemo(() => ({}), []);

  /**
   * Normalize icon name to PascalCase
   */
  const normalizedName = useMemo(() => {
    if (!iconName) return '';

    return iconName
      .replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', '')
      )
      .replace(/^[a-z]/, (match) => match.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, '');
  }, [iconName]);

  /**
   * Load icon dynamically
   */
  const loadIcon = useCallback(async () => {
    if (!normalizedName) {
      setError('Icon name is required');
      return;
    }

    // Check cache
    if (cache && iconCache[normalizedName]) {
      setIconComponent(() => iconCache[normalizedName]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const iconModule = await import(
        `lucide-react/dist/esm/icons/${normalizedName}.js`
        );

      const icon = iconModule.default || iconModule[normalizedName];

      if (!icon) {
        throw new Error(`Icon not found: ${iconName}`);
      }

      // Cache the icon
      if (cache) {
        iconCache[normalizedName] = icon;
      }

      setIconComponent(() => icon);
    } catch (err) {
      console.error(`Error loading icon ${iconName}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [normalizedName, iconName, cache, iconCache]);

  // Load icon when preload is enabled
  useEffect(() => {
    if (iconName && preload) {
      loadIcon();
    }
  }, [iconName, preload, loadIcon]);

  /**
   * Reload the icon
   */
  const reload = useCallback(() => {
    // Remove from cache
    if (cache && iconCache[normalizedName]) {
      delete iconCache[normalizedName];
    }

    loadIcon();
  }, [normalizedName, cache, iconCache, loadIcon]);

  return {
    Icon: iconComponent,
    loading,
    error,
    reload,
    normalizedName,
    exists: !!iconComponent && !error,
  };
};

/**
 * Hook for loading multiple icons
 */
export const useIcons = (iconNames, options = {}) => {
  const { cache = true } = options;

  const [icons, setIcons] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  const iconCache = useMemo(() => ({}), []);

  /**
   * Load a single icon
   */
  const loadIcon = useCallback(async (iconName) => {
    const normalizedName = iconName
      .replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', '')
      )
      .replace(/^[a-z]/, (match) => match.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, '');

    // Check cache
    if (cache && iconCache[normalizedName]) {
      setIcons(prev => ({
        ...prev,
        [iconName]: iconCache[normalizedName],
      }));
      return;
    }

    setLoading(prev => ({ ...prev, [iconName]: true }));
    setErrors(prev => ({ ...prev, [iconName]: null }));

    try {
      const iconModule = await import(
        `lucide-react/dist/esm/icons/${normalizedName}.js`
        );

      const icon = iconModule.default || iconModule[normalizedName];

      if (!icon) {
        throw new Error(`Icon not found: ${iconName}`);
      }

      // Cache the icon
      if (cache) {
        iconCache[normalizedName] = icon;
      }

      setIcons(prev => ({
        ...prev,
        [iconName]: icon,
      }));
    } catch (err) {
      console.error(`Error loading icon ${iconName}:`, err);
      setErrors(prev => ({
        ...prev,
        [iconName]: err.message,
      }));
    } finally {
      setLoading(prev => ({ ...prev, [iconName]: false }));
    }
  }, [cache, iconCache]);

  /**
   * Load all icons
   */
  const loadAllIcons = useCallback(() => {
    iconNames.forEach(iconName => {
      if (iconName) {
        loadIcon(iconName);
      }
    });
  }, [iconNames, loadIcon]);

  // Auto-load icons
  useEffect(() => {
    loadAllIcons();
  }, [loadAllIcons]);

  return {
    icons,
    loading,
    errors,
    reloadIcon: loadIcon,
    reloadAll: loadAllIcons,
  };
};