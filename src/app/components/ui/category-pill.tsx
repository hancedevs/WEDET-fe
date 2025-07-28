"use client"

import { cn } from "@/lib/utils"

interface CategoryPillProps {
  category: string
  isSelected: boolean
  onClick: () => void
  className?: string
}

export function CategoryPill({ category, isSelected, onClick, className }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
        isSelected
          ? "bg-green-500 text-white border border-green-500"
          : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50",
        className,
      )}
    >
      {category}
    </button>
  )
}