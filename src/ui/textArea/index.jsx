import React, { useState, useRef, useEffect } from "react";

const TextInputWithBreaks = ({ value, onChange, onSubmit, disabled, placeholder }) => {
    const inputRef = useRef(null);
    const [isEmpty, setIsEmpty] = useState(!value);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.textContent = value;
            setIsEmpty(!value);
        }
    }, [value]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (e.shiftKey) {
                // Allow the default behavior for Shift+Enter (line break)
                // We'll handle the cursor position after the browser creates the line break
                setTimeout(() => {
                    if (inputRef.current) {
                        // Ensure the cursor stays at the end of the new line
                        const selection = window.getSelection();
                        const range = document.createRange();
                        range.selectNodeContents(inputRef.current);
                        range.collapse(false); // Move to the end
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }, 0);
            } else {
                e.preventDefault();
                if (!disabled && value.trim()) onSubmit();
            }
        }
    };

    const handleInput = (e) => {
        const textContent = e.target.textContent;
        onChange(textContent);
        setIsEmpty(!textContent);
    };

    return (
        <div className="relative w-full">
            <div
                ref={inputRef}
                className="
                    w-full
                    bg-gray-50 dark:bg-gray-900
                    text-gray-800 dark:text-gray-100
                    py-3.5
                    px-2
                    focus:outline-none
                    placeholder-gray-400 dark:placeholder-gray-500
                    transition-all
                    whitespace-pre-wrap
                    break-words
                    overflow-hidden
                    min-h-[20px]
                    max-h-[200px]
                    overflow-y-auto
                    rounded-lg
                    focus:border-none
                "
                style={{ direction: "rtl" }}
                contentEditable={!disabled}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning={true}
            />
            {isEmpty && (
                <div
                    className="absolute top-3 right-2 text-gray-400 dark:text-gray-500 pointer-events-none"
                    style={{ direction: "rtl" }}
                >
                    {placeholder}
                </div>
            )}
        </div>
    );
};

export default TextInputWithBreaks;