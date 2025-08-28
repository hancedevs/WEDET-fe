"use client";
import { useEffect, useState } from "react";
import NavBar from "@/app/components/ui/navBar";
import Header from "@/app/components/ui/Header";
import TopRecommended from "@/app/components/ui/TopRecomanded";
import CategorySelector from "@/app/components/ui/catagory";
import TravelCard from "@/app/components/ui/travelcard";
import { fetchToursForHome, type TravelCardVM } from "@/lib/toursRepo";

function Page() {
  const [cards, setCards] = useState<TravelCardVM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetchToursForHome(12);
      if (mounted) {
        setCards(res);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="pb-28">
      <div>
        <Header />
      </div>

      <div>
        <TopRecommended />
      </div>

      <div>
        <CategorySelector />
      </div>

      <div className="flex items-center ml-5 justify-between mb-1 ">
        <h2
          className="text-gray-500 text-xs "
          style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 500 }}
        >
          Tips for you
        </h2>
        <button
          className="text-gray-400 text-xs mr-4"
          style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 300 }}
        >
          See all
        </button>
      </div>

      {/* List — identical visuals, but from DB */}
      {loading ? (
        <div className="p-2 text-xs text-gray-400">Loading…</div>
      ) : cards.length === 0 ? (
        <div className="p-2 text-xs text-gray-400">No trips yet.</div>
      ) : (
        cards.map((c) => (
          <div key={c.id} className="p-2 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
            <TravelCard
              imageUrl={c.imageUrl}
              placeName={c.placeName}
              location={c.location}
              tripDuration={c.tripDuration}
              price={c.price}
              oldPrice={c.oldPrice}
              discountPercent={c.discountPercent}
              rating={c.rating}
              reviews={c.reviews}
              agencyName={c.agencyName}
            />
          </div>
        ))
      )}

      <div>
        <NavBar />
      </div>
    </div>
  );
}

export default Page;
