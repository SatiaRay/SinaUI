import React, { useRef, useState } from 'react';
import { copyToClipboard } from '@utils/helpers';
import { notify } from '../../../../../ui/toast';
import { TextMessageContent, CopyButton } from '../../../common';
import { marked } from 'marked';

const TextMessage = ({ data, messageId, enableCopy = true }) => {
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const textRef = useRef(null);

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
      .catch((err) => console.error('Failed to copy:', err));
  };

  const cleanTextContent = (text) => {
    if (!text) return text;

    let cleanedText = text.replace(/^\s+|\s+$/g, '');
    cleanedText = cleanedText.replace(/\n\s*\n\s*\n/g, '\n\n');

    return cleanedText;
  };

  let contentToRender = '';
  if (data.role === 'assistant') {
    let safeBody = data.body.replace(/^(\d+)\.\s+\*\*/gm, '**$1. ');

    safeBody = cleanTextContent(safeBody);

    let formattedHtml = marked.parse(safeBody);
    formattedHtml = String(formattedHtml);

    formattedHtml = formattedHtml.replace(
      /<strong>/g,
      (match, offset, fullString) => {
        fullString = String(fullString);
        const before = fullString.slice(0, offset);
        const lastPart = before.slice(-50);
        if (/<hr\b[^>]*>/i.test(lastPart)) {
          return match;
        }
        return '<hr>' + match;
      }
    );

    contentToRender = (
      <TextMessageContent
        ref={textRef}
        dangerouslySetInnerHTML={{ __html: formattedHtml }}
      />
    );
  } else {
    const cleanedBody = cleanTextContent(data.body);
    contentToRender = (
      <TextMessageContent ref={textRef}>{cleanedBody}</TextMessageContent>
    );
  }

  return (
    <>
      {contentToRender}
      {enableCopy && data.role === 'assistant' && (
        <CopyButton
          onClick={() => handleCopyAnswer(data.body, messageId)}
          copied={copiedMessageId === messageId}
        >
          {copiedMessageId === messageId ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
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
            >
              <g transform="scale(-1,1) translate(-24,0)">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </g>
            </svg>
          )}
        </CopyButton>
      )}
    </>
  );
};

export default TextMessage;
