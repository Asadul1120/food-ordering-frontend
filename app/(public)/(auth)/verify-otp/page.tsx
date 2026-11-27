"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  Leaf,
  ShieldCheck,
  Sparkles,
  LoaderCircle,
} from "lucide-react";

import VerifyOtpForm from "@/components/form/verify-otp-form";

function VerifyOtpPageContent() {
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f0] p-4 sm:p-6">
      <div className="grid w-full max-w-[896px] overflow-hidden rounded-[24px] bg-white shadow-[0_18px_35px_rgba(10,55,35,0.14)] md:min-h-[448px] md:grid-cols-2">

        {/* LEFT SIDE */}
        <section className="flex min-h-[280px] flex-col justify-between bg-[linear-gradient(145deg,#032719_0%,#07583b_100%)] px-8 py-9 text-white sm:px-10 md:min-h-[448px]">

          {/* Logo */}
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

          {/* Content */}
          <div className="my-8 max-w-[370px]">
            <div className="mb-5 flex h-[48px] w-[48px] items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lime-300">
              <ShieldCheck size={25} strokeWidth={1.7} />
            </div>

            <h1 className="text-[28px] font-bold leading-[1.35] tracking-tight sm:text-[29px]">
              One more step for
              <br />
              <span className="text-[#ffd83d]">
                a safer account.
              </span>
            </h1>

            <p className="mt-4 text-[14px] leading-[21px] text-gray-100">
              Verify it&apos;s really you before continuing.
              This extra layer helps keep your Freshlya
              account secure.
            </p>
          </div>

          {/* Footer */}
          <p className="text-[12px] font-normal text-white/65">
            Savar, Dhaka · 3 PM–11 PM
          </p>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex flex-col justify-center bg-white px-8 py-10 sm:px-10 md:px-10">
          {email ? (
            <VerifyOtpForm email={email} />
          ) : (
            <div>
              <div className="mb-6 flex h-[48px] w-[48px] items-center justify-center rounded-2xl bg-[#eaf4ee] text-[#086442]">
                <ShieldCheck size={25} />
              </div>

              <h2 className="text-[29px] font-bold tracking-tight text-[#063c2b]">
                Verification link missing
              </h2>

              <p className="mt-2 text-[13px] leading-5 text-[#747474]">
                We couldn&apos;t find the email address for this
                verification. Please return to the sign-in
                page and try again.
              </p>

              <Link
                href="/login"
                className="mt-6 flex h-[44px] w-full items-center justify-center rounded-full bg-[#086442] text-[14px] font-semibold text-white transition hover:bg-[#064e34]"
              >
                Back to sign in
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

// Suspense fallback
function VerifyOtpLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f0] p-4">
      <div className="flex flex-col items-center gap-3 rounded-[20px] bg-white p-10 shadow-sm">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#086442]" />

        <p className="text-sm text-[#747474]">
          Loading verification page...
        </p>
      </div>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<VerifyOtpLoading />}>
      <VerifyOtpPageContent />
    </Suspense>
  );
}