import { useEffect } from 'react';

const ViewportHeightFix = () => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set initially
    setVh();

    // Update on resize & orientation change
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    // debounce for performance
    let timeout: NodeJS.Timeout;
    const debouncedSetVh = () => {
      clearTimeout(timeout);
      timeout = setTimeout(setVh, 50);
    };
    window.addEventListener('resize', debouncedSetVh);

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('resize', debouncedSetVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  // This component renders nothing
  return null;
};

export default ViewportHeightFix;