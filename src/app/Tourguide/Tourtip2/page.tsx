// app/step2/page.tsx
"use client";

import { useState } from "react";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Step2() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  return (
    <div className="max-w-sm mx-auto  p-4">
      <h2 className="text-sm font-semibold mb-3">Step 2</h2>

      <Label className="block text-black font-medium mb-2">Duration</Label>
      <div className="flex gap-4 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center  relative ">
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
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center relative  ">
              <Input
                readOnly
                value={endDate ? format(endDate, "dd/MM/yyyy") : ""}
                className="px-2 rounded-[35px] shadow border-none"
              />
              <CalendarIcon
                className="absolute right-3  text-green-500"
                size={16}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
          </PopoverContent>
        </Popover>
      </div>

      <Label className="block text-black font-medium mb-2">Group Number</Label>
      <Select>
        <SelectTrigger className="mb-4 w-full rounded-[35px] border-none shadow">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="text-green-500">
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
        </SelectContent>
      </Select>

      <Label className="block text-black font-medium mb-4">
        Daily activities
      </Label>
      <div className="flex  items-center mb-4">
        <Tabs
          defaultValue="day1"
          className=" bg-[#E9F4F4]  px-1 rounded-[35px]"
        >
          <TabsList className=" gap-9">
            <TabsTrigger value="day1" className="">
              Day 1
            </TabsTrigger>
            <TabsTrigger value="day2">Day 2</TabsTrigger>
            <TabsTrigger value="day3">Day 3</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          size="icon"
          className="ml-2 bg-[#28B872] hover:bg-green-600 rounded-full"
        >
          <Plus className="text-white font-extrabold" size={5} />
        </Button>
      </div>

      <p className="text-sm mb-2">16/July/2025</p>
      <p className="mb-2">Meal Insulation</p>
      <div className=" p-3 rounded-2xl shadow border-gray-300 mb-4">
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
      <div className="flex items-center  mt-6">
        <div className="relative flex flex-col items-center mr-4">
          <div
            className="absolute h-full"
            style={{
              width: "2px",
              backgroundImage:
                "linear-gradient(to bottom, #10B981 50%, transparent 50%)",
              backgroundSize: "2px 16px",
              backgroundRepeat: "repeat-y",
            }}
          ></div>
          <div className="relative z-10 w-6 h-6 bg-[#28B872] rounded-full border-2 border-[#28B872] mb-10 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="relative z-10 w-6 h-6 bg-[#28B872] rounded-full border-2 border-[#28B872] flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-8 ">
            <Input
              placeholder="The first trip activite"
              className="py-2  rounded-[35px] text-center w-fit shadow border-none"
            />
            <span className=" text-black"> 7:45 Am</span>
          </div>
          <div className="flex items-center gap-8 ">
            <Input
              placeholder="The first trip activite"
              className="py-2 rounded-[35px] text-center w-fit shadow border-none"
            />
            <span className=" text-black"> 7:45 Am</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <Button className="w-fit mt-5 bg-[#28B872] hover:bg-green-600 rounded-[35px]">
          + Add more
        </Button>
      </div>
    </div>
  );
}
