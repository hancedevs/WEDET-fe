"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabaseClient";
import { signupSchema } from "@/lib/validation";

import Logo from "../ui/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "../ui/sonner";

type Gender = "male" | "female" | "";

interface FormState {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  email: string;
  password: string;
  agreeToTerms: boolean;
}

export default function Signupform() {
  const router = useRouter();

  const [dateType, setDateType] = useState<"text" | "date">("text");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    try {
      signupSchema.parse({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: (formData.gender as Exclude<Gender, "">) || undefined,
        agreeToTerms: formData.agreeToTerms,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const next: Record<string, string> = {};
        for (const issue of error.issues) {
          const field = String(issue.path[0] ?? "root");
          next[field] = issue.message;
        }
        setErrors(next);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, root: "" }));

    const tid = toast.loading("Creating your account…");

    try {
      const { firstName, lastName, dateOfBirth, gender, email, password } = formData;

      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { firstName, lastName, dateOfBirth, gender, role: "normal_user" }, // 👈 tag role
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message, { id: tid });
        setErrors((p) => ({ ...p, root: error.message }));
        return;
      }

      // Always force the login screen next:
      if (signUpData.session) await supabase.auth.signOut();

      toast.success("Account created! You can now log in.", { id: tid });
      router.replace("/auth/login");

      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        email: "",
        password: "",
        agreeToTerms: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message, { id: tid });
      setErrors((p) => ({ ...p, root: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 300 }}>
      <Logo />
      <div className="absolute top-30 w-full bg-white flex flex-col rounded-t-3xl justify-center py-6 sm:px-6 lg:px-8">
        <div className="max-w-sm mx-auto">
          <h2 className="text-xl px-10 mt-3 font-bold text-[#959494]">Create your account</h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-10 sm:rounded-lg sm:px-10">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {errors.root && <p className="text-red-500 text-xs px-2">{errors.root}</p>}

              {/* First Name */}
              <div>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:ring-2 focus:ring-green-300"
                  placeholder="First Name"
                  disabled={isSubmitting}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1 px-2">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:ring-2 focus:ring-green-300"
                  placeholder="Last Name"
                  disabled={isSubmitting}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1 px-2">{errors.lastName}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <Input
                  name="dateOfBirth"
                  type={dateType}
                  value={formData.dateOfBirth}
                  onFocus={() => setDateType("date")}
                  onBlur={() => formData.dateOfBirth === "" && setDateType("text")}
                  onChange={handleChange}
                  className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:ring-2 focus:ring-green-300"
                  placeholder="Date of birth"
                  disabled={isSubmitting}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1 px-2">{errors.dateOfBirth}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium px-3 text-gray-300">Gender</label>
                <div className="mt-4 flex space-x-4 px-4">
                  {["male", "female"].map((g) => (
                    <div className="flex items-center" key={g}>
                      <Input
                        id={g}
                        name="gender"
                        type="radio"
                        value={g}
                        className="h-4 w-4 accent-green-600"
                        checked={formData.gender === g}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      <label htmlFor={g} className="ml-2 block text-sm text-green-500 capitalize">
                        {g}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.gender && <p className="text-red-500 text-xs mt-1 px-2">{errors.gender}</p>}
              </div>

              {/* Email */}
              <div>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:ring-2 focus:ring-green-300"
                  placeholder="Email"
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 px-2">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:ring-2 focus:ring-green-300 pr-10"
                  placeholder="New Password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {errors.password && <p className="text-red-500 text-xs mt-1 px-2">{errors.password}</p>}
              </div>

              {/* Terms */}
              <div className="flex items-center max-w-80 text-center">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 accent-green-600"
                  disabled={isSubmitting}
                />
                <label htmlFor="agreeToTerms" className="text-sm font-medium mt-4 text-[#959494] ml-2">
                  By selecting Create account I agree to wedet&apos;s terms of service and privacy policy.
                </label>
              </div>
              {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1 px-2">{errors.agreeToTerms}</p>}

              {/* Submit */}
              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mx-auto flex p-6 px-28 rounded-3xl bg-[#28b872] hover:bg-[#28b875] font-semibold disabled:opacity-60"
                >
                  {isSubmitting ? "Creating..." : "Create account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
