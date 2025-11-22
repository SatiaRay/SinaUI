import React, { useEffect, useState, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styled from 'styled-components';

/**
 * ChatSkeletonLoading - Responsive skeleton loader for chat interfaces
 *
 * Features:
 * - Adapts to container size (not window size) using ResizeObserver
 * - Handles both initial welcome layout and chat layout
 * - Responsive to both width and height constraints
 * - Dark/light theme support
 * - Compact modes for small containers
 */

// color pairs tuned to dark/light themes
const THEMES = {
  light: {
    base: '#e5e7eb',
    highlight: '#f3f4f6',
    userBubble: '#dbeafe',
    assistantBubble: '#f3f4f6',
  },
  dark: {
    base: '#0b1220',
    highlight: '#142033',
    userBubble: '#08243a',
    assistantBubble: '#0b1722',
  },
};

// Styled Components
const Container = styled.div`
  background-color: ${(props) => props.theme.bg};
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const InitialLayoutContainer = styled(Container)`
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
`;

const ChatLayoutContainer = styled(Container)`
  padding: 0.5rem;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 0.5rem;

  @media (min-width: 640px) {
    max-width: 28rem;
    padding: 0 1rem;
  }

  @media (min-width: 768px) {
    max-width: 48rem;
    padding: 0;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: ${(props) => (props.$compact ? '0.5rem' : '1.5rem')};
  width: 100%;
  align-items: center;

  @media (min-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

const InputBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;

  @media (min-width: 768px) {
    max-width: 56.25rem;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #4b5563;
  border-radius: 1rem;
  width: 100%;

  @media (min-width: 768px) {
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
`;

const InputSkeletonWrapper = styled.div`
  flex: 1;
`;

const QuickButtonsContainer = styled.div`
  display: ${(props) => (props.$compact ? 'none' : 'flex')};
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  width: 100%;

  @media (min-width: 768px) {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important for flexbox scrolling */
`;

const MessagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$compact ? '0.5rem' : '1rem')};
  padding: ${(props) => (props.$compact ? '0.25rem 0' : '0.5rem 0')};
  margin: 0 auto;
  width: 100%;
  max-width: 100%;
  padding: 0 0.5rem;

  @media (min-width: 640px) {
    max-width: 24rem;
    padding: 0 1rem;
  }

  @media (min-width: 768px) {
    max-width: 48rem;
    gap: 1.5rem;
    padding: 1rem 0;
  }
`;

const MessageBubble = styled.div`
  display: flex;
  justify-content: ${(props) => (props.$isUser ? 'flex-end' : 'flex-start')};
  display: ${(props) => (props.$hidden ? 'none' : 'flex')};
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0.5rem 0.5rem 0;
  flex-shrink: 0; /* Prevent shrinking */

  @media (min-width: 768px) {
    max-width: 61.25rem;
    padding: 1rem 1rem 0;
  }
`;

const ChatQuickButtons = styled.div`
  display: ${(props) => (props.$compact ? 'none' : 'flex')};
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
  justify-content: center;
  width: 100%;

  @media (min-width: 768px) {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
`;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #4b5563;
  border-radius: 1rem;
  width: 100%;

  @media (min-width: 768px) {
    gap: 0.75rem;
  }
`;

// Mobile-first responsive skeleton dimensions
const getSkeletonWidth = (mobileWidth, desktopWidth) => `
  width: ${mobileWidth};
  
  @media (min-width: 768px) {
    width: ${desktopWidth};
  }
`;

const ResponsiveSkeleton = styled(Skeleton)`
  ${(props) =>
    props.$mobileWidth &&
    props.$desktopWidth &&
    getSkeletonWidth(props.$mobileWidth, props.$desktopWidth)}
`;

export const ChatSkeletonLoading = ({ initialLayout = true }) => {
  const [isDark, setIsDark] = useState(false);
  const [themeKey, setThemeKey] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  // Detect dark/light theme
  const getIsDark = () =>
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');

  useEffect(() => {
    setIsDark(getIsDark());

    // Observe container size changes using ResizeObserver
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerSize({ width: clientWidth, height: clientHeight });
      }
    };

    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Also observe theme changes
    const docEl =
      typeof document !== 'undefined' ? document.documentElement : null;
    let themeObserver = null;

    if (docEl && typeof MutationObserver !== 'undefined') {
      themeObserver = new MutationObserver(() => {
        const newIsDark = getIsDark();
        setIsDark(newIsDark);
        setThemeKey((prev) => prev + 1);
      });
      themeObserver.observe(docEl, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    // Initial size update
    updateSize();

    return () => {
      observer.disconnect();
      if (themeObserver) themeObserver.disconnect();
    };
  }, []);

  const theme = isDark ? THEMES.dark : THEMES.light;

  // Prevent flash of wrong theme
  if (typeof window !== 'undefined' && !isDark && getIsDark()) {
    return null;
  }

  // Calculate compact modes based on actual container height - NO FALLBACK!
  const containerHeight = containerSize.height;

  // Use more aggressive compact thresholds for widget
  const isCompact = containerHeight > 0 && containerHeight < 500;
  const isVeryCompact = containerHeight > 0 && containerHeight < 350;
  /**
   * StyledSkeleton component with responsive width and theme support
   */
  const StyledSkeleton = ({
    height,
    mobileWidth,
    desktopWidth,
    circle = false,
    className = '',
    baseColor = theme.base,
    highlightColor = theme.highlight,
  }) => (
    <ResponsiveSkeleton
      key={themeKey}
      height={height}
      $mobileWidth={mobileWidth}
      $desktopWidth={desktopWidth}
      circle={circle}
      baseColor={baseColor}
      highlightColor={highlightColor}
      className={className}
    />
  );

  /* ----------------- Initial / welcome skeleton ----------------- */
  const InitialView = () => (
    <InitialLayoutContainer
      theme={{ bg: isDark ? '#111827' : '#fafafa' }}
      ref={containerRef}
    >
      <ContentWrapper>
        <TitleSection $compact={isCompact}>
          {/* Hide some title elements in very compact mode */}
          {!isVeryCompact && (
            <>
              <StyledSkeleton
                height={isCompact ? 24 : 32}
                mobileWidth="12rem"
                desktopWidth="16rem"
              />
              <StyledSkeleton
                height={isCompact ? 18 : 24}
                mobileWidth="14rem"
                desktopWidth="20rem"
              />
            </>
          )}
          {/* Always show at least one title element */}
          <StyledSkeleton
            height={isCompact ? 16 : 16}
            mobileWidth="10rem"
            desktopWidth="14rem"
          />
        </TitleSection>

        <InputBar>
          <InputContainer>
            <StyledSkeleton
              height={isCompact ? 28 : 36}
              mobileWidth="28px"
              desktopWidth="42px"
              circle
            />
            <InputSkeletonWrapper>
              <StyledSkeleton
                height={isCompact ? 36 : 44}
                mobileWidth="100%"
                desktopWidth="100%"
              />
            </InputSkeletonWrapper>
            <StyledSkeleton
              height={isCompact ? 28 : 36}
              mobileWidth="28px"
              desktopWidth="42px"
              circle
            />
          </InputContainer>
        </InputBar>

        {/* Quick buttons are hidden in compact mode */}
        <QuickButtonsContainer $compact={isCompact || isVeryCompact}>
          {[0, 1, 2].map((i) => (
            <StyledSkeleton
              key={i}
              height={isCompact ? 32 : 44}
              mobileWidth="4rem"
              desktopWidth="8rem"
            />
          ))}
        </QuickButtonsContainer>
      </ContentWrapper>
    </InitialLayoutContainer>
  );

  /* ----------------- Chat / normal skeleton ----------------- */
  const ChatView = () => {
    // Dynamic message count based on container height - FIXED!
    const messageCount = isVeryCompact ? 1 : isCompact ? 2 : 3;

    // Message configuration with conditional hiding
    const messages = [
      {
        isUser: true,
        height: isCompact ? 40 : 56,
        mobileWidth: '8rem',
        desktopWidth: '12rem',
        hidden: false,
      },
      {
        isUser: false,
        height: isCompact ? 36 : 44,
        mobileWidth: '10rem',
        desktopWidth: '18rem',
        hidden: isVeryCompact && messageCount < 2,
      },
      {
        isUser: true,
        height: isCompact ? 40 : 44,
        mobileWidth: '6rem',
        desktopWidth: '10rem',
        hidden: isCompact && messageCount < 3,
      },
    ].slice(0, messageCount);

    return (
      <ChatLayoutContainer
        theme={{ bg: isDark ? '#111827' : '#fafafa' }}
        ref={containerRef}
      >
        <MessagesContainer>
          <MessagesWrapper $compact={isCompact}>
            {/* Dynamic messages based on container size */}
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                $isUser={message.isUser}
                $hidden={message.hidden}
              >
                <StyledSkeleton
                  height={message.height}
                  mobileWidth={message.mobileWidth}
                  desktopWidth={message.desktopWidth}
                  baseColor={
                    message.isUser ? theme.userBubble : theme.assistantBubble
                  }
                />
              </MessageBubble>
            ))}
          </MessagesWrapper>
        </MessagesContainer>

        <BottomSection>
          {/* Quick buttons hidden in very compact mode */}
          <ChatQuickButtons $compact={isVeryCompact}>
            {[0, 1].map((i) => (
              <StyledSkeleton
                key={i}
                height={isCompact ? 32 : 40}
                mobileWidth="4rem"
                desktopWidth="7rem"
              />
            ))}
          </ChatQuickButtons>

          {/* Input container - always visible */}
          <ChatInputContainer>
            <StyledSkeleton
              height={isCompact ? 32 : 40}
              mobileWidth="32px"
              desktopWidth="44px"
              circle
            />
            <InputSkeletonWrapper>
              <StyledSkeleton
                height={isCompact ? 36 : 44}
                mobileWidth="100%"
                desktopWidth="100%"
              />
            </InputSkeletonWrapper>
            <StyledSkeleton
              height={isCompact ? 32 : 40}
              mobileWidth="32px"
              desktopWidth="44px"
              circle
            />
          </ChatInputContainer>
        </BottomSection>
      </ChatLayoutContainer>
    );
  };

  return initialLayout ? <InitialView /> : <ChatView />;
};

export default ChatSkeletonLoading;
