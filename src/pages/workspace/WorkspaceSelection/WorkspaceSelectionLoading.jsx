import React from 'react';
import { SkeletonLoading } from '../../../components/ui/loading/skeletonLoading';
import { useDisplay } from '../../../hooks/display';

/**
 * WorkspaceSelectionLoading Component - Skeleton loading screen for workspace selection page
 * Displays a skeleton interface that mimics the actual workspace selection page layout
 * with animated gradient backgrounds and carousel placeholder
 *
 * @component
 * @returns {JSX.Element} Rendered skeleton loading component
 */
const WorkspaceSelectionLoading = () => {
  /**
   * Display util hook for responsive design
   * Provides screen dimensions and device type detection
   */
  const { height, isDesktop, isMobile } = useDisplay();

  /**
   * Calculate number of skeleton avatar placeholders based on device type
   * @returns {number} Number of skeleton avatars to display
   */
  const calculateAvatarsCount = () => {
    if (isMobile) return 3;
    if (!isDesktop) return 4;
    return 5;
  };

  /**
   * Simulate gradient animation for background
   * Creates animated gradient effect similar to actual page
   */
  const gradientAnimation = `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .animate-gradient {
      background-size: 200% 200%;
      animation: gradientShift 3s ease infinite;
    }
  `;

  return (
    <div className="min-h-screen w-full bg-[#0e1b2e] relative overflow-hidden">
      {/* CSS Animations */}
      <style>{gradientAnimation}</style>

      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e1b2e] via-[#1a2942] to-[#0e1b2e] animate-gradient" />

        {/* Animated gradient orbs - skeleton */}
        <div className="absolute -bottom-32 -left-32 w-[700px] h-[700px] opacity-50 bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-3xl animate-pulse" />
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] opacity-40 bg-gradient-to-br from-green-500/30 to-cyan-500/30 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content skeleton */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8">
        {/* Title skeleton */}
        <div className="mb-20 text-center">
          <SkeletonLoading
            height={48}
            width={400}
            containerClassName="mb-4 mx-auto"
            className="rounded-xl"
          />
          <SkeletonLoading
            height={20}
            width={200}
            containerClassName="mx-auto"
            className="rounded-lg"
          />
        </div>

        {/* Carousel Container Skeleton */}
        <div className="relative w-full max-w-5xl">
          {/* Arrow buttons skeleton */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
            <SkeletonLoading height={80} width={80} className="rounded-2xl" />
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
            <SkeletonLoading height={80} width={80} className="rounded-2xl" />
          </div>

          {/* Workspace avatars carousel skeleton */}
          <div className="flex items-center justify-center h-[420px] relative">
            {Array.from({ length: calculateAvatarsCount() }).map((_, index) => {
              const isCenter =
                index === Math.floor(calculateAvatarsCount() / 2);

              return (
                <div
                  key={index}
                  className="absolute transition-all duration-700"
                  style={{
                    transform: `
                      translateX(${(index - Math.floor(calculateAvatarsCount() / 2)) * 220}px)
                      scale(${isCenter ? 1 : 0.65})
                    `,
                    zIndex: isCenter
                      ? 10
                      : 5 -
                        Math.abs(
                          index - Math.floor(calculateAvatarsCount() / 2)
                        ),
                    filter: isCenter ? 'none' : 'blur(2px) brightness(0.7)',
                  }}
                >
                  <div className="group flex flex-col items-center gap-6">
                    <div className="relative">
                      {/* Avatar skeleton with different sizes */}
                      <SkeletonLoading
                        height={isCenter ? 192 : 128}
                        width={isCenter ? 192 : 128}
                        className="rounded-full"
                      />

                      {/* Center workspace glow effect skeleton */}
                      {isCenter && (
                        <>
                          <div className="absolute -inset-8 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
                          <div className="absolute -inset-6 rounded-full bg-purple-500/30 blur-2xl animate-pulse delay-500" />
                        </>
                      )}
                    </div>

                    {/* Info section skeleton - only for center */}
                    {isCenter && (
                      <div className="flex flex-col items-center gap-3 min-h-[120px]">
                        <SkeletonLoading
                          height={28}
                          width={150}
                          className="rounded-lg"
                        />

                        {/* Status badge skeleton */}
                        <SkeletonLoading
                          height={36}
                          width={120}
                          className="rounded-full"
                        />

                        {/* Stats skeleton */}
                        <div className="flex items-center gap-4">
                          <SkeletonLoading
                            height={16}
                            width={60}
                            className="rounded"
                          />
                          <SkeletonLoading
                            height={16}
                            width={80}
                            className="rounded"
                          />
                        </div>

                        {/* Select hint skeleton */}
                        <SkeletonLoading
                          height={32}
                          width={140}
                          className="rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots indicator skeleton */}
        <div className="flex items-center gap-3 mt-12">
          {Array.from({ length: calculateAvatarsCount() }).map((_, index) => {
            const isActive = index === Math.floor(calculateAvatarsCount() / 2);

            return (
              <SkeletonLoading
                key={index}
                height={isActive ? 12 : 12}
                width={isActive ? 48 : 12}
                className="rounded-full"
              />
            );
          })}
        </div>

        {/* Keyboard hint skeleton */}
        <div className="mt-8 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <SkeletonLoading height={32} width={32} className="rounded-lg" />
            <SkeletonLoading height={32} width={32} className="rounded-lg" />
            <SkeletonLoading height={16} width={40} className="rounded" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonLoading height={32} width={80} className="rounded-lg" />
            <SkeletonLoading height={16} width={40} className="rounded" />
          </div>
        </div>
      </div>

      {/* Bottom wave skeleton */}
      <div className="absolute bottom-0 left-0 w-full h-96 opacity-10">
        <SkeletonLoading height={384} width="100%" className="rounded-t-3xl" />
      </div>
    </div>
  );
};

export { WorkspaceSelectionLoading };
