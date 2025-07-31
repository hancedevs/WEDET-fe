"use client";
import React, { useState } from "react";

function Detailfilter() {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = ["Overview", "Itinerary", "Included", "Prepare"];
  return (
    <div className="mt-6 py-2 rounded-[35px] bg-[#E9F4F4]">
      <div className="flex  border-gray-200 ">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-1 font-medium text-sm ${
              activeTab === tab
                ? "bg-[#28B872] text-white border rounded-[35px] border-[#28B872]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Detailfilter;
