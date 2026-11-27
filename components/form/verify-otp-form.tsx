"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "@tanstack/react-form";

import { ArrowLeft, LoaderCircle, ShieldCheck } from "lucide-react";

import { toast } from "sonner";

import { useVerifyLoginOtp } from "@/hooks/auth.hook";

import { getErrorMessage, getFieldError, roleRoutes } from "@/lib/utils";

import { verifyOtpSchema } from "@/validation/auth.validation";

interface VerifyOtpFormProps {
  email: string;
}

export default function VerifyOtpForm({ email }: VerifyOtpFormProps) {
  const router = useRouter();

  const verifyOtpMutation = useVerifyLoginOtp();

  const form = useForm({
    defaultValues: {
      otp: "",
    },

    validators: {
      onSubmit: verifyOtpSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        const res = await verifyOtpMutation.mutateAsync({
          email,
          otp: value.otp,
        });

        if (!res.data?.role) {
          throw new Error("OTP verification could not be completed.");
        }

        toast.success(res.message || "OTP verified successfully");

        router.replace(roleRoutes(res.data.role));
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
  });

  return (
    <div>
      {/* Icon */}
      <div className="mb-6 flex h-[48px] w-[48px] items-center justify-center rounded-2xl bg-[#eaf4ee] text-[#086442]">
        <ShieldCheck size={25} strokeWidth={1.8} />
      </div>

      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-[29px] font-bold tracking-tight text-[#063c2b]">
          Verify your login
        </h2>

        <p className="mt-2 text-[13px] leading-5 text-[#747474]">
          We sent a 6-digit verification code to
          <span className="mt-1 block break-all font-semibold text-[#263b31]">
            {email}
          </span>
        </p>
      </div>

      {/* OTP Form */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();

          void form.handleSubmit();
        }}
        className="space-y-[17px]"
      >
        <form.Field name="otp">
          {(field) => {
            const error = getFieldError(field.state.meta.errors);

            return (
              <div>
                <label
                  htmlFor="otp"
                  className="mb-[7px] block text-[14px] font-medium text-[#111827]"
                >
                  Verification code
                </label>

                <input
                  id="otp"
                  name={field.name}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  maxLength={6}
                  placeholder="000000"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "otp-error" : "otp-help"}
                  className="h-[54px] w-full rounded-[13px] border border-[#d5ddd8] bg-white px-4 text-center text-[23px] font-bold tracking-[0.55em] text-[#063c2b] outline-none transition placeholder:font-normal placeholder:tracking-[0.45em] placeholder:text-[#c3ccc6] focus:border-[#086442] focus:ring-2 focus:ring-[#086442]/10"
                />

                {error ? (
                  <p
                    id="otp-error"
                    role="alert"
                    className="mt-1 text-xs text-red-500"
                  >
                    {error}
                  </p>
                ) : (
                  <p id="otp-help" className="mt-2 text-[12px] text-[#858585]">
                    Enter the 6-digit code. It expires in 5 minutes.
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Submit Button */}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => {
            const isPending = verifyOtpMutation.isPending || isSubmitting;

            return (
              <button
                type="submit"
                disabled={isPending}
                className="flex h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#086442] text-[14px] font-semibold text-white transition duration-200 hover:bg-[#064e34] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending && (
                  <LoaderCircle size={17} className="animate-spin" />
                )}

                {isPending ? "Verifying..." : "Verify and sign in"}
              </button>
            );
          }}
        </form.Subscribe>
      </form>

      {/* Bottom Section */}
      <div className="mt-6 border-t border-[#edf0ed] pt-4">
        <p className="text-center text-[12px] leading-5 text-[#777]">
          Didn&apos;t receive the code or has it expired?
          <span className="font-medium text-[#4e5c54]">
            {" "}
            Go back and sign in again to request a new code.
          </span>
        </p>

        <Link
          href="/login"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 text-[13px] font-semibold text-[#086442] transition hover:text-[#043b29]"
        >
          <ArrowLeft size={15} />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
