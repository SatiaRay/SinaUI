import React, { useRef, useState } from 'react';
import { copyToClipboard } from '../../../../../utils/helpers';
import { notify } from '../../../../../ui/toast';

const TextMessage = ({ data, messageId, enableCopy = true }) => {
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const textRef = useRef(null);

  /**
   * Copy answer message text to device clipboard
   *
   * @param {string} textToCopy
   * @param {int} messageId
   */
  const handleCopyAnswer = (textToCopy, messageId) => {
    const temp = document.createElement('div');
    temp.innerHTML = textToCopy;
    const plainText = temp.textContent || temp.innerText || '';

    copyToClipboard(plainText)
      .then(() => {
        setCopiedMessageId(messageId);
        notify.success('متن کپی شد!', {
          autoClose: 1000,
          position: 'top-left',
        });

        setTimeout(() => setCopiedMessageId(null), 4000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <>
      <pre
        ref={textRef}
        style={{
          unicodeBidi: 'plaintext',
          direction: 'rtl',
        }}
        className="text-gray-800 flex text-wrap flex-wrap px-2 pt-2 dark:text-white [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:bg-white [&_th]:text-black [&_th]:p-2 [&_th]:border [&_th]:border-gray-200 [&_th]:text-right dark:[&_th]:bg-white dark:[&_th]:text-black dark:[&_th]:border-gray-700 [&_td]:p-2 [&_td]:border [&_td]:border-gray-200 [&_td]:text-right dark:[&_td]:text-white dark:[&_td]:border-gray-700 [&_a]:text-blue-600 [&_a]:hover:text-blue-700 [&_a]:underline [&_a]:break-all dark:[&_a]:text-blue-400 dark:[&_a]:hover:text-blue-300"
        dangerouslySetInnerHTML={{ __html: data.body }}
      />
      {enableCopy && (
        <button
          onClick={() => handleCopyAnswer(data.body, messageId)}
          className="mt-2 flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          style={{
            color: copiedMessageId === messageId ? '#3dc909' : '#444',
          }}
        >
          {copiedMessageId === messageId ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dark:text-gray-100"
            >
              <g transform="scale(-1,1) translate(-24,0)">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </g>
            </svg>
          )}
        </button>
      )}
    </>
  );
};

export default TextMessage;
