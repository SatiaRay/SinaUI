// ChatSkeletonLoading.jsx
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * ChatSkeletonLoading (Tailwind + class-based dark mode)
 *
 * - Uses Tailwind classes for layout & background
 * - Detects `dark` class on documentElement so skeleton colors match app dark mode
 * - Props:
 *    - initialLayout (boolean) : true -> welcome/empty state skeleton,
 *                                false -> chat skeleton (messages + input)
 */

/* color pairs tuned to Tailwind dark/light tokens */
const THEMES = {
  light: {
    base: '#e5e7eb', // gray-200
    highlight: '#f3f4f6', // gray-100
    userBubble: '#dbeafe', // light blue-ish
    assistantBubble: '#f3f4f6',
  },
  dark: {
    base: '#0b1220', // deep navy (blend with dark app bg)
    highlight: '#142033', // subtle highlight on dark
    userBubble: '#08243a', // darker blue for user bubble
    assistantBubble: '#0b1722', // assistant bubble tone
  },
};

export const ChatSkeletonLoading = ({ initialLayout = true }) => {
  // viewport tracking for responsiveness
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  // detect whether the app currently has class 'dark' on documentElement
  const getIsDark = () =>
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');
  const [isDark, setIsDark] = useState(false); // Start with false initially
  // key for forcing re-render when theme changes
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    // Set initial theme after mount to ensure Tailwind classes are applied
    setIsDark(getIsDark());

    // update width on resize
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });

    // observe class changes on <html> to detect dark mode toggles (class-based)
    const docEl =
      typeof document !== 'undefined' ? document.documentElement : null;
    let mo = null;
    if (docEl && typeof MutationObserver !== 'undefined') {
      mo = new MutationObserver(() => {
        const newIsDark = getIsDark();
        setIsDark(newIsDark);
        // force re-render by changing key
        setThemeKey((prev) => prev + 1);
      });
      mo.observe(docEl, { attributes: true, attributeFilter: ['class'] });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mo) mo.disconnect();
    };
  }, []);

  const theme = isDark ? THEMES.dark : THEMES.light;
  const isMobile = width < 768;

  // Show nothing until we know the theme to prevent flash
  if (typeof window !== 'undefined' && !isDark && getIsDark()) {
    return null;
  }

  /* ----------------- Initial / welcome skeleton ----------------- */
  const InitialView = () => (
    <div
      className={`min-h-screen bg-neutral-50 dark:bg-gray-900 transition-all duration-300 h-screen flex items-center justify-center p-6`}
    >
      <div
        className={`w-full ${isMobile ? 'max-w-xl' : 'max-w-3xl'} text-center`}
      >
        {/* big title area */}
        <div className="mb-6 space-y-3">
          <Skeleton
            key={`title-1-${themeKey}`}
            height={36}
            width={isMobile ? 260 : 420}
            baseColor={theme.base}
            highlightColor={theme.highlight}
            className="mx-auto rounded"
          />
          <Skeleton
            key={`title-2-${themeKey}`}
            height={28}
            width={isMobile ? 300 : 520}
            baseColor={theme.base}
            highlightColor={theme.highlight}
            className="mx-auto rounded"
          />
          <Skeleton
            key={`title-3-${themeKey}`}
            height={18}
            width={isMobile ? 220 : 380}
            baseColor={theme.base}
            highlightColor={theme.highlight}
            className="mx-auto rounded"
          />
        </div>

        {/* input bar (mic - text area - send) */}
        <div className="flex items-center justify-center">
          <div
            className="flex items-center gap-3 px-3 py-2 border border-gray-600 rounded-2xl w-full"
            style={{ maxWidth: isMobile ? '100%' : 900 }}
          >
            <div className="flex-shrink-0">
              <Skeleton
                key={`mic-${themeKey}`}
                height={42}
                width={42}
                circle
                baseColor={theme.base}
                highlightColor={theme.highlight}
              />
            </div>

            <div style={{ flex: 1 }}>
              <Skeleton
                key={`input-${themeKey}`}
                height={52}
                width="100%"
                baseColor={theme.base}
                highlightColor={theme.highlight}
                className="rounded-lg"
              />
            </div>

            <div className="flex-shrink-0">
              <Skeleton
                key={`send-${themeKey}`}
                height={42}
                width={42}
                circle
                baseColor={theme.base}
                highlightColor={theme.highlight}
              />
            </div>
          </div>
        </div>

        {/* wizard quick buttons */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={`wizard-${i}-${themeKey}`}
              height={56}
              width={isMobile ? 100 : 160}
              baseColor={theme.base}
              highlightColor={theme.highlight}
              className="rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  );

  /* ----------------- Chat / normal skeleton ----------------- */
  const ChatView = () => (
    <div
      className={`min-h-screen bg-neutral-50 dark:bg-gray-900 transition-all duration-300 h-screen flex flex-col p-6`}
    >
      {/* messages scrollable area */}
      <div className="flex-1 overflow-auto">
        <div
          className={`mx-auto ${isMobile ? 'max-w-sm' : 'max-w-3xl'} py-6 space-y-6`}
        >
          <div style={{ height: 12 }} />

          {/* user message (right) */}
          <div className="flex justify-end">
            <Skeleton
              key={`user-msg-1-${themeKey}`}
              height={64}
              width={isMobile ? 160 : 220}
              baseColor={theme.userBubble}
              highlightColor={theme.highlight}
              className="rounded-2xl"
            />
          </div>

          {/* assistant message (left) */}
          <div className="flex justify-start">
            <Skeleton
              key={`assistant-msg-1-${themeKey}`}
              height={52}
              width={isMobile ? 220 : 360}
              baseColor={theme.assistantBubble}
              highlightColor={theme.highlight}
              className="rounded-2xl"
            />
          </div>

          {/* another user message (right) */}
          <div className="flex justify-end">
            <Skeleton
              key={`user-msg-2-${themeKey}`}
              height={52}
              width={isMobile ? 150 : 200}
              baseColor={theme.userBubble}
              highlightColor={theme.highlight}
              className="rounded-2xl"
            />
          </div>

          {/* assistant message (left) */}
          <div className="flex justify-start">
            <Skeleton
              key={`assistant-msg-2-${themeKey}`}
              height={80}
              width={isMobile ? 240 : 400}
              baseColor={theme.assistantBubble}
              highlightColor={theme.highlight}
              className="rounded-2xl"
            />
          </div>

          {/* user message (right) */}
          <div className="flex justify-end">
            <Skeleton
              key={`user-msg-3-${themeKey}`}
              height={64}
              width={isMobile ? 160 : 240}
              baseColor={theme.userBubble}
              highlightColor={theme.highlight}
              className="rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* bottom input area */}
      <div
        style={{ maxWidth: isMobile ? '100%' : 980 }}
        className="mx-auto w-full px-4"
      >
        {/* wizard quick buttons - simplified */}
        <div className="flex gap-3 flex-wrap mb-4 justify-center">
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={`quick-btn-${i}-${themeKey}`}
              height={48}
              width={isMobile ? 90 : 140}
              baseColor={theme.base}
              highlightColor={theme.highlight}
              className="rounded-xl"
            />
          ))}
        </div>

        {/* bottom input bar */}
        <div className="flex items-center gap-3 p-2 rounded-2xl border border-gray-600">
          <Skeleton
            key={`input-mic-${themeKey}`}
            height={44}
            width={44}
            circle
            baseColor={theme.base}
            highlightColor={theme.highlight}
          />
          <div style={{ flex: 1 }}>
            <Skeleton
              key={`main-input-${themeKey}`}
              height={52}
              width="100%"
              baseColor={theme.base}
              highlightColor={theme.highlight}
              className="rounded-md"
            />
          </div>
          <Skeleton
            key={`send-btn-${themeKey}`}
            height={44}
            width={44}
            circle
            baseColor={theme.base}
            highlightColor={theme.highlight}
          />
        </div>
      </div>
    </div>
  );

  return initialLayout ? <InitialView /> : <ChatView />;
};

export default ChatSkeletonLoading;
