"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Bell, X, Plus, MapPin, Tag, Calendar } from "lucide-react";
import TourtripLayout from "@/app/components/Tourguidecomponents/TourtripLayout";
import Navbar from "@/app/components/Tourguidecomponents/TourGuideNavbar";

interface Item {
  id: number;
  text: string;
}

export default function TripPostStep3() {
  const [cardTab, setCardTab] = useState<"oneTime" | "scheduled">("oneTime");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [price, setPrice] = useState<number>(3000);
  const [discount, setDiscount] = useState<string>("15");
  const discountNumber = discount === "" ? 0 : Number(discount);
  const total = price - price * (discountNumber / 100);

  const [includeItems, setIncludeItems] = useState<Item[]>([
    { id: 1, text: "Expert naturalist guide and local guides" },
    { id: 2, text: "Expert naturalist guide and local guides" },
  ]);
  const [notIncludeItems, setNotIncludeItems] = useState<Item[]>([
    { id: 1, text: "Expert naturalist guide and local guides" },
    { id: 2, text: "Expert naturalist guide and local guides" },
  ]);
  const [equipmentItems, setEquipmentItems] = useState<Item[]>([
    { id: 1, text: "Expert naturalist guide and local guides" },
    { id: 2, text: "Expert naturalist guide and local guides" },
  ]);

  const [selectedOption, setSelectedOption] = useState<"save" | "schedule">(
    "save"
  );

  const handleAdd = (setter: React.Dispatch<React.SetStateAction<Item[]>>) => {
    setter((prev) => [...prev, { id: Date.now(), text: "" }]);
  };

  const handleDelete = (
    id: number,
    setter: React.Dispatch<React.SetStateAction<Item[]>>
  ) => {
    setter((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (
    id: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<Item[]>>
  ) => {
    setter((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: value } : item))
    );
  };

  const renderList = (
    title: string,
    items: Item[],
    setter: React.Dispatch<React.SetStateAction<Item[]>>
  ) => (
    <div className="mb-6">
      <h3 className="font-medium mb-2">{title}</h3>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between bg-gray-100 rounded-full px-3 py-1 mb-2"
        >
          <div className="flex items-center flex-1">
            <button
              onClick={() => handleDelete(item.id, setter)}
              className="mr-2 text-gray-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={item.text}
              placeholder="Type here..."
              onChange={(e) => handleEdit(item.id, e.target.value, setter)}
              className="bg-transparent outline-none flex-1 text-sm placeholder-gray-400"
            />
          </div>
        </div>
      ))}
      <button
        onClick={() => handleAdd(setter)}
        className="flex items-center text-gray-700 border border-gray-200 rounded-full px-4 py-1 hover:bg-gray-200"
      >
        <Plus className="w-4 h-4 mr-1" /> Add more
      </button>
    </div>
  );

  const renderCustomToggle = () => (
    <div className="flex flex-col gap-4 my-6">
      {[
        { value: "save", label: "Save Trip" },
        { value: "schedule", label: "Schedule Post" },
      ].map((opt) => (
        <label
          key={opt.value}
          className="flex items-center cursor-pointer select-none"
        >
          <span
            className={
              `relative flex items-center justify-center w-6 h-6 mr-3 rounded-full border-2 transition-colors duration-150 ` +
              (selectedOption === opt.value
                ? "border-[#28B872]"
                : "border-[#28B872]")
            }
          >
            {selectedOption === opt.value ? (
              <span className="block w-10 h-5 rounded-full bg-[#28B872] border-4 border-white"></span>
            ) : null}
          </span>
          <span className="font-bold text-black text-lg">{opt.label}</span>
          <input
            type="radio"
            name="trip-toggle"
            value={opt.value}
            checked={selectedOption === opt.value}
            onChange={() => setSelectedOption(opt.value as "save" | "schedule")}
            className="hidden"
          />
        </label>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex justify-center py-6">
        <div className="p-6 max-w-sm w-full bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h1 className="font-bold text-lg">Trip post</h1>
            <Bell className="w-5 h-5" />
          </div>

          <div className="w-full h-1 rounded-full mb-4">
            <div
              className="h-1 rounded-full w-full"
              style={{ backgroundColor: "#28B872" }}
            ></div>
          </div>

          <p className="text-sm mb-4">Step 3</p>
          <h2 className="mb-2">Pricing Information</h2>
          <label className="block text-sm mb-2">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-full px-4 py-2 text-center text-gray-500 shadow-lg"
          />

          <div className="flex flex-row items-end gap-x-8 mt-5">
            <div>
              <label className="block text-md mb-1">If Discount</label>
              <div className="relative">
                <input
                  type="number"
                  value={discount}
                  min={0}
                  max={100}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-25 border border-gray-200 rounded-full py-2 pr-4 text-center text-gray-500 shadow-lg"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  %
                </span>
              </div>
            </div>
            <div>
              <label className="block text-md mb-1">Total</label>
              <input
                type="number"
                value={total}
                readOnly
                className="w-25 border border-gray-200 rounded-full px-3 py-2 text-center text-gray-500 shadow-lg"
              />
            </div>
          </div>

          <div className="mt-8">
            {renderList("Include", includeItems, setIncludeItems)}
            {renderList("Not Include", notIncludeItems, setNotIncludeItems)}
            {renderList(
              "Essential Equipment",
              equipmentItems,
              setEquipmentItems
            )}
          </div>

          {renderCustomToggle()}

          {/* schedule button */}
          <div className="relative bg-white rounded-2xl shadow-md p-4 mb-15 w-full">
            <div className="flex items-center bg-[#F3F8F6] rounded-full w-full h-9 mx-auto -mt-6 mb-3 shadow-sm">
              <button
                className={`flex-1 h-8 rounded-full font-medium text-sm shadow  ${
                  cardTab === "oneTime"
                    ? "bg-[#28B872] text-white"
                    : "text-gray-400"
                }`}
                onClick={() => setCardTab("oneTime")}
              >
                One Time
              </button>
              <button
                className={`flex-1 h-8 rounded-full font-medium text-sm transition-all ${
                  cardTab === "scheduled"
                    ? "bg-[#28B872] text-white shadow"
                    : "text-gray-400"
                }`}
                onClick={() => setCardTab("scheduled")}
              >
                Scheduled
              </button>
            </div>
            {/* wenchi card */}
            <div className="relative bg-white rounded-2xl w-full shadow p-3 pt-3">
              <div className="flex flex-row gap-4 w-full items-center">
                <Image
                  src="/tipsimage.png"
                  alt="Wenchi"
                  width={120}
                  height={120}
                  className="w-35 h-55 object-cover rounded-4xl"
                  priority
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-90 relative">
                    <button
                      type="button"
                      onClick={() =>
                        dateInputRef.current?.showPicker &&
                        dateInputRef.current.showPicker()
                      }
                      className="absolute -top-3 p-2 bg-white rounded-full justify-end w-30 h-10 flex items-center shadow-lg justify-center z-10"
                    >
                      <Calendar className="w-6 h-6 text-[#28B872]" />
                    </button>
                    <input
                      ref={dateInputRef}
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="hidden"
                    />
                    <span className="mt-8 text-2xl font-bold mt-6">Wenchi</span>
                  </div>
                  <div className="flex flex-row flex-wrap gap-x-6 gap-y-2 items-center mt-2">
                    <div className="flex items-center text-gray-700 text-base">
                      <MapPin
                        className="w-7 h-7 mr-1"
                        style={{ color: "#28B872" }}
                      />
                      Wenchi, Oromia
                    </div>
                    <div className="flex items-center text-gray-700 text-base">
                      <Tag
                        className="w-5 h-5 mr-1"
                        style={{ color: "#28B872" }}
                      />
                      2,000 Br
                    </div>
                    <div className="flex items-center text-gray-700 text-base">
                      <Calendar
                        className="w-5 h-5 mr-1"
                        style={{ color: "#28B872" }}
                      />
                      2 day{"'"}s trip
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <div className="bg-[#28B872] rounded-full h-6 w-20 flex items-center justify-center text-white font-medium text-sm">
                      Save
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <TourtripLayout /> */}
      <Navbar active="explore" />
    </div>
  );
}
