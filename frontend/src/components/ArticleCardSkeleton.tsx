export default function ArticleCardSkeleton() {
  return (
    <div className="py-6 border-b border-border flex gap-6">
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <div className="skeleton w-5 h-5 rounded-full" />
          <div className="skeleton w-24 h-3" />
        </div>
        <div className="skeleton w-3/4 h-5" />
        <div className="skeleton w-full h-3" />
        <div className="skeleton w-1/2 h-3" />
        <div className="flex gap-3">
          <div className="skeleton w-12 h-3" />
          <div className="skeleton w-10 h-3" />
        </div>
      </div>
      <div className="skeleton w-24 h-20 md:w-32 md:h-24 rounded-sm flex-shrink-0" />
    </div>
  );
}
