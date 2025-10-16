import React, { useState, useRef, useEffect } from 'react';
import {
  EditableInput,
  InputWrapper,
  Placeholder,
} from '../../components/ui/common';

const TextInputWithBreaks = ({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = 'سوال خود را بپرسید...',
}) => {
  const inputRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(!value);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    const isIPhone = /iPhone/i.test(ua);
    const isIPod = /iPod/i.test(ua);
    const isIPadLegacy = /iPad/i.test(ua);
    const isIPadModern =
      navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    const isAndroid = /Android/i.test(ua);
    const isMobileOrTablet = /Mobi|Tablet/i.test(ua);

    const isMobileDevice =
      isIPhone ||
      isIPod ||
      isIPadLegacy ||
      isIPadModern ||
      isAndroid ||
      isMobileOrTablet;

    setIsMobile(isMobileDevice);
  }, []);

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
        if (isMobile) return;
        e.preventDefault();
        if (!disabled && value.trim()) {
          const plainText = value.replace(/<\/?[^>]+(>|$)/g, '');
          onSubmit(plainText);
        }
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
      {isEmpty && <Placeholder>{placeholder}</Placeholder>}
    </InputWrapper>
  );
};

export default TextInputWithBreaks;
