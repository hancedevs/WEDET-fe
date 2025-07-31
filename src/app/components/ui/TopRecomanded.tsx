import React from "react";
import PlaceNameCard from "@/app/components/ui/Card";

const topRecommendedData = [
  {
    id: "1",
    name: "Place name",
    location: "Location",
    rating: 4.5,
    reviews: "400",
    image: "/image1.jpg",
  },
  {
    id: "2",
    name: "Place name",
    location: "Location",
    rating: 4.5,
    reviews: "400",
    image: "/image2.jpg",
  },
  {
    id: "3",
    name: "Place name",
    location: "Location",
    rating: 4.5,
    reviews: "400",
    image: "/fox.jpg",
  },
];

function TopRecommended() {
  return (
    <div className="w-full p-2 " style={{ fontFamily: "'Century Gothic', ,pt-8 sans-serif",  fontWeight: 200 }}>
      <div className="flex gap-2 justify-between pt-4">
        <h2 className="text-lg  text-[#959494]  font-bold mb-4 px-2">
          Top Recommended
        </h2>
        <span className="pr-6 text-[#959494]">See all</span>
      </div>
      <div className="overflow-x-auto px-3">
        <div className="flex gap-4 pb-4 snap-x snap-mandatory overflow-x-auto scroll-smooth">
          {topRecommendedData.map((item) => (
            <div key={item.id} className="snap-start shrink-0">
              <PlaceNameCard
                image={item.image}
                name={item.name}
                location={item.location}
                percentage={item.rating}
                value={item.reviews}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopRecommended;
