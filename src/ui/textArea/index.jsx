import React, { useState, useRef, useEffect } from 'react';
import { EditableInput, InputWrapper, Placeholder } from '../../components/ui/common';

const TextInputWithBreaks = ({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = 'سوال خود را بپرسید...',
}) => {
  const inputRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(!value);

  useEffect(() => {
    if (inputRef.current) {
      // Only update if content is different to avoid cursor jumping
      if (inputRef.current.textContent !== value) {
        inputRef.current.textContent = value;
      }
      setIsEmpty(!value);
    }
  }, [value]);

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

  const handleInput = (e) => {
    const textContent = e.target.textContent;
    onChange(textContent);
    setIsEmpty(!textContent);

    // Ensure RTL direction is maintained in Firefox
    if (inputRef.current) {
      inputRef.current.setAttribute('dir', 'rtl');
    }
  };

  const handleFocus = () => {
    // Ensure RTL direction on focus for Firefox
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
    <InputWrapper>
      <EditableInput
        ref={inputRef}
        dir="rtl"
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onPaste={handlePaste}
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
      {isEmpty && <Placeholder>{placeholder}</Placeholder>}
    </InputWrapper>
  );
};

export default TextInputWithBreaks;
