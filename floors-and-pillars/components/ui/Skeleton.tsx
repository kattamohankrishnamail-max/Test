/**
 * Skeleton loaders: flat tone blocks in the page's own proportions, shown while client-side
 * data loads. Pages themselves are server-rendered, so they never sit behind a skeleton
 * (a route-level loading state would hide content from visitors without JavaScript). They pulse in two steps (no shimmer) and hold still under reduced motion.
 */
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`skeleton block ${className}`} />;
}
