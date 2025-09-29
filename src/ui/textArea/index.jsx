import React, { useState, useRef, useEffect } from 'react';

const TextInputWithBreaks = ({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder,
  className = '',
}) => {
  const inputRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(!value);

  // Update the contentEditable div whenever value changes
  useEffect(() => {
    if (inputRef.current) {
      // Only update if content is different to avoid cursor jumping
      if (inputRef.current.textContent !== value) {
        inputRef.current.textContent = value;
      }
      setIsEmpty(!value);
    }
  }, [value]);

  // Handle key presses (Enter and Shift+Enter)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow the default behavior for Shift+Enter
        setTimeout(() => {
          if (inputRef.current) {
            // Set explicit RTL direction for Firefox compatibility
            inputRef.current.setAttribute('dir', 'rtl');
            placeCaretAtEnd(inputRef.current);
          }
        }, 0);
      } else {
        e.preventDefault();
        if (!disabled && value.trim()) onSubmit();
      }
    }
  };

  // Helper function to place caret at end of contenteditable
  const placeCaretAtEnd = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  // Handle input changes inside contentEditable div
  const handleInput = (e) => {
    const textContent = e.target.textContent;
    onChange(textContent);
    setIsEmpty(!textContent);

    // Ensure RTL direction is maintained in Firefox
    if (inputRef.current) {
      inputRef.current.setAttribute('dir', 'rtl');
    }
  };

  // Ensure caret placement and RTL on focus
  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.setAttribute('dir', 'rtl');
      placeCaretAtEnd(inputRef.current);
    }
  };

  // Handle paste → force plain text (strip formatting like GPT)
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain'); // only plain text
    document.execCommand('insertText', false, text); // insert clean text
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={inputRef}
        className="
          w-full
          bg-gray-50 dark:bg-gray-900
          text-gray-800 dark:text-gray-100
          py-3.5
          px-2
          whitespace-pre-wrap
          break-words
          rounded-lg
          min-h-[44px]
          h-[44px]
          max-h-[200px]
          overflow-y-auto
          border-none
          outline-none
          focus:outline-none
          focus:border-none
          focus:ring-0
        "
        dir="rtl"
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onPaste={handlePaste} // 🔥 new paste handler
        suppressContentEditableWarning={true}
      />
      {isEmpty && (
        <div
          className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
          style={{ direction: 'rtl' }}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
};

// Export wrapped in React.memo to prevent unnecessary re-renders
export default React.memo(TextInputWithBreaks);
