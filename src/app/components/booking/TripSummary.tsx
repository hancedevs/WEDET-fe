import Image from "next/image";
import { MapPin, Calendar, Clock } from "lucide-react";
import { TripSummaryData } from "@/app/types/type";
export default function TripSummary({
  imageUrl,
  title,
  location,
  dateRange,
  duration,
  guide,
}: TripSummaryData) {
  return (
    <div className="bg-white rounded-3xl border border-[#e5e5e5] shadow-sm px-4 py-4 space-y-2">
      <h2
        className="font-semibold text-sm text-gray-900"
        style={{ fontFamily: "'Century Gothic', sans-serif" }}
      >
        Trip Summary
      </h2>
      <div className="flex items-start gap-4">
        <div className="min-w-[110px] h-[110px] relative rounded-2xl overflow-hidden border border-[#e5e5e5]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col justify-between text-sm space-y-0.5 py-0.5">
          <h3
            className="font-bold text-gray-900"
            style={{ fontFamily: "'Century Gothic', sans-serif" }}
          >
            {title}
          </h3>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-[#26cc73]" strokeWidth={2.5} />
            <span
              className="text-gray-600"
              style={{ fontFamily: "'Century Gothic', sans-serif" }}
            >
              {location}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-[#26cc73]" strokeWidth={2.5} />
            <span
              className="text-gray-600"
              style={{ fontFamily: "'Century Gothic', sans-serif" }}
            >
              {dateRange}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#26cc73]" strokeWidth={2.5} />
            <span
              className="text-gray-600"
              style={{ fontFamily: "'Century Gothic', sans-serif" }}
            >
              {duration}
            </span>
          </div>
          <span
            className="text-gray-600"
            style={{ fontFamily: "'Century Gothic', sans-serif", fontSize: 13 }}
          >
            Guide: {guide}
          </span>
        </div>
      </div>
    </div>
  );
}
