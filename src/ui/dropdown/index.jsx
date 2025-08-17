// CustomDropdown.js
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const CustomDropdown = ({ options, value, onChange, placeholder }) => {
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

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={ref} className="relative w-48">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full border rounded-lg px-3 py-2 text-sm flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedOption ? selectedOption.label : placeholder}
        <span className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}>&#9662;</span>
      </button>

      <ul
        className={`absolute p-2 left-0 right-0 mt-1 border rounded-lg bg-white shadow-lg z-50 overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
       {options.map((opt, index) => (
  <li
    key={opt.value}
    onClick={() => handleSelect(opt.value)}
    className={`
      px-3 py-2 cursor-pointer hover:bg-blue-200 text-sm rounded-lg
      ${opt.value === value ? "bg-gray-800 text-white font-medium" : ""}
      ${index !== options.length - 1 ? "border-b border-gray-200" : ""}
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
