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
  {
    id: "4",
    name: "Place name",
    location: "Location",
    rating: 4.5,
    reviews: "400",
    image: "/fox.jpg",
  },
];

function TopRecommended() {
  return (
    <div className="w-full  " style={{ fontFamily: "'Century Gothic' ,pt-8 sans-serif",  fontWeight: 200 }}>
      <div className="flex gap-2 justify-between pt-4">
        <h2 className="text-sm text-[#959494]  font-light mb-4 px-4">
          Top Recommended
        </h2>
        <span className="pr-5 text-sm font-light  text-[#959494]">See all</span>
      </div>
      <div className="overflow-x-auto px-3">
        <div className="flex gap-2 pb-4  snap-mandatory  scroll-smooth">
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
