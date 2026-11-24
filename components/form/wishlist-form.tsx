"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { useCreateWishlist } from "@/hooks/customer.hook";
import { getErrorMessage } from "@/lib/utils";

import type { AuthUser } from "@/types/auth.type";

const fieldClass =
  "mt-1 w-full rounded-[13px] border border-[#d5ddd8] bg-white px-3 py-3 text-sm outline-none focus:border-[#08613f] disabled:opacity-50";

type WishlistFormProps = {
  user?: AuthUser;
};

export default function WishlistForm({ user }: WishlistFormProps) {
  const mutation = useCreateWishlist();

  // Food Information
  const [foodName, setFoodName] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [expectedTime, setExpectedTime] = useState("");

  // Guest Customer Information
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Handle Wishlist Submit
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mutation.isPending) {
      return;
    }

    // Validate Food Name
    if (foodName.trim().length < 2) {
      toast.error("Please enter a valid food name");
      return;
    }

    // Validate Food Description
    if (foodDescription.trim().length < 5) {
      toast.error("Food description must be at least 5 characters");
      return;
    }

    // Convert Bangladesh Time to ISO Date
    const date = new Date(`${expectedTime}:00+06:00`);

    // Validate Expected Time
    if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) {
      toast.error("Choose a future expected time");
      return;
    }

    // Guest Customer Validation
    if (!user) {
      if (name.trim().length < 2) {
        toast.error("Please enter your full name");
        return;
      }

      if (!/^\+?[0-9]{8,15}$/.test(phone.trim())) {
        toast.error("Please enter a valid phone number");
        return;
      }

      if (address.trim().length < 8) {
        toast.error("Please enter a valid delivery address");
        return;
      }
    }

    try {
      // Create Wishlist
      const response = await mutation.mutateAsync({
        foodName: foodName.trim(),
        foodDescription: foodDescription.trim(),
        expectedTime: date.toISOString(),

        // Send personal information only for guests
        ...(!user && {
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerAddress: address.trim(),

          ...(email.trim() && {
            customerEmail: email.trim(),
          }),
        }),
      });

      toast.success(response.message || "Wishlist submitted successfully");

      // Reset Food Information
      setFoodName("");
      setFoodDescription("");
      setExpectedTime("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[17px] border border-[#edf0ec] bg-white p-6 shadow-sm"
    >
      {/* Form Heading */}
      <div>
        <h2 className="text-lg font-bold text-[#052b24]">
          Request a food item
        </h2>

        <p className="mt-1 text-sm text-[#66716d]">
          Tell us what you would like to eat and when you need it.
        </p>
      </div>

      {/* Guest Customer Information */}
      {!user && (
        <div className="space-y-4">
          <h3 className="border-b border-[#edf0ec] pb-3 text-sm font-semibold text-[#052b24]">
            Personal Information
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Customer Name */}
            <label className="block text-sm font-medium">
              Full Name
              <span className="ml-1 text-red-500">*</span>
              <input
                type="text"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                value={name}
                disabled={mutation.isPending}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                className={fieldClass}
              />
            </label>

            {/* Customer Phone */}
            <label className="block text-sm font-medium">
              Phone Number
              <span className="ml-1 text-red-500">*</span>
              <input
                type="tel"
                required
                pattern="[+]?[0-9]{8,15}"
                autoComplete="tel"
                value={phone}
                disabled={mutation.isPending}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter your phone number"
                className={fieldClass}
              />
            </label>
          </div>

          {/* Customer Email */}
          <label className="block text-sm font-medium">
            Email Address
            <span className="ml-1 font-normal text-[#73817b]">(Optional)</span>
            <input
              type="email"
              maxLength={254}
              autoComplete="email"
              value={email}
              disabled={mutation.isPending}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              className={fieldClass}
            />
          </label>

          {/* Customer Delivery Address */}
          <label className="block text-sm font-medium">
            Delivery Address
            <span className="ml-1 text-red-500">*</span>
            <textarea
              required
              rows={3}
              minLength={8}
              maxLength={700}
              autoComplete="street-address"
              value={address}
              disabled={mutation.isPending}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Enter house, road, area and city"
              className={`${fieldClass} resize-y`}
            />
          </label>
        </div>
      )}

      {/* Food Information */}
      <div className="space-y-4">
        {!user && (
          <h3 className="border-b border-[#edf0ec] pb-3 text-sm font-semibold text-[#052b24]">
            Food Information
          </h3>
        )}

        {/* Food Name */}
        <label className="block text-sm font-medium">
          Food Name
          <span className="ml-1 text-red-500">*</span>
          <input
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={foodName}
            disabled={mutation.isPending}
            onChange={(event) => setFoodName(event.target.value)}
            placeholder="Enter your desired food name"
            className={fieldClass}
          />
        </label>

        {/* Food Description */}
        <label className="block text-sm font-medium">
          Food Description
          <span className="ml-1 text-red-500">*</span>
          <textarea
            required
            rows={4}
            minLength={5}
            maxLength={1000}
            value={foodDescription}
            disabled={mutation.isPending}
            onChange={(event) => setFoodDescription(event.target.value)}
            placeholder="Describe the food item you would like to have..."
            className={`${fieldClass} resize-y`}
          />
          <span className="mt-1 block text-right text-xs font-normal text-[#73817b]">
            {foodDescription.length}/1000
          </span>
        </label>

        {/* Expected Date & Time */}
        <label className="block text-sm font-medium">
          Expected Date & Time
          <span className="ml-1 text-red-500">*</span>
          <input
            type="datetime-local"
            required
            step={60}
            value={expectedTime}
            disabled={mutation.isPending}
            onChange={(event) => setExpectedTime(event.target.value)}
            className={fieldClass}
          />
          <span className="mt-1 block text-xs font-normal text-[#73817b]">
            Please select your expected date and time (Bangladesh time).
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="border-t border-[#edf0ec] pt-4">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-full bg-[#08613f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#064d34] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {mutation.isPending ? "Submitting..." : "Submit Wishlist"}
        </button>
      </div>
    </form>
  );
}
