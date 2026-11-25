"use client";

import type { FormEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  useRestaurantSetting,
  useSaveRestaurantSetting,
} from "@/hooks/restaurant-setting.hook";
import { weekdays } from "@/lib/restaurant-hours";
import { getErrorMessage } from "@/lib/utils";

const fields = [
  { name: "name", label: "Restaurant name", max: 100 },
  { name: "tagline", label: "Tagline", max: 120 },
  { name: "phone", label: "Phone (+880…)", max: 16, type: "tel" },
  { name: "whatsappNumber", label: "WhatsApp (+880…)", max: 16, type: "tel" },
  { name: "address", label: "Address", max: 300 },
  { name: "deliveryArea", label: "Delivery area", max: 250 },
  { name: "googleMapsUrl", label: "Google Maps link", max: 500, type: "url" },
  { name: "facebookUrl", label: "Facebook link", max: 500, type: "url" },
] as const;

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2";

export default function RestaurantSettingsForm() {
  const query = useRestaurantSetting();
  const save = useSaveRestaurantSetting();
  const setting = query.data?.data;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const body = new FormData(form);

    const hours = weekdays.map((day, dayOfWeek) => {
      const dayHours = {
        dayOfWeek,
        isClosed: body.has(`closed-${day}`),
        opensAt: String(body.get(`open-${day}`) || "") || null,
        closesAt: String(body.get(`close-${day}`) || "") || null,
      };

      body.delete(`closed-${day}`);
      body.delete(`open-${day}`);
      body.delete(`close-${day}`);

      return dayHours;
    });

    body.set("hours", JSON.stringify(hours));

    const image = body.get("image");
    if (image instanceof File && !image.size) body.delete("image");

    try {
      const response = await save.mutateAsync(body);
      const imageInput = form.elements.namedItem("image");

      if (imageInput instanceof HTMLInputElement) imageInput.value = "";

      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  if (query.isPending) return <p>Loading restaurant settings…</p>;

  if (query.isError && !query.data) {
    return (
      <div role="alert">
        {getErrorMessage(query.error)}{" "}
        <button className="underline" onClick={() => void query.refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-5 shadow-sm">
      <fieldset disabled={save.isPending} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} className="grid gap-1 text-sm font-medium">
              {field.label}
              <input
                name={field.name}
                type={"type" in field ? field.type : "text"}
                defaultValue={setting?.[field.name] ?? ""}
                required={field.name === "name"}
                maxLength={field.max}
                className={inputClass}
              />
            </label>
          ))}
        </div>

        <label className="grid gap-1 text-sm font-medium">
          Restaurant description
          <textarea
            name="description"
            defaultValue={setting?.description ?? ""}
            maxLength={600}
            rows={3}
            className={inputClass}
          />
        </label>

        <div className="space-y-2 rounded-lg border p-4">
          {setting?.logoUrl && (
            <Image
              src={setting.logoUrl}
              alt="Current logo"
              width={160}
              height={60}
              className="h-14 w-auto object-contain"
            />
          )}
          <label className="grid gap-2 text-sm font-medium">
            Restaurant logo (PNG, JPG or WebP, up to 5 MB)
            <input
              name="image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
            />
          </label>
        </div>

        <fieldset className="space-y-3">
          <legend className="mb-2 font-semibold">
            Opening hours (Bangladesh time)
          </legend>

          {weekdays.map((day, index) => {
            const hour = setting?.hours.find(
              (item) => item.dayOfWeek === index,
            );

            return (
              <div
                key={day}
                className="flex flex-wrap items-center gap-3 border-t py-2 text-sm"
              >
                <span className="w-24 font-medium">{day}</span>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={`closed-${day}`}
                    defaultChecked={hour?.isClosed ?? true}
                  />
                  Closed
                </label>
                <label>
                  Opens{" "}
                  <input
                    type="time"
                    name={`open-${day}`}
                    defaultValue={hour?.opensAt ?? ""}
                  />
                </label>
                <label>
                  Closes{" "}
                  <input
                    type="time"
                    name={`close-${day}`}
                    defaultValue={hour?.closesAt ?? ""}
                  />
                </label>
              </div>
            );
          })}
        </fieldset>

        <button
          type="submit"
          className="rounded-full bg-[#08613f] px-5 py-2.5 font-semibold text-white disabled:opacity-50"
        >
          {save.isPending ? "Saving…" : "Save settings"}
        </button>
      </fieldset>
    </form>
  );
}
