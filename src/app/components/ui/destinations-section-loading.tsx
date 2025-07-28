"use client"

import { LoadingSkeleton } from "./loading-skeleton"

interface DestinationsSectionLoadingProps {
  variant?: "small" | "large"
  layout?: "horizontal" | "vertical"
  count?: number
}

export function DestinationsSectionLoading({
  variant = "large",
  layout = "vertical",
  count = 2,
}: DestinationsSectionLoadingProps) {
  return (
    <div>
      {/* Section Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <LoadingSkeleton variant="text" className="h-6 w-32" />
        <LoadingSkeleton variant="text" className="h-4 w-16" />
      </div>

      {layout === "horizontal" ? (
        <div className="flex space-x-4 overflow-hidden pb-2">
          {Array.from({ length: count }, (_, index) => (
            <div key={index} className="flex-shrink-0 w-48">
              <LoadingSkeleton variant="card" className="h-32 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from({ length: count }, (_, index) => (
            <LoadingSkeleton key={index} variant="card" className="h-48 w-full" />
          ))}
        </div>
      )}
    </div>
  )
}