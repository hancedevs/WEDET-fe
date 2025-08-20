"use client";

import { useState } from "react";
import Logo from "../ui/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BussinessSignupSchema } from "@/lib/validation";
import { z } from "zod";
import { useRouter } from "next/navigation";
export default function Signupform() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const [formData, setFormData] = useState({
    BusinessName: "",
    registrationNumber: "",
    foundingDate: "",
    aboutBusiness: "",
    email: "",
    phoneNumber: "",
    fayidaId: "",
    businessImage: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    try {
      BussinessSignupSchema.parse(formData);
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

    if (!validateForm()) {
      console.log(" Validation failed");
      return;
    }

    console.log("Validation passed", formData);
    router.push("/auth/otp");

    setFormData({
      BusinessName: "",
      registrationNumber: "",
      foundingDate: "",
      aboutBusiness: "",
      email: "",
      phoneNumber: "",
      fayidaId: "",
      businessImage: "",
    });
  };

  return (
    <div>
      <Logo />
      <div className="absolute top-30 w-full bg-white flex flex-col rounded-t-3xl justify-center py-6 sm:px-6 lg:px-8">
        <div className="max-w-sm">
          <h2 className="text-xl px-10 mt-3 font-semibold text-black">
            Business Profile
          </h2>
        </div>
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-10 sm:rounded-lg sm:px-10">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-y-8 gap-x-4">
                <div className="flex flex-col gap-1">
                  <label>Business name</label>
                  <Input
                    name="BusinessName"
                    value={formData.BusinessName}
                    onChange={handleChange}
                    className="rounded-3xl p-6 border-none shadow focus:ring-2 focus:ring-green-300"
                  />
                  {errors.BusinessName && (
                    <p className="text-red-500 text-xs mt-1 px-2">
                      {errors.BusinessName}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label>Registration Number</label>
                  <Input
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="rounded-3xl p-6 border-none shadow focus:ring-2 focus:ring-green-300"
                  />
                  {errors.registrationNumber && (
                    <p className="text-red-500 text-xs mt-1 px-2">
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label>Founding date</label>
                  <Input
                    type="date"
                    value={formData.foundingDate}
                    onChange={(e) =>
                      setFormData({ ...formData, foundingDate: e.target.value })
                    }
                    className="rounded-3xl p-6 border-none shadow focus:ring-2 focus:ring-green-300"
                  />
                  {errors.foundingDate && (
                    <p className="text-red-500 text-xs mt-1 px-2">
                      {errors.foundingDate}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label>About Your business</label>
                  <textarea
                    name="aboutBusiness"
                    value={formData.aboutBusiness}
                    onChange={handleChange}
                    className="rounded-3xl w-full p-6 border-none shadow focus:ring-2 focus:ring-green-300"
                  />
                  {errors.aboutBusiness && (
                    <p className="text-red-500 text-xs mt-1 px-2">
                      {errors.aboutBusiness}
                    </p>
                  )}
                </div>

                <h2 className="font-bold">Account owner</h2>

                <div className="flex flex-col gap-1">
                  <label>Email Address</label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-3xl p-6 border-none shadow focus:ring-2 focus:ring-green-300"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 px-2">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label>Phone number</label>
                  <Input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="rounded-3xl p-6 border-none shadow focus:ring-2 focus:ring-green-300"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1 px-2">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label>Fayda ID number</label>
                  <Input
                    name="fayidaId"
                    value={formData.fayidaId}
                    onChange={handleChange}
                    className="rounded-3xl p-6 border-none shadow focus:ring-2 focus:ring-green-300"
                  />
                  {errors.fayidaId && (
                    <p className="text-red-500 text-xs mt-1 px-2">
                      {errors.fayidaId}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="mb-3 font-medium">
                    Upload business license
                  </label>
                  <div className="flex gap-4">
                    {[0, 1].map((index) => (
                      <label
                        key={index}
                        className="w-24 h-24 cursor-pointer border-2 border-dashed border-green-400 rounded-md flex items-center justify-center"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          name={`businessImage-${index}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              console.log(
                                `Uploaded image ${index + 1}:`,
                                file.name
                              );
                            }
                          }}
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="70"
                          height="70"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#4cc274"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-image-plus-icon lucide-image-plus"
                        >
                          <path d="M16 5h6" />
                          <path d="M19 2v6" />
                          <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          <circle cx="9" cy="9" r="2" />
                        </svg>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="mx-auto flex p-6 px-28 rounded-3xl bg-[#28b872] hover:bg-[#28b875] font-semibold"
                >
                  Verify
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
