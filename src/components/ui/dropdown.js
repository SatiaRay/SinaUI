'use client';

import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ label = 'Dropdown button', children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-right ${className || ''}`}>
      {/* ---- BUTTON ---- */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-1.5
                   dark:text-white text-black bg-gray-300 dark:bg-gray-700 hover:bg-gray-400  dark:hover:bg-gray-600
                   focus:outline-none focus:ring-4 focus:ring-blue-300
                   font-medium text-sm px-4 py-2.5 rounded-md
                   transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
        </svg>
      </button>

      {/* ---- MENU ---- */}
      <div
        ref={dropdownRef}
        className={`absolute left-0 z-50 mt-2 w-44
                   bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg
                   transition-all duration-200 ease-out
                   ${isOpen
                     ? 'opacity-100 scale-100 visible'
                     : 'opacity-0 scale-95 invisible'}`}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <ul className="py-2 text-sm text-gray-200">
          {React.Children.map(children, (child, i) => (
            <li key={i}>{child}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ---- OPTION (link or button) ---- */
Dropdown.Option = ({ children, href, onClick }) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const base = "block w-full text-right px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-white transition-colors";

  if (href) {
    return (
      <a href={href} onClick={handleClick} className={base}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={base}>
      {children}
    </button>
  );
};

export default Dropdown;