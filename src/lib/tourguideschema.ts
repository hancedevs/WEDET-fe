import z from "zod";

export const step1Schema = z.object({
  tourName: z.string().min(2, "Tour name is required"),
  tourType: z.string().min(1, "Select a tour type"),
  destination: z.string().min(1, "Destination is required"),

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
export const BusinessSignupSchema = z.object({
  BusinessName: z.string().min(2, "Business name is required"),
  registrationNumber: z.string().min(3, "Registration number is required"),
  foundingDate: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), "Use YYYY-MM-DD"),
  aboutBusiness: z.string().max(1000, "Max 1000 characters").optional(),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(7, "Too short").max(20, "Too long").optional(),
  fayidaId: z.string().min(4, "Too short").max(32, "Too long").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type BusinessSignupInput = z.infer<typeof BusinessSignupSchema>;

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

export type ScheduleType = "oneTime" | "scheduled";

export const stepthreeSchema = z
  .object({
    price: z.number().min(0, "Price must be non-negative"),
    discount: z
      .union([z.number().min(0).max(100), z.literal(""), z.null()])
      .optional(),

    total: z.number().min(0),
    includes: z.array(z.string().min(1)).min(1),
    notIncludes: z.array(z.string().min(1)).optional(),
    essentialEquipment: z.array(z.string().min(1)).optional(),
    postAction: z
      .union([
        z.literal("save"),
        z.literal("schedule"),
        z.literal(""),
        z.null(),
      ])
      .optional(),

    scheduleType: z.enum(["oneTime", "scheduled"]).optional(),
    scheduleAt: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.postAction === "schedule") {
        return !!data.scheduleAt && !!data.scheduleType;
      }
      return true;
    },
    {
      message: "Schedule date and type are required for scheduling",
      path: ["scheduleAt"],
    }
  );

export type StepthreeFormData = z.infer<typeof stepthreeSchema>;
export type Step2FormData = z.infer<typeof Step2TripSchema>;
