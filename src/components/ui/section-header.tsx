"use client"

import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  actionText?: string
  onActionClick?: () => void
  className?: string
}

export function SectionHeader({ title, actionText = "See all", onActionClick, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <button
        onClick={onActionClick}
        className="text-green-500 text-sm font-medium hover:text-green-600 transition-colors"
      >
        {actionText}
      </button>
    </div>
  )
}