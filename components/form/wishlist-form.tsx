"use client";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useCreateWishlist } from "@/hooks/customer.hook";
import { getErrorMessage } from "@/lib/utils";
import type { AuthUser } from "@/types/auth.type";

const fieldClass =
  "mt-1 w-full rounded-[13px] border border-[#d5ddd8] bg-white px-3 py-3 text-sm outline-none focus:border-[#08613f]";
export default function WishlistForm({ user }: { user?: AuthUser }) {
  const mutation = useCreateWishlist();
  const [foodName, setFoodName] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [expectedTime, setExpectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The business operates in Bangladesh. Interpret the input as Dhaka time.
    const date = new Date(`${expectedTime}:00+06:00`);
    if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) {
      toast.error("Choose a future expected time");
      return;
    }
    try {
      const response = await mutation.mutateAsync({
        foodName: foodName.trim(),
        foodDescription: foodDescription.trim(),
        expectedTime: date.toISOString(),
        ...(!user && {
          customerName: name.trim(),
          customerPhone: phone.trim(),
          ...(email.trim() && { customerEmail: email.trim() }),
        }),
      });
      toast.success(response.message);
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
      className="space-y-4 rounded-[17px] border border-[#edf0ec] bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-bold">Request a food item</h2>
      <p className="text-sm text-[#66716d]">
        Tell us what you would like to eat and when you need it.
      </p>
      {!user && (
        <>
          <label className="block text-sm font-medium">
            Full name
            <input
              required
              minLength={2}
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-medium">
            Phone
            <input
              required
              type="tel"
              pattern="[+]?[0-9]{8,15}"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-medium">
            Email (optional)
            <input
              type="email"
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
            />
          </label>
        </>
      )}
      <label className="block text-sm font-medium">
        Food Name
        <input
          required
          minLength={2}
          maxLength={100}
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm font-medium">
        Food Description
        <textarea
          required
          rows={4}
          minLength={5}
          maxLength={1000}
          value={foodDescription}
          onChange={(e) => setFoodDescription(e.target.value)}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm font-medium">
        Expected Time (Bangladesh time)
        <input
          required
          type="datetime-local"
          value={expectedTime}
          onChange={(e) => setExpectedTime(e.target.value)}
          className={fieldClass}
        />
      </label>
      <button
        disabled={mutation.isPending}
        className="rounded-full bg-[#08613f] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {mutation.isPending ? "Submitting..." : "Submit Wishlist"}
      </button>
    </form>
  );
}
