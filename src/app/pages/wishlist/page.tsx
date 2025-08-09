"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/ui/navBar";
import { ArrowLeft, MapPin, Tag, Calendar } from "lucide-react";
import Image from "next/image";
import Img from "../../../../public/tipsimage.png";

const TabbedDetail = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const router = useRouter();
  const TABS = ["upcoming", "Confirming", "Wishlist"];

  const handeclick = () => {
    router.push("/pages/home");
  };

  // Sample trip data array (3 items)
  const trips = [
    {
      id: 1,
      title: "Wenchi",
      location: "Wenchi, Oromia",
      price: "2,000 Br",
      days: "2 days trip",
      image: Img,
    },
    {
      id: 2,
      title: "Bahir Dar",
      location: "Bahir Dar, Amhara",
      price: "3,000 Br",
      days: "3 days trip",
      image: Img,
    },
  ];

  // TripCard component with props
  const TripCard = ({ trip }: { trip: (typeof trips)[0] }) => (
    <div
      key={trip.id}
      className="max-w-sm bg-white shadow-lg rounded-xl overflow-hidden flex mb-6"
    >
      <div className="flex flex-row p-3">
        <div className="w-40 h-50 rounded-xl relative overflow-hidden">
          <Image
            src={trip.image}
            alt={trip.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="p-4 flex flex-col justify-between flex-1">
          <h2 className="text-2xl font-bold">{trip.title}</h2>

          <div className="flex items-center gap-3 mt-3">
            <MapPin size={20} className="text-green-500" />
            <div className="flex flex-col">
              <p className="text-gray-500 text-xs leading-none">Location</p>
              <span className="text-black text-base leading-tight">
                {trip.location}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <Tag size={20} className="text-green-500" />
            <div className="flex flex-col">
              <p className="text-gray-500 text-xs leading-none">Price</p>
              <span className="text-black text-base leading-tight">
                {trip.price}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <Calendar size={20} className="text-green-500" />
            <div className="flex flex-col">
              <p className="text-gray-500 text-xs leading-none">Days</p>
              <span className="text-black text-base leading-tight">
                {trip.days}
              </span>
            </div>
          </div>

          {/* Button */}
          <button className="mt-6 bg-[#28B872] text-white px-4 py-1 rounded-full text-sm hover:bg-green-600 transition">
            Book Trip
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-10 sm:mt-10 px-2 sm:px-0 relative">
      {/* Back Button */}
      <BackButton />

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 mt-22 mb-4 sm:mb-6 border p-1 rounded-[35px] border-[#E9F4F4] bg-[#E9F4F4]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 sm:py-2 rounded-3xl font-medium text-sm sm:text-base ${
              activeTab === tab
                ? "bg-[#28B872] text-white"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Navbar */}
      <NavBar />

      {/* Render trip cards dynamically */}
      <div className="bg-white p-4 rounded-xl flex flex-col items-center">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
};

const BackButton = () => {
  const router = useRouter();
  const handeclick = () => {
    router.push("/pages/home");
  };

  return (
    <div className="fixed top-4 left-4 flex items-center gap-2 z-60">
      <button
        onClick={handeclick}
        className="w-10 h-10 flex items-center justify-center bg-[#D9D9D9] rounded-full hover:opacity-80 shadow-md"
      >
        <ArrowLeft size={20} className="text-green-500" />
      </button>
    </div>
  );
};

export default TabbedDetail;
