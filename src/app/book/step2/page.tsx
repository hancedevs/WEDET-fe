'use client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema } from "@/lib/validation";
import type { Step2FormData, TripSummaryData } from "@/app/types/type";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import BookingStepLayout from "@/app/components/booking/BookingStepLayout";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/ui/navBar";

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
  });

  // Generate 1 to n for the select dropdown
  const peopleOptions = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

  const onSubmit = (data: Step2FormData) => {
    console.log("Step 2 data", data);
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
            <span className="block text-xl font-bold text-black" style={{ fontFamily: "'Century Gothic', sans-serif" }}>
              Personal Information
            </span>
          </div>

          {/* Number of People */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1 text-black" htmlFor="numberOfPeople">
              Number of People*
            </label>
            <Select onValueChange={(val) => setValue("numberOfPeople", val)}>
              <SelectTrigger
                className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 h-[48px] flex items-center w-full"
                id="numberOfPeople"
              >
                <SelectValue placeholder={
                  <span className="flex items-center gap-2 text-gray-400">
                    {/* User Group icon */}
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#C1C1C1" strokeWidth={2}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Number of People*
                  </span>
                } />
              </SelectTrigger>
              <SelectContent>
                {peopleOptions.map((num) => (
                  <SelectItem key={num} value={num}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.numberOfPeople && (
              <p className="text-red-500 text-xs mt-1">{errors.numberOfPeople.message}</p>
            )}
          </div>

          {/* Dietary Restrictions */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1 text-black" htmlFor="dietaryRestrictions">
              Dietary Restrictions
            </label>
            <Input
              id="dietaryRestrictions"
              className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
              placeholder="Vegetarian, allergies, etc."
              {...register("dietaryRestrictions" as const)}
            />
          </div>

          {/* Medical Conditions */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1 text-black" htmlFor="medicalConditions">
              Medical Conditions
            </label>
            <Input
              id="medicalConditions"
              className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
              placeholder="Medical condition"
              {...register("medicalConditions" as const)}
            />
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-black" htmlFor="specialRequests">
              Special Requests
            </label>
            <Input
              id="specialRequests"
              className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
              placeholder="Accommodations"
              {...register("specialRequests" as const)}
            />
          </div>
        </div>
      </form>
        <NavBar />
    </BookingStepLayout>
    
  );
}
