"use client";
import NavBar from "@/app/components/ui/navBar";
import Header from "@/app/components/ui/Header";
import TopRecomanded from "@/app/components/ui/TopRecomanded";
import CategorySelector from "@/app/components/ui/catagory";
import TravelCard from "@/app/components/ui/travelcard";
function Page() {
  return (
    <div className="pb-28 ">
      <div className="">
        <div>
          <Header />
        </div>
      </div>
      <div className="">
        <TopRecomanded />
        
      </div>
      <div>
        <CategorySelector />
      </div>
      <div className="flex items-center ml-5 justify-between mb-1 ">
        <h2
          className="text-gray-500 text-xs "
          style={{
            fontFamily: "'Century Gothic', sans-serif",
            fontWeight: 500,
          }}
        >
          Tips for you
        </h2>
        <button
          className="text-gray-400 text-xs mr-4"
          style={{
            fontFamily: "'Century Gothic', sans-serif",
            fontWeight: 300,
          }}
        >
          See all
        </button>
      </div>
      <div className="p-2 grid  grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
        <TravelCard
          imageUrl="/tipsimage.png"
          placeName="Simien Mountains"
          location="Gondar, Ethiopia"
          tripDuration="2 day's trip"
          price="2,700"
          oldPrice="3,000"
          discountPercent={15}
          rating={4.3}
          reviews={800}
          agencyName="Simien Explore Tours"
        />
      </div>
      <div className="p-2 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
        <TravelCard
          imageUrl="/tipsimage.png"
          placeName="Simien Mountains"
          location="Gondar, Ethiopia"
          tripDuration="2 day's trip"
          price="2,700"
          oldPrice="3,000"
          discountPercent={15}
          rating={4.5}
          reviews={200}
          agencyName="Simien Explore Tours"
        />
      </div>
      <div className="p-2 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
        <TravelCard
          imageUrl="/tipsimage.png"
          placeName="Dafar Place"
          location="Afar, Ethiopia"
          tripDuration="2 day's trip"
          price="9,700"
          oldPrice="11,000"
          discountPercent={15}
          rating={4.8}
          reviews={400}
          agencyName="Dafar Explore Tours"
        />
      </div>
    <div><NavBar /></div>
    </div>
  );
}

export default Page;
