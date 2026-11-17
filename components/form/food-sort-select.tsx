"use client";

type FoodSortSelectProps = {
  value: string;

  options: {
    value: string;
    label: string;
  }[];

  onChange: (value: string) => void;
};

export default function FoodSortSelect({
  value,
  options,
  onChange,
}: FoodSortSelectProps) {
  return (
    <select
      id="food-sort"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-[38px] w-[186px] rounded-full border border-[#d5ddd8] bg-white px-4 outline-none focus:border-[#08613f]"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
