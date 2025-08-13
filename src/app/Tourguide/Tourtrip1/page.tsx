"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TourtripLayout from "@/app/components/Tourguidecomponents/TourtripLayout";
import Navbar from "@/app/components/Tourguidecomponents/TourGuideNavbar";
import PhotoPicker from "@/app/components/Tourguidecomponents/photopicker";
import { step1Schema, type Step1FormData } from "@/lib/tourguideschema";
import { ChevronDown } from "lucide-react";
import StepController from "@/app/components/Tourguidecomponents/stepcontroller";

export default function Step1Page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    mode: "onSubmit",          
    reValidateMode: "onChange",
    shouldFocusError: true,
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (data:Step1FormData) => {
    // console.log("Step1", data);
    router.push("/Tourguide/Tourtrip2");
  };

 
  const submitOrFocus = handleSubmit(onSubmit, (errs) => {
    const first = Object.keys(errs)[0] as keyof Step1FormData | undefined;
    if (first) setFocus(first);
  });

  return (
    <div className="relative">
      <TourtripLayout progress={33} title="Trip post">
        <form onSubmit={submitOrFocus} className="pb-[140px] max-w-[430px] mx-auto">
          <h3 className="text-sm font-semibold mb-2">Step 1</h3>
          <div className="text-[13px] font-semibold mb-3">Basic Tour Information</div>

          {/* Tour name */}
          <label className="block text-[15px] text-black">Tour name</label>
          <input
            {...register("tourName")}
            placeholder="Trip to Wenchi"
            className="
              mt-1 mb-4 w-full h-10 rounded-full bg-[#fafafa] shadow px-5 text-base outline-none
              border-none focus:border-none focus:ring-2 focus:ring-[#26cc73]
              placeholder:text-gray-400 caret-[#26cc73]
              aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/60
            "
            aria-invalid={!!errors.tourName}
          />
          {errors.tourName && <p className="text-red-500 text-xs mb-2">{errors.tourName.message}</p>}

          {/* Tour type (select) */}
          <label className="block text-[15px] font-semibold text-black">Tour type</label>
          <div className="relative mt-1 mb-1">
            <select
              {...register("tourType")}
              defaultValue=""
              className="
                appearance-none w-full h-10 rounded-full bg-[#fafafa] shadow px-5 pr-10 text-base outline-none
                border-none focus:border-none focus:ring-2 focus:ring-[#26cc73]
                placeholder:text-gray-400 caret-[#26cc73]
                aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/60
              "
              aria-invalid={!!errors.tourType}
            >
              <option value="" disabled>Select type</option>
              <option value="safari">Safari</option>
              <option value="hiking">Hiking</option>
              <option value="cultural">Cultural</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
          {errors.tourType && <p className="text-red-500 text-xs mb-2">{errors.tourType.message}</p>}

          {/* Destination */}
          <label className="block text-[15px] font-semibold text-black">Destination/Park</label>
          <input
            {...register("destination")}
            placeholder="Wenchi Lake"
            className="
              mt-1 mb-4 w-full h-10 rounded-full bg-[#fafafa] shadow px-5 text-base outline-none
              border-none focus:border-none focus:ring-2 focus:ring-[#26cc73]
              placeholder:text-gray-400 caret-[#26cc73]
              aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/60
            "
            aria-invalid={!!errors.destination}
          />
          {errors.destination && <p className="text-red-500 text-xs mb-2">{errors.destination.message}</p>}

          {/* Photos */}
          <div className="text-[15px] font-semibold text-black">Photos</div>
          <div className="mt-2 mb-3">
            <PhotoPicker
              value={photos}
              onChange={onPhotosChange}
              error={errors.photos?.message as string | undefined}
            />
          </div>

          {/* Starting point */}
          <label className="block text-[15px] font-semibold text-black">Starting point</label>
          <input
            {...register("startingPoint")}
            placeholder="Addis Ababa"
            className="
              mt-1 mb-4 w-full h-10 rounded-full bg-[#fafafa] shadow px-5 text-base outline-none
              border-none focus:border-none focus:ring-2 focus:ring-[#26cc73]
              placeholder:text-gray-400 caret-[#26cc73]
              aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/60
            "
            aria-invalid={!!errors.startingPoint}
          />
          {errors.startingPoint && <p className="text-red-500 text-xs mb-2">{errors.startingPoint.message}</p>}

          {/* Overview */}
          <label className="block text-[15px] font-semibold text-black">Overview</label>
          <textarea
            {...register("overview")}
            placeholder="Brief description of the tour..."
            className="
              mt-1 mb-4 w-full h-28 rounded-2xl bg-[#fafafa] shadow px-5 py-3 text-base outline-none
              border-none focus:border-none focus:ring-2 focus:ring-[#26cc73] resize-none
              placeholder:text-gray-400 caret-[#26cc73]
              aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/60
            "
            aria-invalid={!!errors.overview}
          />
          {errors.overview && <p className="text-red-500 text-xs mb-2">{errors.overview.message}</p>}

          {/* Top highlights */}
          <label className="block text-[15px] font-semibold text-black">Top highlights</label>
          <input
            {...register("highlights")}
            placeholder="Sunset, boat ride, hot springs…"
            className="
              mt-1 mb-1 w-full h-10 rounded-full bg-[#fafafa] shadow px-5 text-base outline-none
              border-none focus:border-none focus:ring-2 focus:ring-[#26cc73]
              placeholder:text-gray-400 caret-[#26cc73]
              aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/60
            "
            aria-invalid={!!errors.highlights}
          />
          {errors.highlights && <p className="text-red-500 text-xs mb-2">{errors.highlights.message}</p>}

          {/* Step controller (prev/next) */}
          <div className="mt-23 pb-6">
            <StepController
              onPrev={() => router.back()}
              onNext={submitOrFocus}     // <-- triggers validation & focuses first error
              canNext={!isSubmitting}    // don't block validation; only disable while submitting
              className="max-w-[430px] mx-auto"
            />
          </div>
        </form>
      </TourtripLayout>

      <Navbar active="explore" />
    </div>
  );
}
