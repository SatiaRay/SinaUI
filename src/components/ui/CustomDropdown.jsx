// CustomDropdown.js
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  className,
  parentStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={ref} className={`relative ${parentStyle}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full dark:text-white border rounded-lg px-3 py-2 text-sm flex justify-between items-center ${className}`}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <span
          className={`ml-2 transition-transform dark:bg-gray-800 dark:border-gray-600 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <IoIosArrowDown />
        </span>
      </button>

      <ul
        className={`absolute p-2 left-0 right-0 mt-1 border rounded-lg
  bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg z-50 overflow-hidden transition-all duration-300
  ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {options.map((opt, index) => (
          <li
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`
  px-3 py-2 cursor-pointer rounded-lg text-sm
  ${
    opt.value === value
      ? 'bg-blue-600 dark:bg-blue-500 text-white font-medium'
      : 'text-gray-900 dark:text-gray-100'
  }
  hover:bg-blue-100 dark:hover:bg-blue-700
  ${
    index !== options.length - 1
      ? 'border-b border-gray-200 dark:border-gray-700'
      : ''
  }
`}
          >
            {opt.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

CustomDropdown.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default CustomDropdown;
