import z from "zod";

export const step1Schema = z.object({
  tourName: z.string().min(2, "Tour name is required"),
  tourType: z.string().min(1, "Select a tour type"),
  destination: z.string().min(1, "Destination is required"),
  // allow regular URLs or data: URLs from FileReader
  photos: z
    .array(
      z
        .string()
        .refine(
          (v) => v.startsWith("data:") || /^https?:\/\//.test(v),
          "Invalid image"
        )
    )
    .min(2, "Add at least two photo")
    .max(50, "Max 50 photos"),
  startingPoint: z.string().min(1, "Starting point is required"),
  overview: z.string().min(10, "Overview must be at least 10 characters"),
  highlights: z.string().min(2, "Add at least one highlight"),
});

export const Step2TripSchema = z.object({
  groupNumber: z
    .string()
    .min(1, "Group number is required")
    .regex(/^[1-9][0-9]*$/, "Group number must be a positive number"),
  activities: z
    .array(
      z.object({
        activity: z.string().min(1, "Activity is required"),
        time: z.string().min(1, "Time is required"),
      })
    )
    .min(1, "At least one activity is required"),
});

export type Step1FormData = z.infer<typeof step1Schema>;
<<<<<<< HEAD



export type ScheduleType = "oneTime" | "scheduled";

export const stepthreeSchema = z.object({
  price: z.number().min(0, "Price must be non-negative"),
  discount: z.number().min(0).max(100).optional(),
  total: z.number().min(0),
  includes: z.array(z.string().min(1)).min(1),
  notIncludes: z.array(z.string().min(1)).optional(),
  essentialEquipment: z.array(z.string().min(1)).optional(),
  postAction: z.enum(["save", "schedule"]),
  scheduleType: z.enum(["oneTime", "scheduled"]).optional(),
  scheduleAt: z.date().optional(),
}).refine((data) => {
  if (data.postAction === "schedule") {
    return !!data.scheduleAt && !!data.scheduleType;
  }
  return true;
}, {
  message: "Schedule date and type are required for scheduling",
  path: ["scheduleAt"],
});

export type StepthreeFormData = z.infer<typeof stepthreeSchema>;
=======
export type Step2FormData = z.infer<typeof Step2TripSchema>;
>>>>>>> c1b0c78131a5d86a98427883264a7c7c41e2c658
