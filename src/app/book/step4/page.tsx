"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step4Schema } from "@/lib/validation";
import type { Step4FormData, TripSummaryData } from "@/app/types/type";
import BookingStepLayout from "@/app/components/booking/BookingStepLayout";
import { Checkbox } from "@/components/ui/checkbox";
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
// Using a mock data for now
const price = {
  perPerson: 2700,
  people: 1,
  serviceFee: 100,
  processingFee: 25,
};
const total =
  price.perPerson * price.people + price.serviceFee + price.processingFee;

export default function Step4() {
  const router = useRouter();
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      agreed: false,
    },
  });

  const onSubmit = (data: Step4FormData) => {
    console.log("Final step data", data);
    router.push("/book/step5");
  };

  return (
    <BookingStepLayout
      step={4}
      trip={trip}
      onNext={handleSubmit(onSubmit)}
      onPrev={() => router.push("/book/step3")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Price Breakdown Card */}
        <div
          className="bg-white rounded-3xl shadow-md border border-[#f0f0f0] px-5 py-5 mb-4"
          style={{ fontFamily: "'Century Gothic', sans-serif" }}
        >
          <div className="text-lg font-bold text-black mb-2">
            Price Breakdown
          </div>

          <div className="flex justify-between items-center mb-1 text-base">
            <span className="text-black">
              {price.perPerson.toLocaleString()} Br x {price.people} Person
            </span>
            <span className="text-black">.</span>
            <span className="text-black">
              {(price.perPerson * price.people).toLocaleString()}Br
            </span>
          </div>

          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="text-gray-400">Service fee</span>
            <span className="text-gray-400">{price.serviceFee}Br</span>
          </div>
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-gray-400">Processing fee</span>
            <span className="text-gray-400">{price.processingFee}Br</span>
          </div>

          <hr className="border-gray-400 my-2" />

          <div className="flex justify-between items-center mt-1">
            <span className="text-lg font-bold text-black">Total</span>
            <span className="text-lg font-bold text-[#26cc73]">
              {total.toLocaleString()}Br
            </span>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div
          className="mt-7 ml-3"
          style={{ fontFamily: "'Century Gothic', sans-serif" }}
        >
          <div className="text-xl font-bold text-black mb-1">
            Terms & Conditions
          </div>
          <div className="flex items-start gap-2 mt-2">
            <Checkbox
              id="agree"
              className="mt-1  border-2 border-[#26cc73] focus:ring-0 focus:ring-offset-0"
              onCheckedChange={(checked) => setValue("agreed", !!checked)}
            />
            <label
              htmlFor="agree"
              className="text-sm font-semibold text-gray-500 select-none"
            >
              <span className="font-semibold text-green">
                I agree to the Terms of Service and Privacy Policy.
              </span>{" "}
              <span className="font-normal text-gray-500">
                I understand the cancellation policy and acknowledge that this
                adventure involves physical activity and inherent risks.
              </span>
            </label>
          </div>
          {errors.agreed && (
            <p className="text-red-500 text-xs mt-1">{errors.agreed.message}</p>
          )}
        </div>
      </form>
      <NavBar />
    </BookingStepLayout>
  );
}
