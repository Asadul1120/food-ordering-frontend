"use client";

import { useRestaurantSetting } from "@/hooks/restaurant-setting.hook";
import { weekdays } from "@/lib/restaurant-hours";

export default function RestaurantContact() {
  const setting = useRestaurantSetting().data?.data;
  if (!setting) return null;

  const links = [
    { label: setting.phone, url: setting.phone && `tel:${setting.phone}` },
    {
      label: "WhatsApp",
      url:
        setting.whatsappNumber &&
        `https://wa.me/${setting.whatsappNumber.slice(1)}`,
    },
    { label: "Open in Maps", url: setting.googleMapsUrl },
    { label: "Facebook", url: setting.facebookUrl },
  ];

  return (
    <div className="space-y-3 text-sm">
      {setting.address && (
        <p>
          <strong>Address</strong> · {setting.address}
        </p>
      )}
      {setting.deliveryArea && (
        <p>
          <strong>Delivery</strong> · {setting.deliveryArea}
        </p>
      )}

      <details>
        <summary className="cursor-pointer font-semibold">
          Opening hours
        </summary>
        <ul className="mt-2 space-y-1">
          {setting.hours.map(({ dayOfWeek, isClosed, opensAt, closesAt }) => (
            <li key={dayOfWeek}>
              {weekdays[dayOfWeek]} ·{" "}
              {isClosed || !opensAt || !closesAt
                ? "Closed"
                : `${opensAt}–${closesAt}${closesAt < opensAt ? " (next day)" : ""}`}
            </li>
          ))}
        </ul>
      </details>

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {links.map(
          ({ label, url }) =>
            url && (
              <a
                key={label}
                href={url}
                className="underline underline-offset-4"
              >
                {label}
              </a>
            ),
        )}
      </div>
    </div>
  );
}
