"use client";

import { useState } from "react";
import Logo from "../ui/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signupSchema } from "@/lib/validation";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

export default function Signupform() {
  const [dateType, setDateType] = useState<"text" | "date">("text");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(true);

  const [formData, setFormData] = useState({
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    try {
      const validationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as "male" | "female",
        agreeToTerms: formData.agreeToTerms,
      };

      signupSchema.parse(validationData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as keyof typeof formData;
          if (fieldName && typeof fieldName === "string") {
            newErrors[fieldName] = issue.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
 // Stop submission if validation fails
    if (!validateForm()) {
      return;
    }

    console.log("Form submitted:", formData);

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      password: "",
      agreeToTerms: false,
    });
  };
  return (
    <div
      style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 300 }}
    >
      <Logo />
      <div className="absolute top-30 w-full bg-white flex flex-col rounded-t-3xl justify-center py-6 sm:px-6 lg:px-8">
        <div className="max-w-sm mx-auto">
          <h2 className="text-xl px-10 mt-3 font-bold text-[#959494]">
            Create your account
          </h2>
        </div>
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-10 sm:rounded-lg sm:px-10">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-y-8 gap-x-4">
                {/* First Name */}
                <div>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:ring-2 focus:ring-green-300"
                    placeholder="First Name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1 px-2">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:ring-2 focus:ring-green-300"
                    placeholder="Last Name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1 px-2">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <Input
                    name="dateOfBirth"
                    type={dateType}
                    value={formData.dateOfBirth}
                    onFocus={() => setDateType("date")}
                    onBlur={() =>
                      formData.dateOfBirth === "" && setDateType("text")
                    }
                    onChange={handleChange}
                    className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:ring-2 focus:ring-green-300"
                    placeholder="Date of birth"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1 px-2">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium px-3 text-gray-300">
                    Gender
                  </label>
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
                        />
                        <label
                          htmlFor={g}
                          className="ml-2 block text-sm text-green-500 capitalize"
                        >
                          {g}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1 px-2">
                      {errors.gender}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:ring-2 focus:ring-green-300"
                    placeholder="Email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 px-2">
                      {errors.email}
                    </p>
                  )}
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
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 px-2">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-center max-w-80 text-center">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 accent-green-600"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="text-sm font-medium mt-4 text-[#959494] ml-2"
                >
                  By selecting Create account I agree to wedet&apos;s terms of
                  service and privacy policy.
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-xs mt-1 px-2">
                  {errors.agreeToTerms}
                </p>
              )}

              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  className="mx-auto flex p-6 px-28 rounded-3xl bg-[#28b872] hover:bg-[#28b875] font-semibold"
                >
                  Create account
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
