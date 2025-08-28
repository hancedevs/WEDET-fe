"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";

import TourtripLayout from "@/app/components/Tourguidecomponents/TourtripLayout";
import Navbar from "@/app/components/Tourguidecomponents/TourGuideNavbar";
import StepController from "@/app/components/Tourguidecomponents/stepcontroller";
import TripCard from "@/app/components/ui/TripCard";
import type { Trip } from "@/app/types/type";
import {
  stepthreeSchema,
  type StepthreeFormData,
  type ScheduleType,
} from "@/lib/tourguideschema";

import { saveDraft } from "@/lib/tripDraftLocal";
import { postTripToSupabase } from "@/lib/tripPoster";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string | boolean;
  rightAddon?: React.ReactNode;
  variant?: "plain" | "filled";
};
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, rightAddon, variant = "plain", ...props }, ref) => {
    const base =
      "w-full h-10 rounded-full shadow px-5 text-base text-gray-900 placeholder:text-gray-400 " +
      "outline-none transition-colors duration-200 " +
      "focus:bg-[#EAF8F1] focus:border-[#9be5c2] focus:ring-2 focus:ring-[#26cc73] focus:caret-[#26cc73] " +
      "aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/60";
    const tone =
      variant === "filled" ? "bg-[#fafafa] border-0" : "bg-white border border-gray-200";
    return (
      <div className="relative">
        <input
          ref={ref}
          aria-invalid={!!error}
          className={[base, tone, className].filter(Boolean).join(" ")}
          {...props}
        />
        {rightAddon && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            {rightAddon}
          </span>
        )}
        {typeof error === "string" && (
          <p className="text-red-500 text-sm mt-1 px-2">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

type StepthreeFormReturn = UseFormReturn<StepthreeFormData>;
function CapsuleList({
  name,
  form,
  placeholder = "Add item…",
  title,
}: {
  name: "includes" | "notIncludes" | "essentialEquipment";
  form: StepthreeFormReturn;
  placeholder?: string;
  title: string;
}) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const items = (watch(name) as string[]) ?? [];
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState("");

  const errorMsg =
    (errors[name] as unknown as { message?: string } | undefined)?.message ?? "";

  const addItem = () => {
    const v = newItem.trim();
    if (!v) return;
    setValue(name, [...items, v], { shouldDirty: true, shouldValidate: true });
    setNewItem("");
    setIsAdding(false);
  };

  const removeItem = (i: number) => {
    setValue(
      name,
      items.filter((_, idx) => idx !== i),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">{title}</h3>

      {items.map((text, i) => (
        <div key={`${name}-${i}`} className="flex items-center rounded-full bg-white shadow px-4 py-3 mb-3">
          <button type="button" onClick={() => removeItem(i)} className="mr-3 text-black" aria-label="Remove">
            ×
          </button>
          <span className="text-base">{text}</span>
        </div>
      ))}

      {isAdding ? (
        <div className="flex items-center">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={placeholder}
            variant="filled"
          />
          <button type="button" onClick={addItem} className="ml-2 text-[#26cc73] font-medium">
            Add
          </button>
          <button type="button" onClick={() => { setIsAdding(false); setNewItem(""); }} className="ml-2 text-gray-500">
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center text-black rounded-full bg-white shadow px-5 py-2"
        >
          <span className="mr-2">+</span> Add more
        </button>
      )}

      {errorMsg && <p className="text-red-500 text-sm mt-1 px-2">{errorMsg}</p>}
    </div>
  );
}

const fmtDateOnly = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit" }).format(d);
};
const todayISO = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export default function Step3Page() {
  const router = useRouter();

  const form = useForm<StepthreeFormData>({
    resolver: zodResolver(stepthreeSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      includes: ["Expert naturalist guide and local guides"],
      scheduleType: "oneTime",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = form;

  const price = watch("price");
  const discount = watch("discount");
  const postAction = watch("postAction");
  const scheduleType = watch("scheduleType");
  const isScheduling = postAction === "schedule";

  const total = useMemo(() => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;
    return Math.max(0, Math.round(p * (1 - d / 100)));
  }, [price, discount]);

  useEffect(() => {
    setValue("total", total, { shouldDirty: true, shouldValidate: true });
  }, [total, setValue]);

  const [dateISO, setDateISO] = useState<string>("");
  useEffect(() => {
    if (isScheduling && dateISO) {
      setValue("scheduleAt", new Date(`${dateISO}T00:00:00`), {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else {
      setValue("scheduleAt", undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [isScheduling, dateISO, setValue]);

  const chooseTab = (tab: ScheduleType) => {
    setValue("scheduleType", tab, { shouldDirty: true, shouldValidate: true });
  };

  // Submit: save step3, then insert into public.tours
  const onSubmit: SubmitHandler<StepthreeFormData> = async (data) => {
    saveDraft("step3", data);

    const status = data.postAction === "schedule" ? "scheduled" : "posted";
    const sched = status === "scheduled" ? (data.scheduleAt ?? null) : null;

    try {
      await postTripToSupabase({ status, scheduleAt: sched, dateISO });
    } catch (e) {
      console.error(e);
      return;
    }

    router.push("/Dashbord/TourDash");
  };

  const onError: SubmitErrorHandler<StepthreeFormData> = (e) => {
    console.log("Form errors:", e);
  };

  return (
    <div className="relative">
      <TourtripLayout progress={100} title="Trip post">
        <form onSubmit={handleSubmit(onSubmit, onError)} className="pb-[140px] max-w-[430px] mx-auto">
          <p className="text-sm mb-2">Step 3</p>
          <div className="text-xl font-semibold mb-3">Pricing Information</div>

          <label className="block text-[15px]">Price</label>
          <Input
            type="number"
            inputMode="decimal"
            placeholder="3000"
            {...register("price", { valueAsNumber: true })}
            error={errors.price?.message}
          />

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            <label htmlFor="discount" className="text-[15px]">If Discount</label>
            <label htmlFor="total" className="text-[15px]">Total</label>

            <Input
              id="discount"
              type="number"
              inputMode="numeric"
              placeholder="15"
              {...register("discount", {
                setValueAs: (v) => (v === "" || v === undefined ? "" : Number(v)),
              })}
              variant="filled"
              error={errors.discount?.message}
              rightAddon={<span className="inline-flex items-center justify-center w-8">%</span>}
              className="w-full"
            />

            <Input
              id="total"
              type="number"
              readOnly
              placeholder="2700"
              {...register("total", { valueAsNumber: true })}
              variant="filled"
              error={errors.total?.message}
              rightAddon={<span className="inline-flex items-center justify-center w-8 opacity-0">%</span>}
              className="w-full"
            />
          </div>

          <CapsuleList name="includes" form={form} title="Include" placeholder="Expert guide, entry fees…" />
          <CapsuleList name="notIncludes" form={form} title="Not Include" placeholder="Flights, tips…" />
          <CapsuleList name="essentialEquipment" form={form} title="Essential Equipment" placeholder="Hiking boots, jacket…" />

          <fieldset className="mt-4 space-y-3" role="radiogroup" aria-label="Post action">
            <legend className="sr-only">Post action</legend>

            <label className="flex items-center cursor-pointer select-none">
              <input
                type="radio"
                value="save"
                className="peer sr-only"
                checked={postAction === "save"}
                onChange={() =>
                  setValue("postAction", "save" as any, { shouldDirty: true, shouldValidate: true })
                }
                onClick={() => {
                  if (postAction === "save") {
                    setValue("postAction", "" as any, { shouldDirty: true, shouldValidate: true });
                  }
                }}
              />
              <span className="relative mr-3 w-5 h-5 rounded-full border-2 border-[#26cc73]
                  after:content-[''] after:absolute after:inset-0.5 after:rounded-full
                  after:bg-[#26cc73] after:scale-0 after:transition-transform after:duration-150
                  peer-checked:after:scale-100" />
              <span className="font-medium text-gray-700 peer-checked:text-black">Save Trip</span>
            </label>

            <label className="flex items-center cursor-pointer select-none">
              <input
                type="radio"
                value="schedule"
                className="peer sr-only"
                checked={postAction === "schedule"}
                onChange={() =>
                  setValue("postAction", "schedule" as any, { shouldDirty: true, shouldValidate: true })
                }
                onClick={() => {
                  if (postAction === "schedule") {
                    setValue("postAction", "" as any, { shouldDirty: true, shouldValidate: true });
                  }
                }}
              />
              <span className="relative mr-3 w-5 h-5 rounded-full border-2 border-[#26cc73]
                  after:content-[''] after:absolute after:inset-0.5 after:rounded-full
                  after:bg-[#26cc73] after:scale-0 after:transition-transform after:duration-150
                  peer-checked:after:scale-100" />
              <span className="font-medium text-gray-700 peer-checked:text-black">Schedule Post</span>
            </label>

            {errors.postAction && (
              <p className="text-red-500 text-sm mt-1 px-2">{errors.postAction.message as string}</p>
            )}
          </fieldset>

          {isScheduling && (
            <div className="relative bg-white rounded-[42px] p-4 mt-9 mb-6 ring-1 ring-[#DBF5E8] shadow-[0_10px_26px_rgba(0,0,0,0.08)]">
              <div className="flex items-center bg-[#F2F9F5] rounded-[40px] w-full h-10 mb-7 p-1 shadow-sm ring-1 ring-[#D9F0E7]">
                <button
                  type="button"
                  onClick={() => chooseTab("oneTime")}
                  className={`flex-1 h-8 rounded-full font-medium text-sm ${
                    scheduleType === "oneTime" ? "bg-[#28B872] text-white shadow" : "text-gray-500"
                  }`}
                >
                  One Time
                </button>
                <button
                  type="button"
                  onClick={() => chooseTab("scheduled")}
                  className={`flex-1 h-8 rounded-full font-medium text-sm ${
                    scheduleType === "scheduled" ? "bg-[#28B872] text-white shadow" : "text-gray-500"
                  }`}
                >
                  Scheduled
                </button>
              </div>

              <div className="relative rounded-4xl">
                <TripCard
                  trip={
                    {
                      id: "wenchi-demo",
                      title: "Wenchi",
                      location: "Wenchi, Oromia",
                      priceBr: Number(watch("total") || 0),
                      durationDays: 2,
                      imageUrl: "/tipsimage.png",
                    } as Trip
                  }
                />

                <div className="absolute -top-5 right-4">
                  <div
                    className={`flex items-center bg-white rounded-full shadow-[0_8px_18px_rgba(0,0,0,0.12)] ring-1 ring-[#E7F7F0] h-10 ${
                      dateISO ? "w-[160px] pl-4 pr-3 justify-start" : "w-[64px] justify-center px-3"
                    }`}
                  >
                    {dateISO && <span className="text-sm text-gray-500 truncate mr-2">{fmtDateOnly(dateISO)}</span>}
                    <Calendar className="w-5 h-5 text-[#28B872]" />
                    <input
                      type="date"
                      min={todayISO()}
                      value={dateISO}
                      onChange={(e) => setDateISO(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      aria-label="Pick schedule date"
                    />
                  </div>
                </div>
              </div>

              {errors.scheduleAt && (
                <p className="text-red-500 text-sm mt-2 px-2">{errors.scheduleAt.message as string}</p>
              )}
            </div>
          )}

          <div className="mt-39 pb-6">
            <StepController
              showPrev
              canNext={!isSubmitting}
              submitMode
              prevHref="/Tourguide/Tourtip2"  // keep as your original route
              className="max-w-[430px] mx-auto"
            />
          </div>
        </form>
      </TourtripLayout>

      <Navbar active="explore" />
    </div>
  );
}
