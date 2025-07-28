"use client"

import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  variant?: "card" | "text" | "avatar" | "button"
}

export function LoadingSkeleton({ className, variant = "card" }: LoadingSkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200 rounded"

  const variants = {
    card: "h-48 w-full rounded-3xl",
    text: "h-4 w-3/4 rounded",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-24 rounded-full",
  }

  return <div className={cn(baseClasses, variants[variant], className)} />
}