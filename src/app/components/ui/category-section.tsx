"use client"

import { useState } from "react"
import { SectionHeader } from "./section-header"
import { CategoryCarousel } from "./category-carousel"
interface CategoriesSectionProps {
  categories?: string[]
  autoScrollInterval?: number
  onCategoryChange?: (category: string) => void
  className?: string
}

export function CategoriesSection({
  categories = ["All", "Hiking", "Nature", "Adventure"],
  autoScrollInterval = 4000,
  onCategoryChange,
  className,
}: CategoriesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "All")

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    onCategoryChange?.(category)
  }

  return (
    <div className={className}>
      <SectionHeader title="Categories" />
      <CategoryCarousel
        categories={categories}
        autoScrollInterval={autoScrollInterval}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  )
}