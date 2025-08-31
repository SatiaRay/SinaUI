import {
  copyToClipboard,
  formatTimestamp,
  stripHtmlTags,
} from "../../../../utils/helpers";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MetaMessage from "./MetaMessage";
import { notify } from "../../../../ui/toast";

const Message = ({ messageId, data }) => {
  const textRef = useRef(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  /**
   * Copy answer message text to device clipboard
   *
   * @param {string} textToCopy
   * @param {int} messageId
   */
  const handleCopyAnswer = (textToCopy, messageId) => {
    const temp = document.createElement("div");
    temp.innerHTML = textToCopy;
    const plainText = temp.textContent || temp.innerText || "";

    copyToClipboard(plainText)
      .then(() => {
        setCopiedMessageId(messageId);
        notify.success("متن کپی شد!", {
          autoClose: 1000,
          position: "top-left",
        });

        setTimeout(() => setCopiedMessageId(null), 4000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  return (
    <>
      {(() => {
        switch (data.type) {
          case "question":
            return (
              <div className="bg-blue-100/70 md:ml-16 dark:bg-blue-900/20 p-3 rounded-lg text-right">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(data.timestamp)}
                  </span>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    شما
                  </span>
                </div>
                <pre
                  className="text-gray-800 pt-1 leading-5 dark:text-white [&_a]:text-blue-600 [&_a]:hover:text-blue-700 [&_a]:underline [&_a]:break-all dark:[&_a]:text-blue-400 dark:[&_a]:hover:text-blue-300"
                  dangerouslySetInnerHTML={{ __html: data.text }}
                />
              </div>
            );
          case "answer":
            return (
              <div className=" bg-white dark:bg-gray-800 px-4 py-2 flex flex-col text-wrap md:ml-1 md:mr-8 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(data.timestamp)}
                  </span>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    چت‌بات
                  </span>
                </div>
                <div>
                  <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                    پاسخ:
                  </h3>
                  <pre
                    ref={textRef}
                    style={{
                      unicodeBidi: "plaintext",
                      direction: "rtl",
                    }}
                    className="text-gray-800 flex text-wrap flex-wrap px-2 pt-2 leading-5 dark:text-white [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:bg-white [&_th]:text-black [&_th]:p-2 [&_th]:border [&_th]:border-gray-200 [&_th]:text-right dark:[&_th]:bg-white dark:[&_th]:text-black dark:[&_th]:border-gray-700 [&_td]:p-2 [&_td]:border [&_td]:border-gray-200 [&_td]:text-right dark:[&_td]:text-white dark:[&_td]:border-gray-700 [&_a]:text-blue-600 [&_a]:hover:text-blue-700 [&_a]:underline [&_a]:break-all dark:[&_a]:text-blue-400 dark:[&_a]:hover:text-blue-300"
                    dangerouslySetInnerHTML={{ __html: data.answer }}
                  />
                  <button
                    onClick={() => handleCopyAnswer(data.answer, messageId)}
                    className="mt-4 flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    style={{
                      color:
                        copiedMessageId === messageId ? "#3dc909" : "#444",
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
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </g>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            );
          case "option":
            return (
              <div className=" bg-white dark:bg-gray-800 px-4 py-2 flex flex-col text-wrap md:ml-1 md:mr-8 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(data.timestamp)}
                  </span>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    چت‌بات
                  </span>
                </div>
                <div>
                  <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                    پاسخ:
                  </h3>
                  <div>
                    <MetaMessage messageId={messageId} metadata={data.metadata} />
                  </div>
                </div>
              </div>
            );
          default:
            return null;
        }
      })()}
    </>
  );
};

export default React.memo(Message);
