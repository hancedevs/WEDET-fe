"use client"

import { LoadingSkeleton } from "./loading-skeleton"
export function CategoriesSectionLoading() {
  return (
    <div>
      {/* Section Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <LoadingSkeleton variant="text" className="h-6 w-24" />
        <LoadingSkeleton variant="text" className="h-4 w-16" />
      </div>

      {/* Category Pills Skeleton */}
      <div className="flex space-x-3 pb-2">
        {Array.from({ length: 4 }, (_, index) => (
          <LoadingSkeleton key={index} variant="button" className="h-10 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>
    </div>
  )
}