"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "../ui/Logo";
import { LoginFormData } from "@/app/types/type";
import { loginSchema } from "@/lib/validation";
export function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    // Handle login logic here
    console.log("Login data:", data);
    router.push("/pages/home");
  };

  const handleNavigateToSignup = () => {
    router.push("/auth/signup");
  };

  const handleNavigateToforgotpassword = () => {
    router.push("/auth/forgotpassword");
  };

  return (
    <div
      className="min-h-screen bg-auth-background flex flex-col"
      style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 300 }}
    >
      {/* Logo */}
      <Logo />

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 py-8 absolute top-30 w-full  border-t-2 ">
        <div className="max-w-sm mx-auto">
          {/*  header */}
          <h1
            className="text-xl text-[#959494] ml-1 mb-6 text-left"
            style={{
              fontFamily: "'Century Gothic'",
              fontWeight: 700,
            }}
          >
            Login to your account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={`rounded-full py-5 pl-6 border-gray-200 placeholder:text-gray-300 placeholder:pl-2 ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="Email Address"
                style={{
                  fontFamily: "'Century Gothic'",
                  fontWeight: 300,
                  paddingLeft: "0.5rem",
                }}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 pl-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={`rounded-full py-5 border-gray-200 placeholder:text-gray-300 ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Password"
                style={{
                  fontFamily: "'Century Gothic'",
                  fontWeight: 300,
                  paddingLeft: "1rem",
                }}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 pl-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={handleNavigateToforgotpassword}
                className="text-sm text-gray-400 hover:underline"
                style={{
                  fontFamily: "'Century Gothic'",
                  fontWeight: 300,
                }}
              >
                Forget Password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full py-5 bg-[#28B872] hover:bg-[#1f9d62] text-white"
              style={{
                fontFamily: "'Century Gothic', sans-serif",
                fontWeight: 300,
              }}
            >
              Login
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className="px-2 bg-white text-gray-500"
                  style={{
                    fontFamily: "'Century Gothic', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  or
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full py-5 border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center space-x-2"
              style={{
                fontFamily: "'Century Gothic', sans-serif",
                fontWeight: 300,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.57-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.44-.99-.99-.99z"
                  fill="#4285F4"
                />
              </svg>
              <span>Continue with phone</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full py-5 border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center space-x-2"
              style={{
                fontFamily: "'Century Gothic', sans-serif",
                fontWeight: 300,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full py-5 border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center space-x-2"
              style={{
                fontFamily: "'Century Gothic', sans-serif",
                fontWeight: 300,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"
                  fill="#000000"
                />
                <path
                  d="M15.53 3.83c.869-1.02 1.429-2.44 1.275-3.83-1.233.039-2.724.821-3.606 1.854-.78.896-1.454 2.338-1.274 3.714 1.338.104 2.715-.688 3.605-1.738z"
                  fill="#000000"
                />
              </svg>
              <span>Continue with Apple</span>
            </Button>

            <div className="text-center mt-6">
              <span
                className="text-gray-500 text-sm"
                style={{
                  fontFamily: "'Century Gothic', sans-serif",
                  fontWeight: 300,
                }}
              >
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={handleNavigateToSignup}
                  className="text-[#28B872] font-medium hover:underline"
                  style={{
                    fontFamily: "'Century Gothic', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  signup
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}