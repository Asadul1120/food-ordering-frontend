"use client";

import { useEffect, useState } from "react";
import { useRestaurantSetting } from "@/hooks/restaurant-setting.hook";
import { getRestaurantStatus } from "@/lib/restaurant-hours";

export default function RestaurantStatus() {
  const setting = useRestaurantSetting().data?.data;
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    const firstUpdate = window.setTimeout(updateTime, 0);
    const timer = window.setInterval(updateTime, 15_000);

    return () => {
      window.clearTimeout(firstUpdate);
      window.clearInterval(timer);
    };
  }, []);

  if (!now || !setting?.hours.length) return null;

  const isOpen = getRestaurantStatus(setting, now);

  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${isOpen ? "bg-[#42d98a]" : "bg-[#f46a6a]"}`}
      />
      {isOpen ? "Open now " : "Closed now · pre-orders open · we cook from 10 AM"}
    </span>
  );
}
