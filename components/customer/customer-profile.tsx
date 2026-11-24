"use client";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useGetMe } from "@/hooks/auth.hook";

import type { AuthUser } from "@/types/auth.type";
import { getErrorMessage } from "@/lib/utils";
import { useUpdateMyProfile } from "@/hooks/customer.hook";
const fieldClass =
  "mt-1 w-full rounded-[13px] border border-[#d5ddd8] bg-white px-3 py-3 text-sm outline-none focus:border-[#08613f]";
function ProfileForm({
  user,
  addressOnly,
}: {
  user: AuthUser;
  addressOnly: boolean;
}) {
  const mutation = useUpdateMyProfile();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [address, setAddress] = useState(user.profile?.deliveryAddress ?? "");
  const [city, setCity] = useState(user.profile?.city ?? "");
  const [area, setArea] = useState(user.profile?.area ?? "");
  const [postalCode, setPostalCode] = useState(user.profile?.postalCode ?? "");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await mutation.mutateAsync(
        addressOnly
          ? {
              deliveryAddress: address.trim() || null,
              city: city.trim() || null,
              area: area.trim() || null,
              postalCode: postalCode.trim() || null,
            }
          : { name: name.trim(), ...(phone.trim() && { phone: phone.trim() }) },
      );
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-[17px] border border-[#edf0ec] bg-white p-6 shadow-sm"
    >
      {addressOnly ? (
        <>
          <p className="text-sm text-[#66716d]">
            Save your default delivery address. Leave fields empty to remove the
            saved address.
          </p>
          <label className="block text-sm font-medium">
            Delivery address
            <textarea
              rows={3}
              minLength={8}
              maxLength={500}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-medium">
            City
            <input
              minLength={2}
              maxLength={80}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-medium">
            Area
            <input
              minLength={2}
              maxLength={100}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-medium">
            Postal code
            <input
              minLength={3}
              maxLength={10}
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className={fieldClass}
            />
          </label>
        </>
      ) : (
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
            Email
            <input
              readOnly
              value={user.email}
              className={`${fieldClass} bg-gray-50`}
            />
          </label>
          <label className="block text-sm font-medium">
            Phone
            <input
              type="tel"
              pattern="[+]?[0-9]{8,15}"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={fieldClass}
            />
          </label>
          <p className="text-xs text-[#66716d]">
            Leave phone empty to keep the current number.
          </p>
        </>
      )}
      <button
        disabled={mutation.isPending}
        className="rounded-full bg-[#08613f] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {mutation.isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
export default function CustomerProfile({
  addressOnly = false,
}: {
  addressOnly?: boolean;
}) {
  const user = useGetMe().data?.data;
  if (!user) return null;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {addressOnly ? "Addresses" : "Profile"}
      </h1>
      <ProfileForm
        key={`${user.id}-${addressOnly}`}
        user={user}
        addressOnly={addressOnly}
      />
    </div>
  );
}
