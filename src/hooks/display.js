import { create } from '@kodingdotninja/use-tailwind-breakpoint';
import { useState } from 'react';

export const { useBreakpoint } = create({
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
});

export const useDisplay = () => {
  const [height, setHeight] = useState(window.innerHeight);

  const [width, setWidth]  = useState(window.innerWidth)

  window.addEventListener('resize', () => {
    setHeight(window.innerHeight)

    setWidth(window.innerWidth)
  })

  const isDesktop = useBreakpoint('md')

  const isLargeDisplay = useBreakpoint('lg')

  return { width, height, isDesktop, isLargeDisplay };
};
