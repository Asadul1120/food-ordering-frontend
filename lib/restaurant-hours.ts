import type {
  RestaurantHour,
  RestaurantSetting,
} from "@/types/restaurant-setting.type";

export const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getRestaurantStatus(setting: RestaurantSetting, now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: setting.timezone,
  }).formatToParts(now);

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const day = weekdays.indexOf(weekday);
  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;
  const time = `${hour}:${minute}`;

  const today = setting.hours.find((item) => item.dayOfWeek === day);
  const yesterday = setting.hours.find(
    (item) => item.dayOfWeek === (day + 6) % 7,
  );

  const openHours = (item?: RestaurantHour) =>
    item && !item.isClosed && item.opensAt && item.closesAt
      ? { opensAt: item.opensAt, closesAt: item.closesAt }
      : null;

  const currentHours = openHours(today);
  const previousHours = openHours(yesterday);

  if (
    currentHours &&
    time >= currentHours.opensAt &&
    (currentHours.closesAt < currentHours.opensAt ||
      time < currentHours.closesAt)
  ) {
    return true;
  }

  // An overnight shift can still be open after midnight.
  return Boolean(
    previousHours &&
    previousHours.closesAt < previousHours.opensAt &&
    time < previousHours.closesAt,
  );
}
