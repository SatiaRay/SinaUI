import React, { useState, useRef, useEffect } from "react";

const TextArea = ({ value, onChange, onSubmit, disabled, placeholder }) => {
    const textareaRef = useRef(null);

    // Auto-resize on value change
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // reset
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // adjust
        }
    }, [value]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!disabled && value.trim()) onSubmit();
        }
    };

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="
        w-full
        bg-gray-50 dark:bg-gray-900
        text-gray-800 dark:text-gray-100
        flex
        pt-5
        -mb-0.5
        focus:outline-none
        placeholder-gray-400 dark:placeholder-gray-500
        transition-all
      "
            style={{
                minHeight: "18px",
                maxHeight: "200px",
                direction: "rtl",
            }}
        />
    );
};

export default TextArea;
