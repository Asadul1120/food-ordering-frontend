"use client";

import Image from "next/image";
import Link from "next/link";
import { useRestaurantSetting } from "@/hooks/restaurant-setting.hook";

export default function Logo() {
  const setting = useRestaurantSetting().data?.data;
  const name = setting?.name ?? "";

  return (
    <Link
      href="/"
      aria-label={`${name} Home`}
      className="inline-flex shrink-0 flex-col items-center"
    >
      {setting?.logoUrl ? (
        <Image
          src={setting.logoUrl}
          alt={name}
          width={200}
          height={58}
          className="h-[58px] w-auto max-w-[200px]  object-contain"
        />
      ) : (
        <span className="font-serif text-2xl font-bold text-white">{name}</span>
      )}

      {setting?.tagline && (
        <span className="mt-1 text-xs text-yellow-400">{setting.tagline}</span>
      )}
    </Link>
  );
}
