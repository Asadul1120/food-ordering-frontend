"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { useRegister } from "@/hooks/auth.hook";
import { registerSchema } from "@/validation/auth.validation";

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;

    if (data?.message) {
      return data.message;
    }
  }

  return error instanceof Error ? error.message : "Something went wrong";
}

function getFieldError(errors: readonly unknown[]): string | undefined {
  const error = errors[0];

  if (!error) return undefined;

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }

  return "Invalid value";
}

export default function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },

    validators: {
      onSubmit: registerSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        const payload = {
          name: value.name.trim(),
          email: value.email,
          password: value.password,
          ...(value.phone.trim() ? { phone: value.phone.trim() } : {}),
        };

        await registerMutation.mutateAsync(payload);

        toast.success("Account created successfully!");

        router.replace("/");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();

        void form.handleSubmit();
      }}
      className="space-y-[17px]"
    >
      {/* Name */}
      <form.Field name="name">
        {(field) => {
          const error = getFieldError(field.state.meta.errors);

          return (
            <div>
              <label
                htmlFor="name"
                className="mb-[5px] block text-[14px] font-medium text-gray-900"
              >
                Name
              </label>

              <input
                id="name"
                name={field.name}
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "name-error" : undefined}
                className="h-[42px] w-full rounded-[13px] border border-[#d5ddd8] px-4 text-[14px] outline-none transition focus:border-[#086442] focus:ring-2 focus:ring-[#086442]/10"
              />

              {error && (
                <p
                  id="name-error"
                  role="alert"
                  className="mt-1 text-xs text-red-500"
                >
                  {error}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Email */}
      <form.Field name="email">
        {(field) => {
          const error = getFieldError(field.state.meta.errors);

          return (
            <div>
              <label
                htmlFor="email"
                className="mb-[5px] block text-[14px] font-medium text-gray-900"
              >
                Email
              </label>

              <input
                id="email"
                name={field.name}
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "email-error" : undefined}
                className="h-[42px] w-full rounded-[13px] border border-[#d5ddd8] px-4 text-[14px] outline-none transition focus:border-[#086442] focus:ring-2 focus:ring-[#086442]/10"
              />

              {error && (
                <p
                  id="email-error"
                  role="alert"
                  className="mt-1 text-xs text-red-500"
                >
                  {error}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Phone */}
      <form.Field name="phone">
        {(field) => {
          const error = getFieldError(field.state.meta.errors);

          return (
            <div>
              <label
                htmlFor="phone"
                className="mb-[5px] block text-[14px] font-medium text-gray-900"
              >
                Phone
              </label>

              <input
                id="phone"
                name={field.name}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="01XXXXXXXXX"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "phone-error" : undefined}
                className="h-[42px] w-full rounded-[13px] border border-[#d5ddd8] px-4 text-[14px] outline-none transition focus:border-[#086442] focus:ring-2 focus:ring-[#086442]/10"
              />

              {error && (
                <p
                  id="phone-error"
                  role="alert"
                  className="mt-1 text-xs text-red-500"
                >
                  {error}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Password */}
      <form.Field name="password">
        {(field) => {
          const error = getFieldError(field.state.meta.errors);

          return (
            <div>
              <label
                htmlFor="password"
                className="mb-[5px] block text-[14px] font-medium text-gray-900"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "password-error" : undefined}
                  className="h-[42px] w-full rounded-[13px] border border-[#d5ddd8] px-4 pr-16 text-[14px] outline-none transition focus:border-[#086442] focus:ring-2 focus:ring-[#086442]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-[#086442]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {error && (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-1 text-xs text-red-500"
                >
                  {error}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Confirm Password */}
      <form.Field name="confirmPassword">
        {(field) => {
          const error = getFieldError(field.state.meta.errors);

          return (
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-[5px] block text-[14px] font-medium text-gray-900"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name={field.name}
                type="password"
                autoComplete="new-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "confirm-password-error" : undefined}
                className="h-[42px] w-full rounded-[13px] border border-[#d5ddd8] px-4 text-[14px] outline-none transition focus:border-[#086442] focus:ring-2 focus:ring-[#086442]/10"
              />

              {error && (
                <p
                  id="confirm-password-error"
                  role="alert"
                  className="mt-1 text-xs text-red-500"
                >
                  {error}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Submit Button */}
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <button
            type="submit"
            disabled={registerMutation.isPending || isSubmitting}
            className="flex h-[44px] w-full items-center justify-center rounded-full bg-[#086442] text-[14px] font-semibold text-white transition hover:bg-[#064e34] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {registerMutation.isPending
              ? "Creating account..."
              : "Create account"}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
