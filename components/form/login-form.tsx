// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "@tanstack/react-form";
// import { toast } from "sonner";

// import { useLogin } from "@/hooks/auth.hook";
// import { loginSchema } from "@/validation/auth.validation";
// import { getErrorMessage, getFieldError, roleRoutes } from "@/lib/utils";

// export default function LoginForm() {
//   const router = useRouter();
//   const loginMutation = useLogin();

//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const form = useForm({
//     defaultValues: {
//       email: "",
//       password: "",
//     },

//     validators: {
//       onSubmit: loginSchema,
//     },

//     onSubmit: async ({ value }) => {
//       try {
//         const res = await loginMutation.mutateAsync(value);

//         toast.success(res.message);
//         router.push(roleRoutes(res.data.role));
        
//       } catch (error) {
//         toast.error(getErrorMessage(error));
//       }
//     },
//   });

//   return (
//     <form
//       onSubmit={(event) => {
//         event.preventDefault();
//         event.stopPropagation();

//         void form.handleSubmit();
//       }}
//       className="space-y-[16px]"
//     >
//       {/* Email */}
//       <form.Field name="email">
//         {(field) => {
//           const error = getFieldError(field.state.meta.errors);

//           return (
//             <div>
//               <label
//                 htmlFor="email"
//                 className="mb-[5px] block text-[14px] font-medium text-[#111827]"
//               >
//                 Email
//               </label>

//               <input
//                 id="email"
//                 name={field.name}
//                 type="email"
//                 autoComplete="email"
//                 placeholder=""
//                 value={field.state.value}
//                 onBlur={field.handleBlur}
//                 onChange={(event) => field.handleChange(event.target.value)}
//                 aria-invalid={Boolean(error)}
//                 aria-describedby={error ? "email-error" : undefined}
//                 className="h-[42px] w-full rounded-[13px] border border-[#d5ddd8] bg-white px-3 text-[14px] text-gray-900 outline-none transition focus:border-[#086442] focus:ring-2 focus:ring-[#086442]/10"
//               />

//               {error && (
//                 <p
//                   id="email-error"
//                   role="alert"
//                   className="mt-1 text-xs text-red-500"
//                 >
//                   {error}
//                 </p>
//               )}
//             </div>
//           );
//         }}
//       </form.Field>

//       {/* Password */}
//       <form.Field name="password">
//         {(field) => {
//           const error = getFieldError(field.state.meta.errors);

//           return (
//             <div>
//               <label
//                 htmlFor="password"
//                 className="mb-[5px] block text-[14px] font-medium text-[#111827]"
//               >
//                 Password
//               </label>

//               <div className="relative">
//                 <input
//                   id="password"
//                   name={field.name}
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="current-password"
//                   value={field.state.value}
//                   onBlur={field.handleBlur}
//                   onChange={(event) => field.handleChange(event.target.value)}
//                   aria-invalid={Boolean(error)}
//                   aria-describedby={error ? "password-error" : undefined}
//                   className="h-[42px] w-full rounded-[13px] border border-[#d5ddd8] bg-white px-3 pr-16 text-[14px] text-gray-900 outline-none transition focus:border-[#086442] focus:ring-2 focus:ring-[#086442]/10"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((previous) => !previous)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                   aria-pressed={showPassword}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-[#086442] hover:text-[#043b29]"
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </button>
//               </div>

//               {error && (
//                 <p
//                   id="password-error"
//                   role="alert"
//                   className="mt-1 text-xs text-red-500"
//                 >
//                   {error}
//                 </p>
//               )}
//             </div>
//           );
//         }}
//       </form.Field>

//       {/* Remember Me */}
//       <div className="flex items-center gap-2 pt-[1px]">
//         <input
//           id="remember"
//           type="checkbox"
//           checked={rememberMe}
//           onChange={(event) => setRememberMe(event.target.checked)}
//           className="h-[13px] w-[13px] cursor-pointer accent-[#086442]"
//         />

//         <label
//           htmlFor="remember"
//           className="cursor-pointer text-[13px] text-[#555]"
//         >
//           Remember me
//         </label>
//       </div>

//       {/* Submit Button */}
//       <button
//         type="submit"
//         disabled={loginMutation.isPending}
//         className="flex h-[44px] w-full items-center justify-center rounded-full bg-[#086442] text-[14px] font-semibold text-white transition duration-200 hover:bg-[#064e34] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
//       >
//         {loginMutation.isPending ? "Signing in..." : "Sign in"}
//       </button>
//     </form>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { useLogin } from "@/hooks/auth.hook";
import { loginSchema } from "@/validation/auth.validation";

import {
  getErrorMessage,
  getFieldError,
  roleRoutes,
} from "@/lib/utils";

export default function LoginForm() {
  const router = useRouter();

  const loginMutation = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    validators: {
      onSubmit: loginSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        const res = await loginMutation.mutateAsync(value);

        // ADMIN / STAFF OTP verification
        if (res.data?.requiresOtp) {
          toast.success("OTP verification required");

          router.push(
            `/verify-otp?email=${encodeURIComponent(
              res.data.email,
            )}`,
          );

          return;
        }

        // Normal user login
        if (!res.data?.role) {
          throw new Error(
            "Unable to complete login. Please try again.",
          );
        }

        toast.success(res.message);

        router.push(roleRoutes(res.data.role));

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
      className="space-y-[16px]"
    >
      {/* Email */}
      <form.Field name="email">
        {(field) => {
          const error = getFieldError(
            field.state.meta.errors,
          );

          return (
            <div>
              <label
                htmlFor="email"
                className="mb-[5px] block text-[14px] font-medium text-[#111827]"
              >
                Email
              </label>

              <input
                id="email"
                name={field.name}
                type="email"
                autoComplete="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error ? "email-error" : undefined
                }
                className="h-[42px] w-full rounded-[13px] border border-[#d5ddd8] bg-white px-3 text-[14px] text-gray-900 outline-none transition focus:border-[#086442] focus:ring-2 focus:ring-[#086442]/10"
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

      {/* Password */}
      <form.Field name="password">
        {(field) => {
          const error = getFieldError(
            field.state.meta.errors,
          );

          return (
            <div>
              <label
                htmlFor="password"
                className="mb-[5px] block text-[14px] font-medium text-[#111827]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  aria-invalid={Boolean(error)}
                  aria-describedby={
                    error ? "password-error" : undefined
                  }
                  className="h-[42px] w-full rounded-[13px] border border-[#d5ddd8] bg-white px-3 pr-16 text-[14px] text-gray-900 outline-none transition focus:border-[#086442] focus:ring-2 focus:ring-[#086442]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-[#086442] hover:text-[#043b29]"
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

      {/* Remember Me */}
      <div className="flex items-center gap-2 pt-[1px]">
        <input
          id="remember"
          type="checkbox"
          checked={rememberMe}
          onChange={(event) =>
            setRememberMe(event.target.checked)
          }
          className="h-[13px] w-[13px] cursor-pointer accent-[#086442]"
        />

        <label
          htmlFor="remember"
          className="cursor-pointer text-[13px] text-[#555]"
        >
          Remember me
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="flex h-[44px] w-full items-center justify-center rounded-full bg-[#086442] text-[14px] font-semibold text-white transition duration-200 hover:bg-[#064e34] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loginMutation.isPending
          ? "Signing in..."
          : "Sign in"}
      </button>
    </form>
  );
}