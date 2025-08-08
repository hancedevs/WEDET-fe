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
      <div className="relative h-82 w-full overflow-hidden">
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
        <div className="absolute top-44 right-4 rounded-lg p-3 text-right z-10">
          <div className="bg-red-600 rounded-3xl text-white px-2 py-1 font-bold text-sm">
            Save 15%
          </div>
          <div className="text-green-600 font-bold text-xl">2,700 Br</div>
          <div className="text-red-500 text-sm line-through">3,000 Br</div>
          <div className="text-green-500 text-xs">per person</div>
        </div>
      </div>
      <div className="relative z-20">
        <div className="bg-white relative mt-[-28px] left-1/2 transform -translate-x-1/2 w-full max-w-4xl border rounded-t-[35px] p-5">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Wenchi Park, Oromia</h1>
            <div className="flex items-center mt-1 gap-2">
              <div className="flex items-center">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="ml-1 text-sm font-medium">4.7</span>
              </div>
              <span className="text-gray-500 text-sm">(158 reviews)</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Moderate
              </span>
            </div>
            <div className="flex items-center mt-2 text-gray-400 text-sm">
              <MapPin size={14} className="mr-1 text-green-500" />
              <span>Location</span>
            </div>
          </div>
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
            </div>
            <div>
              <div className="text-xs text-gray-500">Group Size</div>
              <div className="font-medium text-green-700">Max 10</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Min Age</div>
              <div className="font-medium text-green-700">14+</div>
            </div>
          </div>
          <div className="shadow-lg flex flex-col rounded-[35px] p-3">
            <div className="flex gap-2 justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-15 w-15 border-2 border-green-500">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="User Avatar"
                  />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex gap-2 items-center">
                    <h3 className="font-bold">Abebe Balcha</h3>
                    <BadgeCheck strokeWidth={1.25} className="text-green-700" />
                  </div>
                  <p className="text-gray-500 text-sm">18 years experience</p>
                </div>
              </div>
              <div className="flex items-center mb-3 mr-3">
                <Star size={16} className="text-yellow-500" />
                <span className="ml-1 text-sm font-medium">4.7</span>
              </div>
            </div>

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
            className="w-full bg-[#28B872] hover:bg-[#28B880] text-white py-3 mt-10 mb-20 rounded-[35px] font-bold transition-colors"
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
