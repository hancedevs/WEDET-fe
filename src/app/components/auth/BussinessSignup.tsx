	"use client";
	
	import { useEffect, useMemo, useState } from "react";
	import Logo from "../ui/Logo";
	import { Input } from "@/components/ui/input";
	import { Button } from "@/components/ui/button";
	import { BussinessSignupSchema } from "@/lib/validation";
	import { z } from "zod";
	import { useRouter } from "next/navigation";
	import { supabase } from "@/lib/supabaseClient";
	
	/* -------- types -------- */
	type FormErrors = Record<string, string>;
	type LicenseTuple = [File | null, File | null];
	
	type BizForm = {
	  BusinessName: string;
	  registrationNumber: string;
	  foundingDate: string;
	  aboutBusiness: string;
	  email: string;
	  phoneNumber: string;
	  fayidaId: string;
	  password: string;
	  licenseImages: LicenseTuple; // two slots
	};
	
	/* -------- constants -------- */
	const MAX_FILE_SIZE_MB = 5;
	const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
	
	export default function Signupform() {
	  const router = useRouter();
	  const [errors, setErrors] = useState<FormErrors>({});
	
	  const [formData, setFormData] = useState<BizForm>({
	    BusinessName: "",
	    registrationNumber: "",
	    foundingDate: "",
	    aboutBusiness: "",
	    email: "",
	    phoneNumber: "",
	    fayidaId: "",
	    password: "",
	    licenseImages: [null, null],
	  });
	
	  /* previews for selected images */
	  const previews = useMemo<(string | null)[]>(
	    () =>
	      formData.licenseImages.map((f) => (f ? URL.createObjectURL(f) : null)),
	    [formData.licenseImages]
	  );
	
	  useEffect(() => {
	    return () => {
	      previews.forEach((url) => url && URL.revokeObjectURL(url));
	    };
	  }, [previews]);
	
	  /* handlers */
	  const handleChange = (
	    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	  ) => {
	    const { name, value } = e.target;
	    setFormData((prev) => ({ ...prev, [name]: value }));
	    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
	  };
	
	  const handleFileChange =
	    (slotIndex: 0 | 1) => (e: React.ChangeEvent<HTMLInputElement>) => {
	      const file = e.target.files?.[0] ?? null;
	
	      if (file) {
	        const typeOk = ACCEPTED_TYPES.includes(file.type);
	        const sizeOk = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
	        if (!typeOk) {
	          setErrors((p) => ({
	            ...p,
	            [`licenseImages-${slotIndex}`]: "Only PNG, JPG or WEBP images",
	          }));
	          return;
	        }
	        if (!sizeOk) {
	          setErrors((p) => ({
	            ...p,
	            [`licenseImages-${slotIndex}`]: `Max ${MAX_FILE_SIZE_MB}MB per file`,
	          }));
	          return;
	        }
	      }
	
	      setFormData((prev) => {
	        const next: LicenseTuple = [...prev.licenseImages] as LicenseTuple;
	        next[slotIndex] = file;
	        return { ...prev, licenseImages: next };
	      });
	      setErrors((p) => ({ ...p, [`licenseImages-${slotIndex}`]: "" }));
	    };
	
	  const validateForm = () => {
	    try {
	      BussinessSignupSchema.extend({
	        password: z.string().min(6, "Password must be at least 6 characters"),
	      }).parse({
	        ...formData,
	        // zod ignores File objects by default; we keep files optional here
	      });
	      setErrors({});
	      return true;
	    } catch (err) {
	      if (err instanceof z.ZodError) {
	        const next: FormErrors = {};
	        err.issues.forEach((i) => {
	          const key = String(i.path[0] ?? "root");
	          next[key] = i.message;
	        });
	        setErrors(next);
	      }
	      return false;
	    }
	  };
	
	  const handleSubmit = async (e: React.FormEvent) => {
	    e.preventDefault();
	    if (!validateForm()) return;
	
	    try {
	      const email = formData.email.trim().toLowerCase();
	
	      const { data: signUpData, error } = await supabase.auth.signUp({
	        email,
	        password: formData.password,
	        options: {
	          data: {
	            role: "business_user",
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
	
	      // force them to verify email first
	      if (signUpData.session) await supabase.auth.signOut();
	
	      // reset & go to login
	      setFormData({
	        BusinessName: "",
	        registrationNumber: "",
	        foundingDate: "",
	        aboutBusiness: "",
	        email: "",
	        phoneNumber: "",
	        fayidaId: "",
	        password: "",
	        licenseImages: [null, null],
	      });
	      router.replace("/auth/login");
	    } catch (err) {
	      const msg = err instanceof Error ? err.message : "Signup failed";
	      console.error(msg);
	    }
	  };
	
	  /* -------- UI (matches your screenshot) -------- */
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
	                {/* Business name */}
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
	
	                {/* Registration Number */}
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
	
	                {/* Founding date */}
	                <div className="flex flex-col gap-1">
	                  <label>Founding date</label>
	                  <Input
	                    type="date"
	                    name="foundingDate"
	                    value={formData.foundingDate}
	                    onChange={handleChange}
	                    className="rounded-3xl p-6 border-none shadow focus:ring-2 focus:ring-green-300"
	                  />
	                  {errors.foundingDate && (
	                    <p className="text-red-500 text-xs mt-1 px-2">
	                      {errors.foundingDate}
	                    </p>
	                  )}
	                </div>
	
	                {/* About business */}
	                <div className="flex flex-col gap-1">
	                  <label>About your business</label>
	                  <textarea
	                    name="aboutBusiness"
	                    value={formData.aboutBusiness}
	                    onChange={handleChange}
	                    className="rounded-3xl w-full p-6 border-none shadow focus:ring-2 focus:ring-green-300"
	                    rows={4}
	                  />
	                  {errors.aboutBusiness && (
	                    <p className="text-red-500 text-xs mt-1 px-2">
	                      {errors.aboutBusiness}
	                    </p>
	                  )}
	                </div>
	
	                <h2 className="font-bold">Account owner</h2>
	
	                {/* Email */}
	                <div className="flex flex-col gap-1">
	                  <label>Email Address*</label>
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
	
	                {/* Phone */}
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
	
	                {/* Fayda ID */}
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
	
	                {/* Password */}
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
	
	                {/* Upload business license (2 dashed boxes with green icon) */}
	                <div className="flex flex-col gap-2">
	                  <label className="mb-1 font-medium">
	                    Upload business license
	                  </label>
	
	                  <div className="flex gap-4">
	                    {[0, 1].map((idx) => {
	                      const slot = idx as 0 | 1;
	                      const previewUrl = previews[idx];
	                      const errorKey = `licenseImages-${idx}`;
	
	                      return (
	                        <label
	                          key={idx}
	                          className="w-24 h-24 cursor-pointer border-2 border-dashed border-green-400 rounded-md flex items-center justify-center overflow-hidden bg-white"
	                          title={previewUrl ? "Change image" : "Upload image"}
	                        >
	                          <input
	                            type="file"
	                            accept={ACCEPTED_TYPES.join(",")}
	                            className="hidden"
	                            onChange={handleFileChange(slot)}
	                          />
	                          {previewUrl ? (
	                            <img
	                              src={previewUrl}
	                              alt="license preview"
	                              className="w-full h-full object-cover"
	                            />
	                          ) : (
	                            <svg
	                              xmlns="http://www.w3.org/2000/svg"
	                              width="48"
	                              height="48"
	                              viewBox="0 0 24 24"
	                              fill="none"
	                              stroke="#4cc274"
	                              strokeWidth="1.5"
	                              strokeLinecap="round"
	                              strokeLinejoin="round"
	                            >
	                              <path d="M16 5h6" />
	                              <path d="M19 2v6" />
	                              <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
	                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                              <circle cx="9" cy="9" r="2" />
	                            </svg>
                          )}
	                          {/* slot-specific error under each tile */}
	                          {errors[errorKey] && (
	                            <span className="absolute mt-28 text-[11px] text-red-500">
	                              {errors[errorKey]}
	                            </span>
	                          )}
	                        </label>
	                      );
	                    })}
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
	

