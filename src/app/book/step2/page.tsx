"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import BookingStepLayout from "@/app/components/booking/BookingStepLayout";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/ui/navBar";
import { step2Schema } from "@/lib/validation";
import type { Step2FormData, TripSummaryData } from "@/app/types/type";

function PeopleIcon() {
  return (
    <svg
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#C1C1C1"
      strokeWidth={2}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

interface NumberStepperProps {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  min?: number;
  max?: number;
}
const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  setValue,
  min = 0,
  max = 10,
}) => (
  <div className="relative w-full">
    <div className="flex items-center w-full rounded-full bg-[#fafafa] shadow px-5 py-2 h-[48px]">
      <PeopleIcon />
      <span className="text-gray-400 flex-1 pl-2">Number of People*</span>
      <div className="flex items-center gap-0.5 ml-auto">
        <span className="text-gray-700 text-base font-semibold w-6 text-center">
          {value}
        </span>
        <div className="flex flex-col">
          <button
            type="button"
            className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 text-xs mb-0.5"
            style={{ fontSize: "10px", lineHeight: "12px", padding: 0 }}
            onClick={() => setValue((v) => Math.min(max, v + 1))}
            tabIndex={-1}
            aria-label="Increase"
          >
            <svg width="10" height="10" viewBox="0 0 20 20">
              <polyline
                points="5 12 10 7 15 12"
                fill="none"
                stroke="gray"
                strokeWidth="2"
              />
            </svg>
          </button>
          <button
            type="button"
            className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 text-xs mt-0.5"
            style={{ fontSize: "10px", lineHeight: "12px", padding: 0 }}
            onClick={() => setValue((v) => Math.max(min, v - 1))}
            disabled={value <= min}
            tabIndex={-1}
            aria-label="Decrease"
          >
            <svg width="10" height="10" viewBox="0 0 20 20">
              <polyline
                points="5 8 10 13 15 8"
                fill="none"
                stroke="gray"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const trip: TripSummaryData = {
  imageUrl: "/image2.jpg",
  title: "Rainforest Adventure",
  location: "Wenchi, Oromia",
  dateRange: "May 20–28, 2024",
  duration: "9 days",
  guide: "Abebe Balcha",
};

export default function Step2() {
  const router = useRouter();
  const [numPeople, setNumPeople] = useState<number>(0);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      numberOfPeople: "0",
      people: [],
      dietaryRestrictions: "",
      medicalConditions: "",
      specialRequests: "",
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "people",
  });

  useEffect(() => {
    setValue("numberOfPeople", String(numPeople));
    if (numPeople > 1) {
      if (fields.length < numPeople) {
        for (let i = fields.length; i < numPeople; i++) {
          append({ name: "", phone: "" });
        }
      } else if (fields.length > numPeople) {
        for (let i = fields.length; i > numPeople; i--) {
          remove(i - 1);
        }
      }
    } else {
      replace([]);
    }
    // eslint-disable-next-line
  }, [numPeople]);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        stepperRef.current &&
        !stepperRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setShowDropdown(numPeople > 1);
  }, [numPeople]);

  const onSubmit = (data: Step2FormData) => {
    router.push("/book/step3");
  };

  return (
    <BookingStepLayout
      step={2}
      trip={trip}
      onNext={handleSubmit(onSubmit)}
      onPrev={() => router.push("/book/step1")}
    >
      <form className="space-y-0" onSubmit={handleSubmit(onSubmit)}>
        <div
          className="bg-white rounded-2xl shadow-md border border-[#f0f0f0] px-5 py-5"
          style={{ fontFamily: "'Century Gothic', sans-serif" }}
        >
          <div className="mb-5">
            <span className="block text-xl font-bold text-black">
              Personal Information
            </span>
          </div>

          {/* Number of People Stepper */}
          <div className="mb-5 relative" ref={stepperRef}>
            <label
              className="block text-sm font-semibold mb-1 text-black"
              htmlFor="numberOfPeople"
            >
              Number of People*
            </label>
            <div
              tabIndex={0}
              onFocus={() => numPeople > 1 && setShowDropdown(true)}
              onClick={() => numPeople > 1 && setShowDropdown(true)}
              className="focus:outline-none"
            >
              <NumberStepper
                value={numPeople}
                setValue={setNumPeople}
                min={0}
                max={10}
              />
            </div>
            {errors.numberOfPeople && (
              <p className="text-red-500 text-xs mt-1">
                {errors.numberOfPeople.message}
              </p>
            )}

            {showDropdown && numPeople > 1 && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-[#f0f0f0] px-5 py-4 z-30 max-h-60 overflow-y-auto"
              >
                <span className="block text-sm font-bold text-[#28B872] mb-2">
                  Add details for each person:
                </span>
                {fields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 mb-3">
                    <Input
                      className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 flex-1"
                      placeholder={`Person ${idx + 1} Name`}
                      {...register(`people.${idx}.name` as const)}
                    />
                    <Input
                      className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 flex-1"
                      placeholder={`Person ${idx + 1} Phone`}
                      {...register(`people.${idx}.phone` as const)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dietary Restrictions */}
          <div className="mb-5">
            <label
              className="block text-sm font-semibold mb-1 text-black"
              htmlFor="dietaryRestrictions"
            >
              Dietary Restrictions
            </label>
            <Input
              id="dietaryRestrictions"
              className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
              placeholder="Vegetarian, allergies, etc."
              {...register("dietaryRestrictions")}
            />
          </div>

          <div className="mb-5">
            <label
              className="block text-sm font-semibold mb-1 text-black"
              htmlFor="medicalConditions"
            >
              Medical Conditions
            </label>
            <Input
              id="medicalConditions"
              className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
              placeholder="Medical condition"
              {...register("medicalConditions")}
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-1 text-black"
              htmlFor="specialRequests"
            >
              Special Requests
            </label>
            <Input
              id="specialRequests"
              className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
              placeholder="Accommodations"
              {...register("specialRequests")}
            />
          </div>
        </div>
      </form>
      <NavBar />
    </BookingStepLayout>
  );
}
