"use client";
import { useState } from "react";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import TourtripLayout from "@/app/components/Tourguidecomponents/TourtripLayout";
import Navbar from "@/app/components/Tourguidecomponents/TourGuideNavbar";
import StepController from "../../components/Tourguidecomponents/stepcontroller";
export default function Step2() {
  const [startDate] = useState<Date>();
  const [endDate] = useState<Date>();
  const [days, setDays] = useState([1, 2, 3]);
  const [selectedDay, setSelectedDay] = useState("day1");

  const [activities, setActivities] = useState([
    { activity: "", time: "" },
    { activity: "", time: "" },
  ]);

  const handleActivityChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], [field]: value };
    setActivities(updated);
  };
  const addActivity = () => {
    setActivities([...activities, { activity: "", time: "" }]);
  };

  const addDay = () => {
    const newDay = days.length + 1;
    setDays([...days, newDay]);
    setSelectedDay(`day${newDay}`);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-auto pb-20">
      <TourtripLayout progress={66} title="Trip Post">
        <div className="max-w-sm mx-auto p-2">
          <h2 className="text-sm font-semibold mb-3">Step 2</h2>
          <Label className="block text-black font-medium mb-2">Duration</Label>
          <div className="flex gap-4 mb-4">
            <div className="flex items-center relative">
              <Input
                readOnly
                value={startDate ? format(startDate, "dd/MM/yyyy") : ""}
                className="p-2 rounded-[35px] shadow border-none"
              />
              <CalendarIcon
                className="absolute right-3 text-green-500"
                size={16}
              />
            </div>
            <div className="flex items-center relative">
              <Input
                readOnly
                value={endDate ? format(endDate, "dd/MM/yyyy") : ""}
                className="px-2 rounded-[35px] shadow border-none"
              />
              <CalendarIcon
                className="absolute right-3 text-green-500"
                size={16}
              />
            </div>
          </div>

          <Label className="block text-black font-medium mb-2">
            Group Number
          </Label>
          <Input
            type="number"
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
                  {days.map((day) => (
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
            >
              <Plus className="text-white font-extrabold" size={20} />
            </Button>
          </div>

          <p className="text-sm mb-2">16/July/2025</p>
          <p className="mb-2">Meal Insulation</p>
          <div className="p-3 rounded-2xl shadow border-gray-300 mb-4">
            {[
              { label: "Breakfast", time: "7:00 Am" },
              { label: "Launch", time: "12:30 Am" },
              { label: "Dinner", time: "8:00 Pm" },
            ].map((meal, idx) => (
              <div
                key={idx}
                className="flex items-center px-4 justify-between mb-2"
              >
                <Checkbox defaultChecked />
                <span>{meal.label}</span>
                <span className="text-sm">{meal.time}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-6">
            <div className="relative flex flex-col items-center mr-8">
              <div
                className="absolute"
                style={{
                  width: "2px",
                  height: `${activities.length * 70}px`,
                  backgroundImage:
                    "linear-gradient(to bottom, #10B981 50%, transparent 50%)",
                  backgroundSize: "2px 12px",
                  backgroundRepeat: "repeat-y",
                }}
              ></div>

              {activities.map((_, idx) => (
                <div
                  key={idx}
                  className="relative z-10 w-6 h-6 bg-[#28B872] rounded-full border-2 border-[#28B872] mb-10 last:mb-0 flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-6">
              {activities.map((act, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Input
                    placeholder="Trip activity"
                    value={act.activity}
                    onChange={(e) =>
                      handleActivityChange(idx, "activity", e.target.value)
                    }
                    className="px-2 rounded-[35px] shadow border border-gray-300 placeholder:text-center"
                  />
                  <Input
                    type="time"
                    value={act.time}
                    onChange={(e) =>
                      handleActivityChange(idx, "time", e.target.value)
                    }
                    className=" rounded-[35px] border-none text-[#28B872]"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={addActivity}
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
      </TourtripLayout>
      <Navbar />
    </div>
  );
}
