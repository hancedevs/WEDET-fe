"use client";
import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
    useCallback,
} from "react";
import { ListPlus, ListMinus, Pencil, Save } from "lucide-react";

// --- Types ---

interface TourData {
    id?: number;
    overview?: string;
    highlights?: string;
    includes?: string[];
    notIncludes?: string[];
    essentialEquipment?: string[];
    activities?: string; // Stored as JSON string
}

interface DetailfilterProps {
    tourData: TourData;
    isEditing: boolean;
    onUpdate: (field: keyof TourData, value: any) => void;
}

const TABS = ["Overview", "Itinerary", "Included", "Prepare"];

const Detailfilter = ({ tourData, isEditing, onUpdate }: DetailfilterProps) => {
    const [activeTab, setActiveTab] = useState("Overview");

    // Memoize the parsed activities for display
    const activitiesEntries = useMemo(() => {
        if (!tourData.activities) return null;
        try {
            const obj = JSON.parse(tourData.activities);
            return Object.entries(obj) as [string, any][];
        } catch (error) {
            console.error("Error parsing activities:", error);
            return null;
        }
    }, [tourData.activities]);

    // Use local state for editing text areas to prevent excessive re-renders during typing
    const [localEditText, setLocalEditText] = useState(() => ({
        overview: tourData.overview || "",
        highlights: tourData.highlights || "",
        includes: tourData.includes?.join("\n") || "",
        notIncludes: tourData.notIncludes?.join("\n") || "",
        essentialEquipment: tourData.essentialEquipment?.join("\n") || "",
        activities: tourData.activities || "",
    }));

    // Update local state when tourData or editing mode changes
    useEffect(() => {
        if (isEditing) {
            setLocalEditText({
                overview: tourData.overview || "",
                highlights: tourData.highlights || "",
                includes: tourData.includes?.join("\n") || "",
                notIncludes: tourData.notIncludes?.join("\n") || "",
                essentialEquipment:
                    tourData.essentialEquipment?.join("\n") || "",
                activities: tourData.activities || "",
            });
        }
    }, [isEditing, tourData]);

    // Handle input change and update parent state immediately if not editing, or local state if editing
    const handleInputChange = (field: keyof TourData, value: string) => {
        if (isEditing) {
            setLocalEditText((prev) => ({ ...prev, [field]: value }));
        }
    };

    // Memoize the save function for lists
    const saveListField = useCallback(
        (field: "includes" | "notIncludes" | "essentialEquipment") => {
            const lines = localEditText[field]
                ? localEditText[field]
                      .split("\n")
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0)
                : [];
            onUpdate(field, lines);
        },
        [localEditText, onUpdate]
    );

    // Timeline Calculation Hooks (from original code)
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const rowGapPx = 16;
    const dotOffsetPx = 8;
    const [connectorHeights, setConnectorHeights] = useState<number[]>([]);

    useEffect(() => {
        if (!activitiesEntries || activeTab !== "Itinerary") {
            setConnectorHeights([]);
            return;
        }

        // Use a slight delay or observation to ensure layout is stable
        const timer = setTimeout(() => {
            const heights: number[] = [];
            for (let i = 0; i < (activitiesEntries?.length || 0) - 1; i++) {
                const el = cardRefs.current[i];
                const h = el ? el.offsetHeight : 0;
                // Height = Card Height + Row Gap + Half Dot Offset (to connect center to center)
                const connector = Math.max(0, h + rowGapPx + dotOffsetPx);
                heights.push(connector);
            }
            setConnectorHeights(heights);
        }, 50); // Small delay to wait for layout engine

        return () => clearTimeout(timer);
    }, [activitiesEntries, activeTab, isEditing]); // Re-run when editing state changes

    // Helper for rendering editable content
    const renderEditableText = (
        field: keyof TourData,
        title: string,
        placeholder: string = "Enter text..."
    ) => {
        const textValue = localEditText[field] as string;

        if (isEditing) {
            // Textarea for multi-line content (Overview/Highlights)
            if (field === "overview" || field === "highlights") {
                return (
                    <div className="mt-6 px-2">
                        <label className="text-xl font-semibold text-black mb-2 block">
                            {title}
                        </label>
                        <textarea
                            value={textValue}
                            onChange={(e) =>
                                handleInputChange(field, e.target.value)
                            }
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 resize-y min-h-[150px] font-normal text-gray-700"
                            placeholder={placeholder}
                        />
                        {/* <button
                            onClick={() =>
                                onUpdate(field, localEditText[field])
                            }
                            className="mt-2 text-sm bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-colors flex items-center gap-1"
                            title="Save changes for this section"
                        >
                            <Save className="h-4 w-4" /> Save{" "}
                            {title.split(" ")[0]}
                        </button> */}
                    </div>
                );
            }
        }

        // Display Mode
        return (
            <div className="mt-6 px-2">
                <h2 className="text-xl font-semibold text-black mb-2">
                    {title}
                </h2>
                <div className="text-[#656464] mb-6 font-normal">
                    {/* Handles both plain text and lists (highlights) */}
                    {field === "overview" ? (
                        <p>{tourData.overview || `No ${field} available.`}</p>
                    ) : (
                        <ul className="space-y-2">
                            {(tourData[field] as string)
                                ?.split("\n")
                                .map((item, index) =>
                                    item.trim() ? (
                                        <li
                                            key={index}
                                            className="custom-li flex items-start"
                                        >
                                            {item.trim()}
                                        </li>
                                    ) : null
                                ) || <li>{`No ${field} available.`}</li>}
                        </ul>
                    )}
                </div>
            </div>
        );
    };

    const renderListEditor = (
        field: "includes" | "notIncludes" | "essentialEquipment",
        title: string,
        colorClass: string,
        icon: React.FC<any>
    ) => {
        const listValue = localEditText[field] as string;
        const IconComponent = icon;

        const listItems = (tourData[field] as string[]) || [];
        const isIncludedList = field === "includes";
        const borderColor = isIncludedList
            ? "border-green-500"
            : "border-red-400";
        const titleBg = isIncludedList ? "bg-[#28B872]" : "bg-red-500";

        if (isEditing) {
            return (
                <div className="relative space-y-6">
                    <label
                        className={`${titleBg} relative top-7 text-white w-fit px-8 py-1 rounded-3xl font-bold mb-2 block shadow-lg z-10`}
                    >
                        {title}
                    </label>
                    <div
                        className={`border ${borderColor} p-6 rounded-[26px] pt-10`}
                    >
                        <p className="text-sm text-gray-500 mb-2">
                            Enter each item on a new line.
                        </p>
                        <textarea
                            value={listValue}
                            onChange={(e) =>
                                handleInputChange(field, e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 resize-y min-h-[150px] font-normal text-gray-700"
                            placeholder="Item 1\nItem 2\nItem 3"
                        />
                        {/* <button
                            onClick={() => {
                                const lines = listValue
                                    .split("\n")
                                    .map((s) => s.trim())
                                    .filter((s) => s.length > 0);
                                onUpdate(field, lines);
                            }}
                            className="mt-3 text-sm bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-colors flex items-center gap-1"
                            title="Save changes for this list"
                        >
                            <Save className="h-4 w-4" /> Save List Changes
                        </button> */}
                    </div>
                </div>
            );
        }

        // Display Mode
        return (
            <div className="relative space-y-6">
                <p
                    className={`${titleBg} relative top-7 text-white w-fit px-8 py-1 rounded-3xl font-bold mb-2 shadow-lg z-10`}
                >
                    {title}
                </p>
                <div
                    className={`border ${borderColor} p-6 rounded-[26px] pt-10`}
                >
                    {listItems && listItems.length > 0 ? (
                        <ul className="space-y-3 text-base text-gray-700 font-normal">
                            {listItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3"
                                >
                                    <IconComponent
                                        className={`h-5 w-5 ${colorClass} shrink-0 mt-[2px]`}
                                    />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">
                            {`No ${title.toLowerCase()} specified for this tour.`}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Overview":
                return (
                    <div className="font-sans font-light">
                        {renderEditableText(
                            "overview",
                            "About this Adventure",
                            "A detailed description of the tour..."
                        )}
                        {renderEditableText("highlights", "Top Highlights")}
                    </div>
                );

            case "Itinerary":
                if (isEditing) {
                    return (
                        <div className="p-6 font-semibold">
                            <h2 className="text-xl font-bold text-black mb-2">
                                Edit Raw Itinerary (JSON)
                            </h2>
                            {/* <p className="text-sm text-red-500 mb-4 font-normal">
                                Warning: Editing this field requires valid JSON
                                structure. Changes are saved only when you click
                                "Save JSON".
                            </p> */}
                            <textarea
                                value={localEditText.activities}
                                onChange={(e) =>
                                    handleInputChange(
                                        "activities",
                                        e.target.value
                                    )
                                }
                                className="w-full p-4 border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500 resize-y min-h-[300px] font-mono text-xs"
                                placeholder="Enter valid JSON structure for activities..."
                            />
                            {/* <button
                                onClick={() =>
                                    onUpdate(
                                        "activities",
                                        localEditText.activities
                                    )
                                }
                                className="mt-3 text-sm bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-colors flex items-center gap-1"
                                title="Save JSON changes"
                            >
                                <Save className="h-4 w-4" /> Save Itinerary JSON
                            </button> */}
                        </div>
                    );
                }

                // Display Mode Itinerary
                return (
                    <div className="p-6 font-normal space-y-6">
                        {activitiesEntries && activitiesEntries.length > 0 ? (
                            activitiesEntries.map(
                                ([dayKey, dayInfo], index) => {
                                    const isLast =
                                        index === activitiesEntries.length - 1;
                                    const dayNumber = dayKey.replace("day", "");

                                    return (
                                        <div
                                            key={dayKey}
                                            className="flex gap-x-4 items-stretch"
                                            style={{ gap: `${rowGapPx}px` }}
                                        >
                                            {/* Timeline Column */}
                                            <div
                                                className="relative shrink-0 flex flex-col items-center pt-[2px]"
                                                style={{ width: 20 }}
                                            >
                                                <div className="w-4 h-4 bg-[#28B872] rounded-full z-10 shadow-md">
                                                    <span className="absolute top-[6px] left-[6px] h-2 w-2 rounded-full bg-white transform"></span>
                                                </div>
                                                {!isLast && (
                                                    <div
                                                        className="absolute left-[9px] top-[20px] border-l-2 border-dotted border-gray-300"
                                                        style={{
                                                            height: `${
                                                                connectorHeights[
                                                                    index
                                                                ] ?? 0
                                                            }px`,
                                                        }}
                                                    />
                                                )}
                                            </div>

                                            {/* Content Column */}
                                            <div
                                                className="grid w-full mb-4"
                                                ref={(el) => {
                                                    cardRefs.current[index] =
                                                        el;
                                                }}
                                            >
                                                <div className="bg-white shadow-xl p-6 rounded-xl border border-gray-100 w-full transform transition-all hover:shadow-2xl">
                                                    <p className="text-base font-bold text-[#28B872] mb-3">
                                                        DAY {dayNumber}
                                                    </p>

                                                    {dayInfo?.meals && (
                                                        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium">
                                                            {dayInfo.meals
                                                                .breakfast && (
                                                                <span className="text-green-600 flex items-center gap-1">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="14"
                                                                        height="14"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    >
                                                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                                        <path d="M12 11h.01" />
                                                                        <path d="M12 16h.01" />
                                                                        <path d="M12 21h.01" />
                                                                    </svg>
                                                                    Breakfast
                                                                </span>
                                                            )}
                                                            {dayInfo.meals
                                                                .lunch && (
                                                                <span className="text-green-600 flex items-center gap-1">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="14"
                                                                        height="14"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    >
                                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                                        <path d="M7 15V8a5 5 0 1 1 10 0v7" />
                                                                    </svg>
                                                                    Lunch
                                                                </span>
                                                            )}
                                                            {dayInfo.meals
                                                                .dinner && (
                                                                <span className="text-green-600 flex items-center gap-1">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="14"
                                                                        height="14"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    >
                                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                                        <path d="M14 2v6h6" />
                                                                    </svg>
                                                                    Dinner
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {dayInfo?.activities &&
                                                    dayInfo.activities.length >
                                                        0 ? (
                                                        <ul className="space-y-2 text-gray-700">
                                                            {dayInfo.activities.map(
                                                                (
                                                                    activity: any,
                                                                    activityIndex: number
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            activityIndex
                                                                        }
                                                                        className="flex items-start text-sm"
                                                                    >
                                                                        <span className="mr-2 text-[#28B872] font-bold shrink-0">
                                                                            {activity.time
                                                                                ? `${activity.time}`
                                                                                : "•"}
                                                                        </span>
                                                                        <span className="flex-1">
                                                                            {
                                                                                activity.activity
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-gray-500 text-sm">
                                                            No scheduled
                                                            activities for this
                                                            day.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        ) : (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                {tourData.activities ? (
                                    <p>
                                        Error loading itinerary. Please check
                                        the JSON format in the **Edit Mode**.
                                    </p>
                                ) : (
                                    <p>No itinerary available for this tour.</p>
                                )}
                            </div>
                        )}
                    </div>
                );

            case "Included":
                return (
                    <div className="px-2 sm:px-0 pt-4">
                        {renderListEditor(
                            "includes",
                            "What's Included",
                            "text-green-500",
                            ListPlus
                        )}
                        {renderListEditor(
                            "notIncludes",
                            "Not Included",
                            "text-red-500",
                            ListMinus
                        )}
                    </div>
                );

            case "Prepare":
                return (
                    <div className="px-2 sm:px-0 pt-4 mb-10">
                        {renderListEditor(
                            "essentialEquipment",
                            "Essential Equipment",
                            "text-green-500",
                            Pencil
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-6">
            <style jsx global>{`
                /* Custom styles for better aesthetics */
                .custom-li {
                    position: relative;
                    padding-left: 1.5rem;
                }
                .custom-li::before {
                    content: "•";
                    color: #28b872; /* Green dot for lists */
                    font-size: 1.2rem;
                    line-height: 1;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
            `}</style>

            <div className="flex w-full p-1 rounded-full bg-[#E9F4F4] shadow-inner mb-8">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 rounded-full font-bold text-sm sm:text-base whitespace-nowrap transition-all duration-300
                            ${
                                activeTab === tab
                                    ? "bg-[#28B872] text-white shadow-md shadow-[#28B87255] z-10 px-5 py-3 sm:px-5 sm:py-3"
                                    : "text-gray-600 hover:text-green-700 opacity-90 px-2 py-3 sm:px-3 sm:py-3"
                            }
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl min-h-[400px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default Detailfilter;
