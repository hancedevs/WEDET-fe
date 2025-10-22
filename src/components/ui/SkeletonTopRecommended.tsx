"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonTopRecommended() {
    return (
        <div className="w-full">
            <div className="flex gap-2 justify-between pt-4 px-4"></div>

            <div className="overflow-x-auto px-3">
                <div className="flex gap-2 pb-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="shrink-0 w-56">
                            <Skeleton className="h-36 w-full rounded-xl" />
                            <div className="mt-2 space-y-2">
                                <Skeleton className="h-3 w-4/5" />
                                <Skeleton className="h-3 w-2/5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
