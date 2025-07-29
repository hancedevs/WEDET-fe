import React from "react";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";
interface PlaceNameCardProps {
  image: string;
  name: string;
  location: string;
  percentage: string | number;
  value: string | number;
}

const PlaceNameCard: React.FC<PlaceNameCardProps> = ({
  image,
  name,
  location,
  percentage,
  value,
}) => {
  return (
    <div className="relative w-[244px] h-[231px] rounded-xl overflow-hidden shadow-md">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover"
        quality={80}
      />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-green-700/70 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-full z-20 px-3 pb-3 text-white">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-lg font-semibold">{name}</h1>
          <div className="flex items-center gap-1">
            <Star size={16} strokeWidth={1.2} className="text-yellow-400" />
            <span className="text-sm">{percentage}%</span>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <h3>{location}</h3>
          </div>
          <span className="bg-white text-green-700 rounded-full px-2 py-0.5 text-xs font-medium">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlaceNameCard;
