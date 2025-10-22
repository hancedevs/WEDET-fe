"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import TourtripLayout from "@/components/Tourguidecomponents/TourtripLayout";
import Navbar from "@/components/Tourguidecomponents/TourGuideNavbar";
import StepController from "../../../components/Tourguidecomponents/stepcontroller";
import { saveDraft } from "@/lib/tripDraftLocal";

// helper: YYYY-MM-DD
const toYMD = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")}`;

// Define types for our data structure
interface Activity {
    activity: string;
    time: string;
}

interface DayData {
    meals: {
        breakfast: boolean;
        lunch: boolean;
        dinner: boolean;
    };
    activities: Activity[];
}

export default function Step2() {
    const router = useRouter();

    // date values as ISO strings (for native <input type="date">)
    const [startISO, setStartISO] = useState<string>("");
    const [endISO, setEndISO] = useState<string>("");

    // derived Dates for display only
    const startDate = useMemo(
        () => (startISO ? new Date(startISO) : undefined),
        [startISO]
    );
    const endDate = useMemo(
        () => (endISO ? new Date(endISO) : undefined),
        [endISO]
    );

    const [days, setDays] = useState([1]);
    const [selectedDay, setSelectedDay] = useState("day1");
    const [groupNumber, setGroupNumber] = useState<string>("");

    // Initialize dayData with default values for each day
    const [dayData, setDayData] = useState<Record<string, DayData>>({
        day1: {
            meals: {
                breakfast: false,
                lunch: false,
                dinner: false,
            },
            activities: [
                { activity: "", time: "" },
                { activity: "", time: "" },
            ],
        },
    });

    // Update dayData when days change
    useEffect(() => {
        const newDayData = { ...dayData };
        days.forEach((day) => {
            const dayKey = `day${day}`;
            if (!newDayData[dayKey]) {
                newDayData[dayKey] = {
                    meals: {
                        breakfast: false,
                        lunch: false,
                        dinner: false,
                    },
                    activities: [
                        { activity: "", time: "" },
                        { activity: "", time: "" },
                    ],
                };
            }
        });
        setDayData(newDayData);
    }, [days]);

    const handleActivityChange = (
        day: string,
        index: number,
        field: "activity" | "time",
        value: string
    ) => {
        setDayData((prev) => {
            const updated = { ...prev };
            updated[day].activities[index] = {
                ...updated[day].activities[index],
                [field]: value,
            };
            return updated;
        });
    };

    const handleMealChange = (
        day: string,
        meal: "breakfast" | "lunch" | "dinner",
        checked: boolean
    ) => {
        setDayData((prev) => {
            const updated = { ...prev };
            updated[day].meals[meal] = checked;
            return updated;
        });
    };

    const addActivity = (day: string) => {
        setDayData((prev) => {
            const updated = { ...prev };
            updated[day].activities.push({ activity: "", time: "" });
            return updated;
        });
    };

    const addDay = () => {
        const newDay = days.length + 1;
        const newDayKey = `day${newDay}`;

        setDays((prev) => [...prev, newDay]);

        // Initialize the new day with default data
        setDayData((prev) => ({
            ...prev,
            [newDayKey]: {
                meals: {
                    breakfast: false,
                    lunch: false,
                    dinner: false,
                },
                activities: [
                    { activity: "", time: "" },
                    { activity: "", time: "" },
                ],
            },
        }));

        setSelectedDay(newDayKey);
    };

    // ensure end >= start
    useEffect(() => {
        if (startISO && endISO && new Date(endISO) < new Date(startISO)) {
            setEndISO(startISO);
        }
    }, [startISO, endISO]);

    // auto-save draft (no UI change)
    useEffect(() => {
        saveDraft("step2", {
            days,
            dayData,
            selectedDay,
            startDate: startISO || undefined,
            endDate: endISO || undefined,
            groupNumber: groupNumber || undefined,
        });
    }, [days, dayData, selectedDay, startISO, endISO, groupNumber]);

    // form submit -> navigate (keeps UI as-is)
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveDraft("step2", {
            days,
            dayData,
            selectedDay,
            startDate: startISO || undefined,
            endDate: endISO || undefined,
            groupNumber: groupNumber || undefined,
        });
        router.push("/Tourguide/Tourtrip3");
    };

    // Calculate the date for each day
    const getDayDate = (dayIndex: number) => {
        if (!startISO) return "—";
        const date = new Date(startISO);
        date.setDate(date.getDate() + dayIndex - 1);
        return format(date, "dd/MM/yyyy");
    };

    return (
        <div className="flex flex-col min-h-screen overflow-auto pb-20">
            <TourtripLayout progress={66} title="Trip Post">
                <form onSubmit={onSubmit}>
                    <div className="max-w-sm mx-auto p-2">
                        <h2 className="text-sm font-semibold mb-3">Step 2</h2>

                        <Label className="block text-black font-medium mb-2">
                            Duration
                        </Label>
                        <div className="flex gap-4 mb-4">
                            {/* Start date field (styled) + invisible native date input */}
                            <div className="flex items-center relative">
                                <Input
                                    readOnly
                                    value={
                                        startDate
                                            ? format(startDate, "dd/MM/yyyy")
                                            : ""
                                    }
                                    placeholder="Start"
                                    className="p-2 rounded-[35px] shadow border-none"
                                />
                                <CalendarIcon
                                    className="absolute right-3 text-green-500 pointer-events-none"
                                    size={16}
                                />
                                <input
                                    type="date"
                                    value={startISO}
                                    onChange={(e) =>
                                        setStartISO(e.target.value)
                                    }
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    aria-label="Pick start date"
                                />
                            </div>

                            {/* End date field (styled) + invisible native date input */}
                            <div className="flex items-center relative">
                                <Input
                                    readOnly
                                    value={
                                        endDate
                                            ? format(endDate, "dd/MM/yyyy")
                                            : ""
                                    }
                                    placeholder="End"
                                    className="px-2 rounded-[35px] shadow border-none"
                                />
                                <CalendarIcon
                                    className="absolute right-3 text-green-500 pointer-events-none"
                                    size={16}
                                />
                                <input
                                    type="date"
                                    value={endISO}
                                    min={startISO || undefined}
                                    onChange={(e) => setEndISO(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    aria-label="Pick end date"
                                />
                            </div>
                        </div>

                        <Label className="block text-black font-medium mb-2">
                            Group Number
                        </Label>
                        <Input
                            type="number"
                            value={groupNumber}
                            onChange={(e) => setGroupNumber(e.target.value)}
                            className="p-2 rounded-[35px] shadow border-none mb-4"
                        />

                        <Label className="block text-black font-medium mb-4">
                            Daily activities
                        </Label>
                        <div className="flex items-center mb-4">
                            <div className="overflow-x-auto scrollbar-hide">
                                <Tabs
                                    value={selectedDay}
                                    onValueChange={setSelectedDay}
                                    className="bg-[#E9F4F4] px-1 rounded-[35px] inline-flex"
                                >
                                    <TabsList className="gap-9 whitespace-nowrap px-2">
                                        {days.map((day, index) => (
                                            <TabsTrigger
                                                key={`day${day}`}
                                                value={`day${day}`}
                                                className="px-4 py-2"
                                            >
                                                Day {day}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </div>
                            <Button
                                size="icon"
                                className="ml-2 bg-[#28B872] hover:bg-green-600 rounded-full flex-shrink-0"
                                onClick={addDay}
                                type="button"
                            >
                                <Plus
                                    className="text-white font-extrabold"
                                    size={20}
                                />
                            </Button>
                        </div>

                        <p className="text-sm mb-2">
                            {getDayDate(
                                parseInt(selectedDay.replace("day", ""))
                            )}
                        </p>
                        <p className="mb-2">Meal Inclusion</p>

                        <div className="p-3 rounded-2xl shadow border-gray-300 mb-4">
                            {[
                                {
                                    label: "Breakfast",
                                    key: "breakfast",
                                    time: "7:00 Am",
                                },
                                {
                                    label: "Lunch",
                                    key: "lunch",
                                    time: "12:30 Pm",
                                },
                                {
                                    label: "Dinner",
                                    key: "dinner",
                                    time: "8:00 Pm",
                                },
                            ].map((meal, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center px-4 justify-between mb-2"
                                >
                                    <Checkbox
                                        checked={
                                            dayData[selectedDay]?.meals[
                                                meal.key as
                                                    | "breakfast"
                                                    | "lunch"
                                                    | "dinner"
                                            ] || false
                                        }
                                        onCheckedChange={(checked) =>
                                            handleMealChange(
                                                selectedDay,
                                                meal.key as
                                                    | "breakfast"
                                                    | "lunch"
                                                    | "dinner",
                                                checked as boolean
                                            )
                                        }
                                    />
                                    <span>{meal.label}</span>
                                    <span className="text-sm">{meal.time}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center mt-6">
                            <div
                                className="relative flex flex-col items-center mr-8"
                                style={{}}
                            >
                                <div
                                    className="absolute"
                                    style={{
                                        width: "2px",
                                        height: `${
                                            (dayData[selectedDay]?.activities
                                                .length || 0) * 70
                                        }px`,
                                        backgroundImage:
                                            "linear-gradient(to bottom, #10B981 50%, transparent 50%)",
                                        backgroundSize: "2px 12px",
                                        backgroundRepeat: "repeat-y",
                                    }}
                                />
                                {(dayData[selectedDay]?.activities || []).map(
                                    (_, idx) => (
                                        <div
                                            key={idx}
                                            className="relative z-10 w-6 h-6 bg-[#28B872] rounded-full border-2 border-[#28B872] mb-10 last:mb-0 flex items-center justify-center"
                                        >
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    )
                                )}
                            </div>
                            <div className="flex flex-col gap-6">
                                {(dayData[selectedDay]?.activities || []).map(
                                    (act, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3"
                                        >
                                            <Input
                                                placeholder="Trip activity"
                                                value={act.activity}
                                                onChange={(e) =>
                                                    handleActivityChange(
                                                        selectedDay,
                                                        idx,
                                                        "activity",
                                                        e.target.value
                                                    )
                                                }
                                                className="px-2 rounded-[35px] shadow border border-gray-300 placeholder:text-center"
                                            />
                                            <Input
                                                type="time"
                                                value={act.time}
                                                onChange={(e) =>
                                                    handleActivityChange(
                                                        selectedDay,
                                                        idx,
                                                        "time",
                                                        e.target.value
                                                    )
                                                }
                                                className="rounded-[35px] border-none text-[#28B872]"
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                onClick={() => addActivity(selectedDay)}
                                type="button"
                                className="w-fit mt-5 bg-[#28B872] hover:bg-green-600 rounded-[35px]"
                            >
                                + Add more
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <StepController
                            prevHref="/Tourguide/Tourtrip1"
                            nextHref="/Tourguide/Tourtrip3"
                        />
                    </div>
                </form>
            </TourtripLayout>
            <Navbar />
        </div>
    );
}
