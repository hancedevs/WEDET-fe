/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";

interface TourData {
  id?: number;
  overview?: string;
  highlights?: string;
  includes?: string[];
  notIncludes?: string[];
  essentialEquipment?: string[];
  activities?: string; // JSON string of day activities
}

interface DetailfilterProps {
  tourData?: TourData;
}

const TABS = ["Overview", "Itinerary", "Included", "Prepare"];

const TabbedDetail = ({ tourData }: DetailfilterProps) => {
  const [activeTab, setActiveTab] = useState("Overview");

  // Parse activities from JSON string if available
  const parseActivities = () => {
    if (!tourData?.activities) return null;
    
    try {
      return JSON.parse(tourData.activities);
    } catch (error) {
      console.error("Error parsing activities:", error);
      return null;
    }
  };

  const activitiesData = parseActivities();

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
                {tourData?.overview || "No overview available for this tour."}
              </p>
            </div>
            <div className="mt-6 px-2">
              <h2 className="text-xl font-semibold text-black mb-2">
                Top Highlights
              </h2>
              <div className="text-[#959494] mb-6">
                {tourData?.highlights ? (
                  <ul className="list-disc px-4">
                    {tourData.highlights.split('\n').map((highlight, index) => (
                      highlight.trim() && (
                        <li key={index}>{highlight.trim()}</li>
                      )
                    ))}
                  </ul>
                ) : (
                  <p>No highlights available for this tour.</p>
                )}
              </div>
            </div>
          </div>
        );
      case "Itinerary":
        return (
          <div className="p-6 font-semibold space-y-4">
            {activitiesData ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              Object.entries(activitiesData).map(([dayKey, dayInfo]: [string, any], index) => (
                <div key={dayKey} className="flex gap-x-2 items-start">
                  <div className="flex relative flex-col items-center h-[100px]">
                    {/* Dotted vertical connector */}
                    {index < Object.keys(activitiesData).length - 1 && (
                      <div
                        className="absolute top-0 border-l-2 border-dotted border-[#28B872]"
                        style={{
                          height: "calc(100% - -4rem)",
                        }}
                      />
                    )}

                    {/* Green circle */}
                    <div className="w-4 h-4 bg-[#28B872] rounded-full relative z-10">
                      <span className="absolute top-1/2 left-1/2 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white border border-white transform -translate-x-1/2 -translate-y-1/2"></span>
                    </div>
                  </div>

                  {/* Day Header */}
                  <div className="grid mr-3">
                    <p className="font-semibold leading-tight mb-0">Day {dayKey.replace('day', '')}</p>
                  </div>

                  {/* Card content */}
                  <div className="bg-white shadow p-6 rounded-[30px] w-full">
                    {/* Meal Information */}
                    {dayInfo.meals && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Meals Included:</h3>
                        <div className="flex gap-4 text-xs">
                          {dayInfo.meals.breakfast && <span className="text-green-600">✓ Breakfast</span>}
                          {dayInfo.meals.lunch && <span className="text-green-600">✓ Lunch</span>}
                          {dayInfo.meals.dinner && <span className="text-green-600">✓ Dinner</span>}
                        </div>
                      </div>
                    )}

                    {/* Activities List */}
                    {dayInfo.activities && dayInfo.activities.length > 0 ? (
                      <ul className="space-y-3 list-disc pl-3 text-gray-600">
                        {dayInfo.activities.map((activity: any, activityIndex: number) => (
                          <li key={activityIndex} className="text-[#28B872]">
                            <span className="text-gray-700">
                              {activity.time && `${activity.time} - `}
                              {activity.activity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No activities scheduled for this day.</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No itinerary available for this tour.
              </div>
            )}
          </div>
        );

      case "Included":
        return (
          <div className="relative p- space-y-6">
            <p className="bg-[#28B872] relative top-7 text-white border w-fit px-8 py-1 rounded-3xl font-semibold mb-2">
              What&apos;s Included
            </p>
            <div className="border border-green-500 p-6 marker:text-green-500 rounded-[35px]">
              {tourData?.includes && tourData.includes.length > 0 ? (
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-800">
                  {tourData.includes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No inclusions specified for this tour.</p>
              )}
            </div>
            <p className="bg-red-500 relative top-7 text-white border w-fit px-10 py-1 rounded-3xl font-semibold mb-2">
              Not Included
            </p>
            <div className="border border-red-400 p-6 marker:text-red-500 rounded-[35px]">
              {tourData?.notIncludes && tourData.notIncludes.length > 0 ? (
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                  {tourData.notIncludes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No exclusions specified for this tour.</p>
              )}
            </div>
          </div>
        );

      case "Prepare":
        return (
          <div className="mb-5 ">
            <p className="bg-[#28B872] relative top-7 text-white border w-fit px-8 py-1 rounded-3xl font-semibold mb-2">
              Essential Equipment
            </p>
            <div className="border border-green-500 p-6 rounded-[35px]">
              {tourData?.essentialEquipment && tourData.essentialEquipment.length > 0 ? (
                <ul className="list-disc list-inside text-sm marker:text-green-500 space-y-1 text-gray-800">
                  {tourData.essentialEquipment.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No equipment list available for this tour.</p>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 sm:mt-10 px-2 sm:px-0">
      <div className="flex w-full p-1 rounded-full bg-[#E9F4F4]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-1 sm:px-4 sm:py-2 rounded-3xl font-medium text-sm sm:text-base whitespace-nowrap ${
              activeTab === tab
                ? "bg-[#28B872] text-white"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="bg-white px-2 sm:px-0">{renderContent()}</div>
    </div>
  );
};

export default TabbedDetail;