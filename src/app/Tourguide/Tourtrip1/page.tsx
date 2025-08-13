"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TourtripLayout from "@/app/components/Tourguidecomponents/TourtripLayout";
import Navbar from "@/app/components/Tourguidecomponents/TourGuideNavbar";
import PhotoPicker from "@/app/components/Tourguidecomponents/photopicker";
import { step1Schema, type Step1FormData } from "@/lib/tourguideschema";
import { ChevronDown } from "lucide-react";
// filled arrow like your design
import { ArrowUturnRightIcon } from "@heroicons/react/20/solid";

export default function Step1Page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    defaultValues: {
      tourName: "",
      tourType: "",
      destination: "",
      photos: [],
      startingPoint: "",
      overview: "",
      highlights: "",
    },
  });

  const photos = watch("photos");
  const onPhotosChange = (arr: string[]) =>
    setValue("photos", arr, { shouldValidate: true, shouldDirty: true });

  const onSubmit = () => router.push("/trip-post/new/step-2");

  const pillInput =
    "mt-1 mb-1 w-full h-10 rounded-full border-2 border-[#ECECEC] bg-white px-4 " +
    "outline-none focus:ring-2 focus:ring-[#28B872]/30 " ;

  return (
    <div className="relative ">
      <TourtripLayout progress={33} title="Trip post">
        {/* extra bottom padding so content never hides behind navbar/CTA */}
        <form onSubmit={handleSubmit(onSubmit)} className="pb-[160px] max-w-[430px] mx-auto">
          <h3 className="text-sm font-semibold mb-2">Step 1</h3>
          <div className="text-[13px] font-semibold mb-3">
            Basic Tour Information
          </div>

          {/* Tour name */}
          <label className="block text-[15px] text-gray-700">Tour name</label>
          <input
            {...register("tourName")}
            className={pillInput}
            placeholder=""
            aria-invalid={!!errors.tourName}
          />
          {errors.tourName && (
            <div className="text-[11px] text-red-500 mb-2">{errors.tourName.message}</div>
          )}

          {/* Tour type (select) */}
          <label className="block text-[15px] text-gray-700">Tour type</label>
          <div className="relative mt-1 mb-1">
            <select
              {...register("tourType")}
              defaultValue=""
              className={
                "appearance-none w-full h-10 rounded-full border border-[#ECECEC] bg-white px-4 pr-9 " +
                "outline-none focus:ring-2 focus:ring-[#28B872]/30 " +
                "shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              }
              aria-invalid={!!errors.tourType}
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="safari">Safari</option>
              <option value="hiking">Hiking</option>
              <option value="cultural">Cultural</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
          {errors.tourType && (
            <div className="text-[11px] text-red-500 mb-2">{errors.tourType.message}</div>
          )}

          {/* Destination */}
          <label className="block text-[15px] text-gray-700">Destination/Park</label>
          <input
            {...register("destination")}
            className={pillInput}
            aria-invalid={!!errors.destination}
          />
          {errors.destination && (
            <div className="text-[11px] text-red-500 mb-2">{errors.destination.message}</div>
          )}

          {/* Photos */}
          <div className="text-[15px] text-gray-700">Photos</div>
          <div className="mt-2 mb-3">
            <PhotoPicker
              value={photos}
              onChange={onPhotosChange}
              error={errors.photos?.message as string | undefined}
            />
          </div>

          {/* Starting point */}
          <label className="block text-[15px] text-gray-700">Starting point</label>
          <input
            {...register("startingPoint")}
            className={pillInput}
            aria-invalid={!!errors.startingPoint}
          />
          {errors.startingPoint && (
            <div className="text-[11px] text-red-500 mb-2">{errors.startingPoint.message}</div>
          )}

          {/* Overview (rounded box like mock) */}
          <label className="block text-[15px] text-gray-700">Overview</label>
          <textarea
            {...register("overview")}
            className={
              "mt-1 mb-1 w-full h-28 rounded-2xl border border-[#ECECEC] bg-white px-4 py-3 " +
              "outline-none focus:ring-2 focus:ring-[#28B872]/30 " +
              "shadow-[0_1px_2px_rgba(0,0,0,0.06)] resize-none"
            }
            aria-invalid={!!errors.overview}
          />
          {errors.overview && (
            <div className="text-[11px] text-red-500 mb-2">{errors.overview.message}</div>
          )}

          {/* Top highlights */}
          <label className="block text-[15px] text-gray-700">Top highlights</label>
          <input
            {...register("highlights")}
            className={pillInput}
            aria-invalid={!!errors.highlights}
          />
          {errors.highlights && (
            <div className="text-[11px] text-red-500 mb-2">{errors.highlights.message}</div>
          )}

          {/* Centered floating Next button (pill + white filled arrow) */}
          <div
            className="fixed left-1/2 -translate-x-1/2 z-40"
            // keep it above bottom nav and respect safe-area
            style={{ bottom: "max(92px, calc(env(safe-area-inset-bottom) + 92px))" }}
          >
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={
                "inline-flex items-center gap-3 h-11 px-6 rounded-full " +
                "bg-[#28B872] text-white font-medium tracking-tight " +
                "shadow-[0_6px_14px_rgba(0,0,0,0.18)] hover:opacity-95 active:scale-95 " +
                "disabled:opacity-50 disabled:cursor-not-allowed"
              }
              aria-label="Next"
            >
              <span>Next</span>
              <ArrowUturnRightIcon className="w-5 h-5 fill-current" aria-hidden="true" />
            </button>
          </div>
        </form>
      </TourtripLayout>

      <Navbar active="explore" />
    </div>
  );
}
