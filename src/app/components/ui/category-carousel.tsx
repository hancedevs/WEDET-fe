"use client"

import { useState, useEffect } from "react"
import { CategoryPill } from "./category-pill"
import { cn } from "@/lib/utils"

interface CategoryCarouselProps {
  categories: string[]
  autoScrollInterval?: number
  onCategoryChange?: (category: string) => void
  className?: string
}

export function CategoryCarousel({
  categories,
  autoScrollInterval = 3000,
  onCategoryChange,
  className,
}: CategoryCarouselProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "All")

  useEffect(() => {
    if (!autoScrollInterval) return

    const interval = setInterval(() => {
      setSelectedCategory((current) => {
        const currentIndex = categories.indexOf(current)
        const nextIndex = (currentIndex + 1) % categories.length
        const nextCategory = categories[nextIndex]
        onCategoryChange?.(nextCategory)
        return nextCategory
      })
    }, autoScrollInterval)

    return () => clearInterval(interval)
  }, [categories, autoScrollInterval, onCategoryChange])

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    onCategoryChange?.(category)
  }

  return (
    <div className={cn("flex space-x-3 scrollable-x hide-scrollbar pb-2", className)}>
      {categories.map((category) => (
        <CategoryPill
          key={category}
          category={category}
          isSelected={selectedCategory === category}
          onClick={() => handleCategoryClick(category)}
        />
      ))}
    </div>
  )
}