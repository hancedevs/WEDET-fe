"use client";
import React, { useState } from "react";
const TABS = ["Overview", "Itinerary", "Included", "Prepare"];

const TabbedDetail = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div
            style={{
              fontFamily: "'Century Gothic', sans-serif",
              fontWeight: 300,
            }}
          >
            <div className="mt-6 px-2">
              <h2 className="text-xl font-semibold text-black mb-2">
                About this Adventure
              </h2>
              <p className="text-[#959494] mb-6">
                Immerse yourself in the worlds most biodiverse ecosystem on this
                comprehensive Amazon adventure. From the bustling river port of
                Iquitos, journey deep into pristine rainforest where pink
                dolphins play, colorful birds fill the canopy, and indigenous
                communities maintain ancient traditions. This expedition offers
                unparalleled wildlife encounters and cultural experiences.
              </p>
            </div>
            <div className="mt-6 px-2">
              <h2 className="text-xl font-semibold text-black mb-2">
                Top Highlights
              </h2>
              <div className="text-[#959494] mb-6">
                <ul className="list-disc px-4">
                  <li>Spot pink river dolphins and giant otters</li>
                  <li>Night walks to discover nocturnal wildlife</li>
                  <li>
                    Visit indigenous communities and learn traditional skills
                  </li>
                  <li>Canopy walks 40 meters above the forest floor</li>
                  <li>Piranha fishing and caiman spotting</li>
                  <li>Learn about medicinal plants from shamans</li>
                  <li>Navigate tributaries by traditional canoe</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "Itinerary":
        return (
          <div className="p-6 font-semibold space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex relative flex-col items-center">
                  <div className="w-4 h-4 bg-[#28B872] rounded-full relative">
                    <span className="absolute top-1/2 left-1/2 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white border border-white transform -translate-x-1/2 -translate-y-1/2"></span>
                  </div>
                  <div className="h-16 w-px bg-[#28B872]" />
                </div>
                <div className="grid">
                  <p className="font-semibold">8:30</p>
                  <p className="text-black">Jun 04/25</p>
                </div>
                <div className="bg-white shadow  p-9 rounded-[30px] w-full"></div>
              </div>
            ))}
          </div>
        );

      case "Included":
        return (
          <div className="relative p- space-y-6">
            <p className="bg-[#28B872] relative top-7 text-white border w-fit px-8 py-1 rounded-3xl font-semibold mb-2">
              What&apos;s Included
            </p>
            <div className="border border-green-500 p-6 marker:text-green-500 rounded-[35px]">
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-800">
                <li>Expert naturalist guide and local guides</li>
                <li>Eco-lodge accommodation in private rooms</li>
                <li>All meals and purified water</li>
                <li>All transportation including domestic flights</li>
                <li>Boat transfers and canoe excursions</li>
                <li>Rubber boots and rain ponchos</li>
                <li>All entrance fees and permits</li>
                <li>Cultural activities and demonstrations</li>
              </ul>
            </div>
            <p className="bg-red-500 relative top-7 text-white border w-fit px-10 py-1 rounded-3xl font-semibold mb-2">
              {" "}
              Not Included
            </p>
            <div className="border border-red-400 p-6 marker:text-red-500 rounded-[35px]">
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                <li>International flights to Lima</li>
                <li>Travel and medical insurance</li>
                <li>Alcoholic beverages</li>
                <li>Personal expenses and souvenirs</li>
                <li>Tips for guides and lodge staff</li>
                <li>Optional spa treatments at lodge</li>
              </ul>
            </div>
          </div>
        );

      case "Prepare":
        return (
          <div className="mb-5 ">
            <p className="bg-[#28B872] relative top-7 text-white border w-fit px-8 py-1 rounded-3xl font-semibold mb-2">
              Essential Equipment
            </p>
            <div className="border border-green-500 p-6  rounded-[35px]">
              <ul className="list-disc list-inside text-sm marker:text-green-500 space-y-1 text-gray-800">
                <li>Lightweight, quick-dry clothing</li>
                <li>Long-sleeved shirts and pants</li>
                <li>Rain jacket and pants</li>
                <li>Insect repellent (DEET-based)</li>
                <li>Waterproof bags for electronics</li>
                <li>Binoculars for wildlife-viewing</li>
                <li>Camera with extra batteries</li>
                <li>Personal medications</li>
                <li>Flashlight or headlamp</li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 sm:mt-10 px-2 sm:px-0">
      <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 border p-1 rounded-[35px] border-[#E9F4F4] bg-[#E9F4F4]">
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

      <div className="bg-white">{renderContent()}</div>
    </div>
  );
};

export default TabbedDetail;
