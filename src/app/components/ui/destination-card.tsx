"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Star, Calendar, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface DestinationCardProps {
  destination: {
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
  variant?: "small" | "large"
  className?: string
}

export function DestinationCard({ destination, variant = "small", className }: DestinationCardProps) {
  if (variant === "small") {
    return (
      <Card
        className={cn("flex-shrink-0 w-48 md:w-56 lg:w-64 overflow-hidden rounded-2xl shadow-sm border-0", className)}
      >
        <div className="relative">
          <Image
            src={destination.image || "/placeholder.svg"}
            alt={destination.name}
            width={256}
            height={160}
            className="w-full h-32 md:h-36 lg:h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 text-white space-y-1">
            <h3 className="font-semibold text-sm md:text-base">{destination.name}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs md:text-sm">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                <span>{destination.location}</span>
              </div>
              {destination.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="fill-yellow-400 text-yellow-400 w-3 h-3 md:w-4 md:h-4" />
                  <span className="font-medium text-xs md:text-sm">{destination.rating}</span>
                  {destination.reviews && <span className="text-xs md:text-sm">{destination.reviews}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("overflow-hidden rounded-3xl shadow-sm border-0 bg-gray-100", className)}>
      <div className="relative">
        <Image
          src={destination.image || "/placeholder.svg"}
          alt={destination.name}
          width={400}
          height={240}
          className="w-full h-48 md:h-56 lg:h-64 object-cover"
        />

        {/* Heart icon */}
        <div className="absolute top-4 md:top-6 right-4 md:right-6">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
        </div>

        {/* Discount badge */}
        {destination.discount && (
          <div className="absolute top-4 md:top-6 right-16 md:right-20">
            <div className="bg-red-500 text-white text-xs md:text-sm font-bold px-2 py-1 md:px-3 md:py-1.5 rounded">
              {destination.discount}
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 text-white space-y-3 md:space-y-4">
          {/* Place name and location */}
          <div>
            <h3 className="font-bold text-xl md:text-2xl lg:text-3xl mb-1">{destination.name}</h3>
            <div className="flex items-center space-x-1 text-sm md:text-base">
              <MapPin className="w-4 h-4 md:w-5 md:h-5" />
              <span>{destination.location}</span>
            </div>
          </div>

          {/* Rating, reviews, duration, and price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Duration */}
              {destination.duration && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">{destination.duration}</span>
                </div>
              )}

              {/* Rating and reviews */}
              {destination.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="fill-yellow-400 text-yellow-400 w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-medium text-sm md:text-base">{destination.rating}</span>
                  {destination.reviews && <span className="text-sm md:text-base">{destination.reviews}</span>}
                  <Avatar className="w-5 h-5 md:w-6 md:h-6 ml-1">
                    <AvatarImage src="/placeholder.svg?height=20&width=20&text=👤" />
                    <AvatarFallback className="text-xs bg-orange-500 text-white">👤</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>

            {/* Price */}
            {destination.price && (
              <div className="text-right">
                <div className="text-green-400 font-bold text-lg md:text-xl lg:text-2xl">{destination.price}</div>
                {destination.originalPrice && (
                  <div className="text-gray-300 text-sm md:text-base line-through">{destination.originalPrice}</div>
                )}
              </div>
            )}
          </div>

          {/* Agency */}
          {destination.agency && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm md:text-base">{destination.agency}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}