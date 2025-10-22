import styled from 'styled-components';
import React from 'react';

const SkeletonContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem 0.75rem;
  gap: 1.25rem;
  direction: rtl;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;

  &.fade-out {
    opacity: 0;
  }
`;

const SkeletonBubbleWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

const SkeletonMessageBubble = styled.div`
  max-width: 100%;
  min-width: 17rem;
  padding: 1.2rem 1.4rem;
  border-radius: 1.25rem;
  background-color: #f0f0f0;
  animation: pulse 1.5s ease-in-out infinite;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: flex-start;
  text-align: right;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

const SkeletonTextLine = styled.div`
  height: 1rem;
  border-radius: 0.4rem;
  background-color: rgba(0, 0, 0, 0.08);
  width: 100%;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

const SkeletonIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  direction: rtl;
`;

const SkeletonName = styled.div`
  height: 3rem;
  border-radius: 0.4rem;
  background-color: #dcdcdc;
  width: 6rem;
`;

export const AISkeletonMessage = React.memo(
  ({ lineCount = 5, theme = 'light' }) => {
    const lines = Array.from({ length: lineCount }, (_, index) => ({
      id: index,
      width: `${100 - index * 5}%`,
    }));

    return (
      <SkeletonBubbleWrapper style={{ justifyContent: 'flex-start' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.6rem',
            width: 'fit-content',
          }}
        >
          <SkeletonIndicator>
            <SkeletonName />
          </SkeletonIndicator>
          <SkeletonMessageBubble isUser={false}>
            {lines.map((line) => (
              <SkeletonTextLine
                key={line.id}
                width={line.width}
                style={{ marginBottom: '0.4rem' }}
              />
            ))}
          </SkeletonMessageBubble>
        </div>
      </SkeletonBubbleWrapper>
    );
  }
);

export const UserSkeletonMessage = React.memo(
  ({ lineCount = 3, theme = 'light' }) => {
    const lines = Array.from({ length: lineCount }, (_, index) => ({
      id: index,
      width: `${90 - index * 15}%`,
    }));

    return (
      <SkeletonBubbleWrapper style={{ justifyContent: 'flex-start' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.6rem',
            width: 'fit-content',
          }}
        >
          <SkeletonIndicator>
            <SkeletonName />
          </SkeletonIndicator>
          <SkeletonMessageBubble isUser={true}>
            {lines.map((line) => (
              <SkeletonTextLine
                key={line.id}
                width={line.width}
                isUser={true}
                style={{ marginBottom: '0.4rem' }}
              />
            ))}
          </SkeletonMessageBubble>
        </div>
      </SkeletonBubbleWrapper>
    );
  }
);

const ChatSkeletonLoader = ({ theme = 'light', className }) => {
  return (
    <SkeletonContainer className={className}>
      <AISkeletonMessage lineCount={5} />
      <AISkeletonMessage lineCount={4} />
      <UserSkeletonMessage lineCount={3} />
      <AISkeletonMessage lineCount={6} />
      <UserSkeletonMessage lineCount={2} />
    </SkeletonContainer>
  );
};

export default ChatSkeletonLoader;
