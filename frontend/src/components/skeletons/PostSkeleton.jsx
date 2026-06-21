const PostSkeleton = () => {
  return (
    <div className="border border-[#1e2d3d] rounded-xl p-5 mb-4 bg-[#0f1923] animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full skeleton-shimmer flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 w-32 rounded-full skeleton-shimmer" />
          <div className="h-2.5 w-24 rounded-full skeleton-shimmer" />
        </div>
      </div>
      {/* Body */}
      <div className="space-y-2 pl-[52px] mb-4">
        <div className="h-3.5 w-full rounded-full skeleton-shimmer" />
        <div className="h-3.5 w-5/6 rounded-full skeleton-shimmer" />
        <div className="h-3.5 w-4/6 rounded-full skeleton-shimmer" />
      </div>
      {/* Action bar */}
      <div className="pl-[52px] pt-3 border-t border-[#1e2d3d] flex items-center gap-3">
        <div className="h-7 w-20 rounded-full skeleton-shimmer" />
        <div className="h-7 w-7 rounded-full skeleton-shimmer ml-auto" />
      </div>
    </div>
  );
};

export default PostSkeleton;
