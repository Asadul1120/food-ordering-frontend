
import Link from "next/link";
import { Leaf, Sparkles } from "lucide-react";

import LoginForm from "@/components/form/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f0] p-4 sm:p-6">
      <div className="grid w-full max-w-[896px] overflow-hidden rounded-[24px] bg-white shadow-[0_18px_35px_rgba(10,55,35,0.14)] md:min-h-[448px] md:grid-cols-2">
        {/* LEFT SIDE */}
        <section className="flex min-h-[280px] flex-col justify-between bg-[linear-gradient(145deg,#032719_0%,#07583b_100%)] px-8 py-9 text-white sm:px-10 md:min-h-[448px]">
          {/* Brand Logo */}
          <div>
            <div className="relative inline-flex items-center">
              <Sparkles
                size={15}
                className="absolute -right-3 -top-2 text-yellow-400"
              />

              <span className="text-[31px] font-black italic tracking-tight">
                Freshly
                <span className="text-lime-400">a</span>
              </span>

              <Leaf
                size={20}
                className="ml-1 -mt-4 rotate-[-25deg] text-lime-400"
              />
            </div>

            <p className="ml-7 -mt-1 text-[8px] font-bold tracking-[2px] text-lime-300">
              FUSION CAFE
            </p>
          </div>

          {/* Welcome Content */}
          <div className="my-8 max-w-[370px]">
            <h1 className="text-[28px] font-bold leading-[1.35] tracking-tight sm:text-[29px]">
              Welcome back to
              <br />
              <span className="text-[#ffd83d]">
                good food.
              </span>
            </h1>

            <p className="mt-4 text-[14px] leading-[21px] text-gray-100">
              Sign in to track orders, save addresses
              and reorder your favorites faster.
            </p>
          </div>

          {/* Footer */}
          <p className="text-[12px] font-normal text-white/65">
            Savar, Dhaka · 3 PM–11 PM
          </p>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex flex-col justify-center bg-white px-8 py-10 sm:px-10 md:px-10">
          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-[29px] font-bold tracking-tight text-[#063c2b]">
              Sign in
            </h2>

            <p className="mt-1 text-[13px] text-[#747474]">
              Welcome back. Enter your details to continue.
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Bottom Links */}
          <div className="mt-[21px] flex items-center justify-between gap-3">
            <Link
              href="/forgot-password"
              className="text-[13px] font-medium text-[#086442] transition hover:text-[#043b29]"
            >
              Forgot password?
            </Link>

            <Link
              href="/register"
              className="text-[13px] font-medium text-[#086442] transition hover:text-[#043b29]"
            >
              Create an account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
