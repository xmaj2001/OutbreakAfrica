export default function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={+i}
          className="relative p-4 rounded-sm bg-bento-card border border-bento-border animate-pulse"
        >
          <div className="absolute top-0 bottom-0 left-0 w-1 rounded-l-xl bg-bento-border" />
          <div className="space-y-3 pl-1">
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-bento-inner rounded" />
              <div className="h-4 w-20 bg-bento-inner rounded" />
            </div>
            <div className="h-4 w-full bg-bento-inner rounded" />
            <div className="h-4 w-3/4 bg-bento-inner rounded" />
            <div className="flex gap-3 pt-2 border-t border-bento-border">
              <div className="h-6 w-28 bg-bento-inner rounded" />
              <div className="h-6 w-20 bg-bento-inner rounded" />
              <div className="h-6 w-16 bg-bento-inner rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
