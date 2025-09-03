"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonTripCard() {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-lg">
      <Skeleton className="h-60 w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
