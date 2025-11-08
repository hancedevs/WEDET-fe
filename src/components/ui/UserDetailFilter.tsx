/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface TourData {
    id?: number;
    overview?: string;
    highlights?: string;
    includes?: string[];
    notIncludes?: string[];
    essentialEquipment?: string[];
    activities?: string;
}

interface DetailfilterProps {
    tourData?: TourData;
}

const TABS = ["Overview", "Itinerary", "Included", "Prepare"];

const Detailfilter = ({ tourData }: DetailfilterProps) => {
    const [activeTab, setActiveTab] = useState("Overview");

    const activitiesEntries = useMemo(() => {
        if (!tourData?.activities) return null;
        try {
            const obj = JSON.parse(tourData.activities);
            return Object.entries(obj) as [string, any][];
        } catch (error) {
            console.error("Error parsing activities:", error);
            return null;
        }
    }, [tourData?.activities]);

    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const rowGapPx = 16;
    const dotOffsetPx = 8;
    const [connectorHeights, setConnectorHeights] = useState<number[]>([]);

    useEffect(() => {
        if (!activitiesEntries || activeTab !== "Itinerary") {
            setConnectorHeights([]);
            return;
        }

        const rAF = requestAnimationFrame(() => {
            const heights: number[] = [];
            for (let i = 0; i < activitiesEntries.length; i++) {
                const el = cardRefs.current[i];
                const h = el ? el.offsetHeight : 0;
                const connector = Math.max(0, h + rowGapPx + dotOffsetPx);
                heights.push(connector);
            }
            setConnectorHeights(heights);
        });

        return () => cancelAnimationFrame(rAF);
    }, [activitiesEntries, activeTab]);

    const renderContent = () => {
        switch (activeTab) {
            case "Overview":
                return (
                    <div
                        style={{
                            fontFamily: "'Red Hat', sans-serif",
                            fontWeight: 300,
                        }}
                    >
                        <div className="mt-6 px-2">
                            <h2 className="text-xl font-semibold text-black mb-2">
                                About this Adventure
                            </h2>
                            <p className="text-[#959494] mb-6">
                                {tourData?.overview ||
                                    "No overview available for this tour."}
                            </p>
                        </div>

                        <div className="mt-6 px-2">
                            <h2 className="text-xl font-semibold text-black mb-2">
                                Top Highlights
                            </h2>
                            <div className="text-[#959494] mb-6">
                                {tourData?.highlights ? (
                                    <ul className="space-y-2">
                                        {tourData.highlights
                                            .split("\n")
                                            .map((highlight, index) =>
                                                highlight.trim() ? (
                                                    <li
                                                        key={index}
                                                        className="custom-li"
                                                    >
                                                        {highlight.trim()}
                                                    </li>
                                                ) : null
                                            )}
                                    </ul>
                                ) : (
                                    <p>
                                        No highlights available for this tour.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case "Itinerary":
                return (
                    <div className="p-6 font-semibold space-y-4">
                        {activitiesEntries && activitiesEntries.length > 0 ? (
                            activitiesEntries.map(
                                ([dayKey, dayInfo], index) => {
                                    const isLast =
                                        index === activitiesEntries.length - 1;

                                    return (
                                        <div
                                            key={dayKey}
                                            className="flex gap-x-2 items-start"
                                        >
                                            <div
                                                className="relative"
                                                style={{ width: 24 }}
                                            >
                                                {!isLast && (
                                                    <div
                                                        className="absolute left-[9px] top-[10px] border-l-2 border-dotted border-[#28B872]"
                                                        style={{
                                                            height: `${
                                                                connectorHeights[
                                                                    index
                                                                ] ?? 0
                                                            }px`,
                                                        }}
                                                    />
                                                )}

                                                <div className="absolute left-0 top-[2px] w-4 h-4 bg-[#28B872] rounded-full z-10">
                                                    <span className="absolute top-1/2 left-1/2 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white border border-white transform -translate-x-1/2 -translate-y-1/2"></span>
                                                </div>
                                            </div>

                                            <div className="grid mr-3">
                                                <p className="font-semibold leading-tight mb-0">
                                                    Day{" "}
                                                    {dayKey.replace("day", "")}
                                                </p>
                                            </div>

                                            <div
                                                ref={(el) => {
                                                    cardRefs.current[index] =
                                                        el;
                                                }}
                                                className="bg-white shadow p-6 rounded-[26px] w-full"
                                            >
                                                {dayInfo?.meals && (
                                                    <div className="mb-4">
                                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                                            Meals Included:
                                                        </h3>
                                                        <div className="flex gap-4 text-xs">
                                                            {dayInfo.meals
                                                                .breakfast && (
                                                                <span className="text-green-600">
                                                                    ✓ Breakfast
                                                                </span>
                                                            )}
                                                            {dayInfo.meals
                                                                .lunch && (
                                                                <span className="text-green-600">
                                                                    ✓ Lunch
                                                                </span>
                                                            )}
                                                            {dayInfo.meals
                                                                .dinner && (
                                                                <span className="text-green-600">
                                                                    ✓ Dinner
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {dayInfo?.activities &&
                                                dayInfo.activities.length >
                                                    0 ? (
                                                    <ul className="space-y-3">
                                                        {dayInfo.activities.map(
                                                            (
                                                                activity: any,
                                                                activityIndex: number
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        activityIndex
                                                                    }
                                                                    className="custom-li"
                                                                >
                                                                    <span className="text-gray-700">
                                                                        {activity.time &&
                                                                            `${activity.time} - `}
                                                                        {
                                                                            activity.activity
                                                                        }
                                                                    </span>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <p className="text-gray-500">
                                                        No activities scheduled
                                                        for this day.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No itinerary available for this tour.
                            </div>
                        )}
                    </div>
                );

            case "Included":
                return (
                    <div className="relative space-y-6 px-2 sm:px-0">
                        <p className="bg-[#28B872] relative top-7 text-white border w-fit px-8 py-1 rounded-3xl font-semibold mb-2">
                            What&apos;s Included
                        </p>
                        <div className="border border-green-500 p-6 rounded-[26px]">
                            {tourData?.includes &&
                            tourData.includes.length > 0 ? (
                                <ul className="space-y-2 text-sm text-gray-800">
                                    {tourData.includes.map((item, index) => (
                                        <li key={index} className="custom-li">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    No inclusions specified for this tour.
                                </p>
                            )}
                        </div>

                        <p className="bg-red-500 relative top-7 text-white border w-fit px-10 py-1 rounded-3xl font-semibold mb-2">
                            Not Included
                        </p>
                        <div className="border border-red-400 p-6 rounded-[26px]">
                            {tourData?.notIncludes &&
                            tourData.notIncludes.length > 0 ? (
                                <ul className="space-y-2 text-sm text-gray-700">
                                    {tourData.notIncludes.map((item, index) => (
                                        <li key={index} className="custom-li">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    No exclusions specified for this tour.
                                </p>
                            )}
                        </div>
                    </div>
                );

            case "Prepare":
                return (
                    <div className="mb-5 px-2 sm:px-0">
                        <p className="bg-[#28B872] relative top-7 text-white border w-fit px-8 py-1 rounded-3xl font-semibold mb-2">
                            Essential Equipment
                        </p>
                        <div className="border border-green-500 p-6 rounded-[26px]">
                            {tourData?.essentialEquipment &&
                            tourData.essentialEquipment.length > 0 ? (
                                <ul className="space-y-2 text-sm text-gray-800">
                                    {tourData.essentialEquipment.map(
                                        (item, index) => (
                                            <li
                                                key={index}
                                                className="custom-li"
                                            >
                                                {item}
                                            </li>
                                        )
                                    )}
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    No equipment list available for this tour.
                                </p>
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
                        className={`flex-1 rounded-3xl font-medium text-sm sm:text-base whitespace-nowrap transition-all duration-200
             ${
                 activeTab === tab
                     ? "bg-[#28B872] text-white shadow-lg z-10 px-5 py-3 sm:px-5 sm:py-3"
                     : "text-gray-600 hover:text-green-600 opacity-80 px-2 py-1 sm:px-3 sm:py-2"
             }
         `}
                        style={{
                            boxShadow:
                                activeTab === tab
                                    ? "0 2px 12px #28B87233"
                                    : undefined,
                            fontWeight: activeTab === tab ? 700 : 500,
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="bg-white px-2 sm:px-0">{renderContent()}</div>
        </div>
    );
};

export default Detailfilter;
