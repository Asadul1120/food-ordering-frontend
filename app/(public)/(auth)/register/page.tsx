
import Link from "next/link";
import { Check, Leaf, Sparkles } from "lucide-react";

import RegisterForm from "@/components/form/register-form";

const benefits = [
  "Track your orders live",
  "Save addresses for faster checkout",
  "Reorder your favorites in a tap",
];

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f0] p-4 sm:p-6">
      <div className="grid w-full max-w-[896px] overflow-hidden rounded-[24px] bg-white shadow-[0_18px_35px_rgba(10,55,35,0.14)] md:min-h-[658px] md:grid-cols-2">

        {/* LEFT SIDE */}
        <section className="flex flex-col justify-between bg-[linear-gradient(145deg,#032719_0%,#07583b_100%)] px-8 py-9 text-white sm:px-10 md:min-h-[658px]">

          {/* Brand Logo */}
          <div>
            <div className="relative inline-flex items-center">
              <Sparkles
                size={15}
                className="absolute -right-3 -top-2 text-yellow-400"
                aria-hidden="true"
              />

              <span className="text-[31px] font-black italic tracking-tight">
                Freshly
                <span className="text-lime-400">a</span>
              </span>

              <Leaf
                size={20}
                className="ml-1 -mt-4 rotate-[-25deg] text-lime-400"
                aria-hidden="true"
              />
            </div>

            <p className="ml-7 -mt-1 text-[8px] font-bold tracking-[2px] text-lime-300">
              FUSION CAFE
            </p>
          </div>

          {/* Welcome Content */}
          <div className="my-10 max-w-[370px]">
            <h1 className="text-[28px] font-bold leading-[1.35] tracking-tight">
              Join us for
              <br />
              <span className="text-[#ffd83d]">
                fresh moments.
              </span>
            </h1>

            <div className="mt-5 space-y-3">
              {benefits.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2"
                >
                  <Check
                    size={17}
                    className="shrink-0 text-[#ffd83d]"
                    strokeWidth={2}
                    aria-hidden="true"
                  />

                  <p className="text-[14px] text-gray-100">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-[12px] text-white/65">
            Savar, Dhaka · 3 PM–11 PM
          </p>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex flex-col justify-center bg-white px-8 py-10 sm:px-10 md:px-10">

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-[29px] font-bold tracking-tight text-[#063c2b]">
              Create your account
            </h2>

            <p className="mt-1 text-[13px] text-[#747474]">
              It only takes a minute.
            </p>
          </div>

          {/* Registration Form */}
          <RegisterForm />

          {/* Login Link */}
          <p className="mt-[21px] text-[13px] text-gray-700">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#086442] transition hover:text-[#043b29]"
            >
              Sign in
            </Link>
          </p>

        </section>
      </div>
    </main>
  );
}
