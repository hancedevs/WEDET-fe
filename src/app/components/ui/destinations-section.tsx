"use client"
import { SectionHeader } from "./section-header"
import { DestinationCard } from "./destination-card"
interface Destination {
  id: string
  name: string
  location: string
  image: string
  rating?: number
  reviews?: string
  price?: string
  originalPrice?: string
  duration?: string
  agency?: string
  discount?: string
}

interface DestinationsSectionProps {
  title: string
  destinations: Destination[]
  variant?: "small" | "large"
  layout?: "horizontal" | "vertical"
  className?: string
}

export function DestinationsSection({
  title,
  destinations,
  variant = "large",
  layout = "vertical",
  className,
}: DestinationsSectionProps) {
  return (
    <div className={className}>
      <SectionHeader title={title} />

      {layout === "horizontal" ? (
        <div className="flex space-x-4 md:space-x-6 scrollable-x hide-scrollbar pb-2">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} variant={variant} />
          ))}
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} variant={variant} />
          ))}
        </div>
      )}
    </div>
  )
}