"use client";
import { useEffect, useState } from "react";
import PlaceNameCard from "@/app/components/ui/Card";
import { fetchToursForHome, type TravelCardVM } from "@/lib/toursRepo";

function TopRecommended() {
  const [cards, setCards] = useState<TravelCardVM[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetchToursForHome(8);
      if (mounted) setCards(res);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      className="w-full"
      style={{ fontFamily: "'Century Gothic' ,pt-8 sans-serif", fontWeight: 200 }}
    >
      <div className="flex gap-2 justify-between pt-4">
        <h2 className="text-sm text-[#959494]  font-light mb-4 px-4">Top Recommended</h2>
        <span className="pr-5 text-sm font-light  text-[#959494]">See all</span>
      </div>

      <div className="overflow-x-auto px-3">
        <div className="flex gap-2 pb-4  snap-mandatory  scroll-smooth">
          {cards.map((item) => (
            <div key={item.id} className="snap-start shrink-0">
              <PlaceNameCard
                image={item.imageUrl}
                name={item.placeName}
                location={item.location}
                percentage={item.discountPercent ?? 0} // using discount as "percentage"
                value={String(item.reviews)}          // placeholder reviews count
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default TopRecommended;
