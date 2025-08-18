/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {Step2TripSchema , type Step2FormData } from "@/lib/tourguideschema";

type FormData = z.infer<typeof Step2TripSchema>;

export default function Step2() {
  const router = useRouter();
  const [startDate] = useState<Date | undefined>();
  const [endDate] = useState<Date | undefined>();
  const [days, setDays] = useState<number[]>([1, 2, 3]);
  const [selectedDay, setSelectedDay] = useState<string>("day1");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: zodResolver(Step2TripSchema),
    defaultValues: {
      groupNumber: "",
      activities: [
        { activity: "", time: "" },
        { activity: "", time: "" },
      ],
    },
    mode: "onSubmit",      
    reValidateMode: "onSubmit",
  });

  const { fields, append } = useFieldArray({ control, name: "activities" });

  const addActivity = () => append({ activity: "", time: "" });

  const addDay = () => {
    const newDay = days.length + 1;
    setDays((d) => [...d, newDay]);
    setSelectedDay(`day${newDay}`);
  };

  const onSubmit = (data: FormData) => {
    console.log("Valid data:", data);
    router.push("/Tourguide/Tourtrip3");
  };

  return (
    <div className="flex flex-col min-h-screen overflow-auto pb-20">
      <TourtripLayout progress={66} title="Trip Post">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto p-2" noValidate>
          <h2 className="text-sm font-semibold mb-3">Step 2</h2>
          <Label className="block text-black font-medium mb-2">Duration</Label>
          <div className="flex gap-4 mb-4">
            <div className="flex items-center relative">
              <Input
                readOnly
                value={startDate ? format(startDate, "dd/MM/yyyy") : ""}
                className="p-2 rounded-[35px] shadow border-none"
              />
              <CalendarIcon className="absolute right-3 text-green-500" size={16} />
            </div>
            <div className="flex items-center relative">
              <Input
                readOnly
                value={endDate ? format(endDate, "dd/MM/yyyy") : ""}
                className="px-2 rounded-[35px] shadow border-none"
              />
              <CalendarIcon className="absolute right-3 text-green-500" size={16} />
            </div>
          </div>
          <Label className="block text-black font-medium mb-2">Group Number</Label>
          <Input
            type="text"
            inputMode="numeric"
            className="p-2 rounded-[35px] shadow border-none mb-1"
            {...register("groupNumber")}
          />
          {errors.groupNumber && (
            <p className="text-red-500 text-sm mb-3">{errors.groupNumber.message}</p>
          )}

          <Label className="block text-black font-medium mb-4">Daily activities</Label>
          <div className="flex items-center mb-4">
            <div className="overflow-x-auto scrollbar-hide">
              <Tabs
                value={selectedDay}
                onValueChange={setSelectedDay}
                className="bg-[#E9F4F4] px-1 rounded-[35px] inline-flex"
              >
                <TabsList className="gap-9 whitespace-nowrap px-2">
                  {days.map((day) => (
                    <TabsTrigger key={`day${day}`} value={`day${day}`} className="px-4 py-2">
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
              <Plus className="text-white font-extrabold" size={20} />
            </Button>
          </div>
          <p className="text-sm mb-2">16/July/2025</p>
          <p className="mb-2">Meal Inclusion</p>
          <div className="p-3 rounded-2xl shadow border-gray-300 mb-4">
            {[
              { label: "Breakfast", time: "7:00 AM" },
              { label: "Lunch", time: "12:30 PM" },
              { label: "Dinner", time: "8:00 PM" },
            ].map((meal, idx) => (
              <div key={idx} className="flex items-center px-4 justify-between mb-2">
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
                  width: 2,
                  height: fields.length * 70,
                  backgroundImage:
                    "linear-gradient(to bottom, #10B981 50%, transparent 50%)",
                  backgroundSize: "2px 12px",
                  backgroundRepeat: "repeat-y",
                }}
              />
              {fields.map((_, idx) => (
                <div
                  key={idx}
                  className="relative z-10 w-6 h-6 bg-[#28B872] rounded-full border-2 border-[#28B872] mb-10 last:mb-0 flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              {fields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <Input
                      placeholder="Trip activity"
                      className="px-2 rounded-[35px] shadow border border-gray-300 placeholder:text-center"
                      {...register(`activities.${idx}.activity` as const)}
                    />
                    {errors.activities?.[idx]?.activity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.activities[idx]?.activity?.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Input
                      type="time"
                      className="rounded-[35px] border-none text-[#28B872]"
                      {...register(`activities.${idx}.time` as const)}
                    />
                    {errors.activities?.[idx]?.time && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.activities[idx]?.time?.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {"message" in (errors.activities ?? {}) && (
            <p className="text-red-500 text-sm mt-2">
              {(errors.activities as any).message}
            </p>
          )}

          <div className="flex justify-center">
            <Button
              onClick={addActivity}
              className="w-fit mt-5 bg-[#28B872] hover:bg-green-600 rounded-[35px]"
              type="button"
            >
              + Add more
            </Button>
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
