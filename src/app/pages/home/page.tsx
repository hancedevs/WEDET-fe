"use client";
import NavBar from "@/components/ui/navBar";
import Header from "@/app/components/ui/Header";
import TopRecomanded from "@/app/components/ui/TopRecomanded";
import CategorySelector from "@/app/components/ui/catagory";
import TravelCard from "@/app/components/ui/travelcard";
function Page() {
  return (
    <div className="">
      <div className="">
        <div>
          <Header />
        </div>
      </div>
      <div className="">
        <TopRecomanded />
        <NavBar />
      </div>
      <div>
        <CategorySelector />
      </div>
      <div className="flex items-center ml-7 justify-between mb-3 ">
        <h2
          className="text-gray-500 text-base "
          style={{
            fontFamily: "'Century Gothic', sans-serif",
            fontWeight: 500,
          }}
        >
          Tips for you
        </h2>
        <button
          className="text-gray-400 text-sm mr-7"
          style={{
            fontFamily: "'Century Gothic', sans-serif",
            fontWeight: 300,
          }}
        >
          See all
        </button>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TravelCard
          imageUrl="/tipsimage.png"
          placeName="Simien Mountains"
          location="Gondar, Ethiopia"
          tripDuration="2 day's trip"
          price="2,700"
          oldPrice="3,000"
          discountPercent={15}
          rating={4.5}
          reviews={400}
          agencyName="Simien Explore Tours"
        />
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TravelCard
          imageUrl="/tipsimage.png"
          placeName="Simien Mountains"
          location="Gondar, Ethiopia"
          tripDuration="2 day's trip"
          price="2,700"
          oldPrice="3,000"
          discountPercent={15}
          rating={4.5}
          reviews={400}
          agencyName="Simien Explore Tours"
        />
      </div>
    </div>
  );
}

export default Page;
