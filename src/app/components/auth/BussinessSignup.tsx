"use client";

import { useState } from "react";
import Logo from "../ui/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BussinessSignupSchema } from "@/lib/validation";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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
    password: "", // 👈 needed for Supabase signup
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
      // extend your existing schema to require password locally
      BussinessSignupSchema.extend({
        password: z.string().min(6, "Password must be at least 6 characters"),
      }).parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const fieldName = String(issue.path[0] ?? "root");
          newErrors[fieldName] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Create the Supabase auth user and tag as business
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: "business_user", // 👈 tag role
            businessProfile: {
              BusinessName: formData.BusinessName,
              registrationNumber: formData.registrationNumber,
              foundingDate: formData.foundingDate,
              aboutBusiness: formData.aboutBusiness,
              phoneNumber: formData.phoneNumber,
              fayidaId: formData.fayidaId,
            },
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;

      // Always go to login; if auto-signed in, sign out first
      if (signUpData.session) await supabase.auth.signOut();

      router.replace("/auth/login");

      setFormData({
        BusinessName: "",
        registrationNumber: "",
        foundingDate: "",
        aboutBusiness: "",
        email: "",
        phoneNumber: "",
        fayidaId: "",
        password: "",
      });
    } catch (err) {
      console.error(err);
    }
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
                  <label>Password</label>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="rounded-3xl p-6 border-none shadow focus:ring-2 focus:ring-green-300"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 px-2">
                      {errors.password}
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
