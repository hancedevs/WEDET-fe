"use client";
import Image from "next/image";
import { Heart, Star, MapPin, Calendar } from "lucide-react";
import { TravelCardProps } from "@/app/types/type";
export default function TravelCard({
  imageUrl,
  placeName,
  location,
  tripDuration,
  price,
  oldPrice,
  discountPercent,
  rating,
  reviews,
  agencyName,
}: TravelCardProps) {
  return (
    <div className="relative w-full max-w-sm sm:max-w-full md:max-w-full rounded-3xl overflow-hidden shadow-lg">
      {/* Image background */}
      <div className="relative w-full h-60">
        <Image src={imageUrl} alt={placeName} fill className="object-cover"/>

        {/* Heart icon */}
        <div className="absolute top-3 right-3 bg-white/60 rounded-full p-2">
          <Heart className="text-gray-700 w-4 h-4" />
        </div>

        {/* Bottom overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end">
          {/* Name, location, duration */}
          <div className="text-white space-y-1 mt-auto">
            <h3 className="text-lg font-bold">{placeName}</h3>
            <p className="text-sm flex items-center gap-1 text-gray-300">
              <MapPin className="w-4 h-4" /> {location}
            </p>
            <div className="flex items-center gap-1 text-gray-300">
              <Calendar className="w-4 h-4" />
              {tripDuration}
            </div>
          </div>

          {/* Bottom layout row */}
          <div className="flex items-end justify-between text-white">
            {/* Bordered circle badge + Agency name */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-green-400" />
              <p className="text-sm">{agencyName}</p>
            </div>

            {/* Rating & Review */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{rating}%</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-200 mt-1">
                <span>{reviews}</span>
                <div className="flex -space-x-2">
                  <Image
                    src="/fox.jpg"
                    alt="user1"
                    width={20}
                    height={20}
                    className="rounded-full border-2 border-white"
                  />
                  <Image
                    src="/image1.jpg"
                    alt="user2"
                    width={20}
                    height={20}
                    className="rounded-full border-2 border-white"
                  />
                </div>
              </div>
            </div>

            {/*  Discount + Price */}
            <div className="flex flex-col items-end">
              {discountPercent && (
                <div className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-2xl font-bold mb-1">
                  {discountPercent}% OFF
                </div>
              )}
              <div className="text-green-400 font-bold text-lg">{price}Br</div>
              {oldPrice && (
                <div className="line-through text-gray-400 text-sm">
                  {oldPrice}Br
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
