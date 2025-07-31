'use client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3Schema } from "@/lib/validation";
import type { Step3FormData, TripSummaryData } from "@/app/types/type";
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

export default function Step3() {
  const router = useRouter();
  const {
  register,
  handleSubmit,
  setValue,
  formState: { errors },
} = useForm<Step3FormData>({
  resolver: zodResolver(step3Schema),
  defaultValues: {
    contactName: "",
    contactPhone: "",
    relationship: "",  
  },
});


  const onSubmit = (data: Step3FormData) => {
    console.log("Step 3 data", data);
    router.push("/book/step4");
  };

  return (
    <BookingStepLayout
      step={3}
      trip={trip}
      onNext={handleSubmit(onSubmit)}
      onPrev={() => router.push("/book/step2")}
    >
      <form className="space-y-0" onSubmit={handleSubmit(onSubmit)}>
        <div
          className="bg-white rounded-2xl shadow-md border border-[#f0f0f0] px-5 py-5"
          style={{ fontFamily: "'Century Gothic', sans-serif" }}
        >
          <div className="mb-1">
            <span className="block text-xl font-bold text-black">
              Emergency Contact
            </span>
            <span className="block text-xs font-medium text-gray-400 mt-0.5 mb-3">
              Required for safety purposes during your adventure
            </span>
          </div>

          <div className="mb-5">
            <label
              className="block text-sm font-semibold mb-1 text-black"
              htmlFor="contactName"
            >
              Full Name*
            </label>
            <Input
              id="contactName"
              className="rounded-full border-none bg-[#fafafa] shadow text-gray-400  font-medium  text-[15px]   font-medium px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
              placeholder="Emergency contact name"
              {...register("contactName")}
            />
            {errors.contactName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contactName.message}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label
              className="block text-sm font-semibold mb-1 text-black"
              htmlFor="contactPhone"
            >
              Phone number*
            </label>
            <Input
              id="contactPhone"
              className="rounded-full border-none bg-[#fafafa] shadow  text-gray-400  font-medium  text-[15px] px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
              placeholder="Emergency contact phone"
              {...register("contactPhone")}
            />
            {errors.contactPhone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contactPhone.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-1 text-black"
              htmlFor="relationship"
            >
              Relationship*
            </label>
            <Select onValueChange={(val) => setValue("relationship", val)}>
              <SelectTrigger
                id="relationship"
                className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 h-[48px] flex items-center w-full"
              >
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.relationship && (
              <p className="text-red-500 text-xs mt-1">
                {errors.relationship.message}
              </p>
            )}
          </div>
        </div>
      </form>
      <NavBar/>
    </BookingStepLayout>
    
  );
}
