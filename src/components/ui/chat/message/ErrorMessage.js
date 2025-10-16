import React from 'react';
import styled from 'styled-components';
import { FiRefreshCw } from 'react-icons/fi';

export const ErrorMessageContent = styled.pre`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  word-wrap: break-word;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  max-width: 100%;
  text-align: right;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #7f1d1d !important;
  background-color: #fee2e2 !important;
  border: 1px solid #f87171 !important;

  svg {
    flex-shrink: 0;
    margin-left: 0.5rem;
    color: #b91c1c !important;
  }

  @media (min-width: 768px) {
    max-width: 450px;
  }

  .dark & {
    background-color: rgba(220, 38, 38, 0.5) !important;
    color: #fca5a5 !important;
    border: 1px solid #f87171 !important;

    svg {
      color: #fca5a5 !important;
    }
  }
`;

const ErrorRow = styled.span`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const LeftGroup = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
`;

const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  border: 1px solid transparent;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
  transition:
    transform 0.12s ease,
    background-color 0.12s ease,
    box-shadow 0.12s ease,
    border-color 0.12s ease;
  white-space: nowrap;
  background-color: #f87171;
  color: #7f1d1d;
  border-color: rgba(248, 113, 113, 0.18);

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.95;
  }

  &:hover {
    background-color: #fca5a5;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(31, 41, 55, 0.06);
  }

  &:active {
    transform: translateY(0);
    background-color: #b91c1c;
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid rgba(249, 115, 115, 0.18);
    outline-offset: 2px;
  }

  .dark & {
    background-color: rgba(220, 38, 38, 0.28);
    color: #fca5a5;
    border-color: rgba(248, 113, 113, 0.18);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);

    svg {
      opacity: 1;
    }

    &:hover {
      background-color: rgba(220, 38, 38, 0.36);
      box-shadow: 0 6px 18px rgba(220, 38, 38, 0.08);
      transform: translateY(-1px);
    }

    &:active {
      background-color: rgba(185, 28, 28, 0.42);
    }
  }
`;

const MessageText = styled.span`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: inherit;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ErrorMessage = ({ data, onRetry }) => {
  return (
    <div align={'center'}>
      <ErrorMessageContent>
        <ErrorRow>
          <LeftGroup>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              style={{
                width: 24,
                height: 24,
                boxSizing: 'content-box',
                flex: '0 0 auto',
              }}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            <MessageText title={typeof data.body === 'string' ? data.body : ''}>
              {data.body}
            </MessageText>
          </LeftGroup>
          <RetryButton onClick={onRetry} aria-label="تلاش مجدد">
            <FiRefreshCw aria-hidden />
            تلاش مجدد
          </RetryButton>
        </ErrorRow>
      </ErrorMessageContent>
    </div>
  );
};
