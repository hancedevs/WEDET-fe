'use client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema } from "@/lib/validation";
import type { Step1FormData, TripSummaryData } from "@/app/types/type";
import { Input } from "@/components/ui/input";
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

export default function Step1() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
  });

  const onSubmit = (data: Step1FormData) => {
    console.log("Step1 Data", data);
    router.push("/book/step2");
  };

  return (
    <div>
      <BookingStepLayout step={1} trip={trip} onNext={handleSubmit(onSubmit)}>
        <form className="space-y-0" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl shadow-md border border-[#f0f0f0] px-5 py-5" style={{
            fontFamily: "'Century Gothic', sans-serif"
          }}>
            <div className="mb-3">
              <span className="block text-x font-bold text-black" style={{ fontFamily: "'Century Gothic', sans-serif" }}>
                Personal Information
              </span>
            </div>

            <div className="flex gap-3 mb-3">
              <div className="w-full">
                <label className="block text-sm font-semibold mb-1 text-black" htmlFor="firstName">
                  First Name*
                </label>
                <Input
                  id="firstName"
                 className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none" 
                  placeholder="John"
                  {...register("firstName")}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div className="w-full">
                <label className="block text-sm font-semibold mb-1 text-black" htmlFor="lastName">
                  Last Name*
                </label>
                <Input
                  id="lastName"
                  className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                  placeholder="Doe"
                  {...register("lastName")}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1 text-black" htmlFor="email">
                Email Address*
              </label>
              <Input
                id="email"
                className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                placeholder="John.doe@example.com"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1 text-black" htmlFor="phone">
                Phone Number*
              </label>
              <Input
                id="phone"
                className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                placeholder="+251"
                {...register("phone")}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div className="flex gap-3">
              <div className="w-full">
                <label className="block text-sm font-semibold mb-1 text-black" htmlFor="dateOfBirth">
                  Date of Birth
                </label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                  placeholder="27/07/2025"
                  {...register("dateOfBirth")}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
              </div>
              <div className="w-full">
                <label className="block text-sm font-semibold mb-1 text-black" htmlFor="nationality">
                  Nationality
                </label>
                <Input
                  id="nationality"
                  className="rounded-full border-none bg-[#fafafa] shadow text-base px-5 py-2 focus:ring-2 focus:ring-[#26cc73] focus:border-none"
                  placeholder="United States"
                  {...register("nationality")}
                />
                {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>}
              </div>
            </div>
          </div>
        </form>
      </BookingStepLayout>
      <NavBar />
    </div>
  );
}
