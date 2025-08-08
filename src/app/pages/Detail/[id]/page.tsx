"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, Heart, Star, MapPin, BadgeCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ResortPage from "@/app/components/ui/Bilbord";
import TravelCard from "../../../components/ui/travelcard";
import Detailfilter from "@/app/components/ui/Detailfilter";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/ui/navBar";
const Images = ["/image1.jpg", "/image2.jpg", "/tipsimage.png"];

export default function TourPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const router = useRouter();
  const handeclick = () => {
    router.push("/pages/home");
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % Images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full mx-auto bg-white">
      <div className="relative h-[280px] sm:h-[350px] md:h-[400px] w-full overflow-hidden">
        {Images.map((img, index) => (
          <Image
            key={index}
            src={img}
            fill
            alt={`Tour image ${index + 1}`}
            className={`object-cover transition-opacity duration-700 ${
              currentImage === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <button className="p-2 bg-white/80 rounded-full hover:bg-white">
            <ChevronLeft
              size={20}
              className="text-green-500"
              onClick={handeclick}
            />
          </button>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button className="p-2 bg-white/80 rounded-full hover:bg-white">
            <Heart size={20} className="text-green-500" />
          </button>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {Images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentImage === index
                  ? "bg-green-500"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="relative z-20">
        <div className="bg-white relative mt-[-1.5rem] left-1/2 transform -translate-x-1/2 w-full max-w-4xl border rounded-t-[35px] p-4 sm:p-5">
          <div className="mb-4 mt-3">
            <h1 className="text-xl sm:text-2xl font-bold">Wenchi Park, Oromia</h1>
            <div className="flex flex-wrap items-center mt-1 gap-2">
              <div className="flex items-center">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="ml-1 text-sm font-medium">4.7</span>
              </div>
              <span className="text-[#959494] font-semibold text-sm">(158 reviews)</span>
              <span className="bg-green-100 font-semibold text-[#0A703E] border-1 border-[#00FF83] text-xs px-2 py-1 rounded-full">
                Moderate
              </span>
            </div>
            <div className="flex items-center mt-2 text-[#959494] font-light text-sm">
              <MapPin size={14} className="mr-1 text-[#28B872]" />
              <span>Location</span>
            </div>
            <div className="absolute top-7 right-5 rounded-lg p-1 sm:p-3 text-right z-10">
              <div className="bg-[#F00505] rounded-[35px] text-white px-2 py-1 font-bold text-xs sm:text-sm">
                Save 15%
              </div>
              <div className="text-green-600 font-bold text-lg sm:text-xl">2,700 Br</div>
              <div className="text-[#A6A6A6] text-xs sm:text-sm line-through mr-2 sm:mr-6">3,000 Br</div>
              <div className="text-[#A6A6A6] text-[10px] sm:text-xs mr-1 sm:mr-4">per person</div>
            </div>
          </div>
<<<<<<< HEAD
          <div className="w-full px-4 sm:px-6 lg:px-0">
            {/* Scrollable container on small screens */}
            <div className="overflow-x-auto">
              {/* Inner scrollable flex container */}
              <div className="flex gap-2 max-w-4xl pb-3 mx-auto sm:justify-center sm:flex-wrap sm:overflow-visible min-w-fit">
                {["Wildlife", "Jungle", "Culture", "Wildlife"].map((tag, i) => (
                  <span
                    key={i}
                    className="whitespace-nowrap border border-gray-300 text-black font-semibold rounded-full px-4 py-1 text-sm sm:text-base"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6 border border-gray-300 px-10 py-4 rounded-4xl grid grid-cols-3 gap-6">
            <div>
              <div className="text-xs text-gray-500">Duration</div>
              <div className="font-medium text-green-700">2 Days</div>
=======
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {["Wildlife", "Jungle", "Culture", "Wildlife"].map((tag, i) => (
                <span
                  key={i}
                  className="border border-[#E9F4F4] text-black font-semibold rounded-[35px] px-4 py-1 text-xs sm:text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-6 border border-[#E9F4F4] pl-8 sm:px-10 py-3 sm:py-5 rounded-[35px] flex justify-between sm:gap-0">
            <div className="min-w-[80px]">
              <div className="text-xs text-[#959494]">Duration</div>
              <div className="font-medium text-[#28B872]">2 Days</div>
>>>>>>> d29128d6458d399b59fbc39a0a1f812092ff6c09
            </div>
            <div className="min-w-[80px]">
              <div className="text-xs text-[#959494]">Group Size</div>
              <div className="font-medium text-[#28B872]">Max 10</div>
            </div>
            <div className="min-w-[80px]">
              <div className="text-xs text-[#959494]">Min Age</div>
              <div className="font-medium text-[#28B872]">14+</div>
            </div>
          </div>
<<<<<<< HEAD
          <div className="shadow-lg flex flex-col rounded-[35px] p-3">
            <div className="flex gap-2 justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-15 w-15 border-2 border-green-500">
=======
          <div className="shadow-xl bg-white flex flex-col rounded-[35px] p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:gap-2 sm:justify-between items-start sm:items-center mb-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Avatar className="h-12 w-12 sm:h-15 sm:w-15 border-2 border-green-500">
>>>>>>> d29128d6458d399b59fbc39a0a1f812092ff6c09
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="User Avatar"
                  />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
                <div className="flex-1 sm:flex-none">
                  <div className="flex gap-2 items-center">
                    <h3 className="font-bold text-sm sm:text-base">Abebe Balcha</h3>
                    <BadgeCheck strokeWidth={1.25} className="text-green-700 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm">18 years experience</p>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-start sm:items-center mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-normal">
                <span className="text-[#959494] font-semibold text-xs sm:text-sm">Your Expert Guide</span>
                <div className="flex items-center mb-0 sm:mb-3 mr-0 sm:mr-3">
                  <Star size={16} className="text-yellow-500" />
                  <span className="ml-1 text-sm font-medium">4.7</span>
                </div>
              </div>
            </div>
<<<<<<< HEAD

            <div className="pl-11">
              <p className="text-gray-400 px-6 mb-4">
                Carlos is a naturalist guide born in the Amazon basin. His
                encyclopedic knowledge of rainforest ecology combined with his
                ability to spot even the most elusive wildlife, makes him one of
                Perus most respected jungle guides.
              </p>
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-2 max-w-4xl pb-3 mx-auto sm:justify-center sm:flex-wrap sm:overflow-visible min-w-fit">
                {["Wildlife", "Jungle", "Culture", "Wildlife"].map((tag, i) => (
                  <span
                    key={i}
                    className="whitespace-nowrap border border-gray-300 text-black font-semibold rounded-full px-4 py-1 text-sm sm:text-base"
                  >
                    {tag}
                  </span>
                ))}
              </div>
=======
            <p className="text-[#959494] font-bold text-xs sm:text-sm px-2 sm:px-16 mb-4">
              Carlos is a naturalist guide born in the Amazon basin. His
              encyclopedic knowledge of rainforest ecology combined with his
              ability to spot even the most elusive wildlife, makes him one of
              Perus most respected jungle guides.
            </p>
            <div className="flex flex-wrap gap-1 px-1  sm:px-13">
              {["Wildlife", "Jungle", "Culture", "Wildlife"].map((tag, i) => (
                <span
                  key={i}
                  className="border border-[#E9F4F4] text-black font-semibold rounded-[35px] px-3 sm:px-3 py-1 text-xs sm:text-sm"
                >
                  {tag}
                </span>
              ))}
>>>>>>> d29128d6458d399b59fbc39a0a1f812092ff6c09
            </div>
          </div>
          <div className="w-full max-w-full overflow-hidden">
            <Detailfilter />
          </div>
          <ResortPage />
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
          <button
<<<<<<< HEAD
            className="w-full bg-[#28B872] hover:bg-[#28B880] text-white py-3 mt-10 mb-20 rounded-[35px] font-bold transition-colors"
=======
            className="w-full bg-[#28B872] hover:bg-[#28B880] text-white py-3 mt-6 sm:mt-10 mb-16 sm:mb-20 rounded-[35px] font-bold transition-colors text-sm sm:text-base"
>>>>>>> d29128d6458d399b59fbc39a0a1f812092ff6c09
            onClick={() => router.push("/book/step1")}
          >
            Book now!
          </button>
        </div>
        <NavBar />
      </div>
    </div>
  );
}