import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Instantiate theme context
 */
export const ThemeContext = createContext(null);

/**
 * Theme provider
 * @param {jsx} children
 * @returns
 */
export const ThemeProvider = ({ children }) => {
  /**
   * Theme sate
   */
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to "light"
    return localStorage.getItem('theme') || 'light';
  });

  /**
   * Sync local storage with current theme for persistance theme between page reloads
   */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');

    const editorWrappers = document.querySelectorAll('.ckeditor-wrapper');
    editorWrappers.forEach((wrapper) => {
      wrapper.classList.toggle('dark', theme === 'dark');
    });

    localStorage.setItem('theme', theme);
  }, [theme]);

  /**
   * Toggle theme handler
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  /**
   * Return context
   */
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * @returns theme context hook
 */
export const useTheme = () => useContext(ThemeContext);
