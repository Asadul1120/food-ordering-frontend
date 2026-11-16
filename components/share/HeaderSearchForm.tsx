
import { Search } from "lucide-react";

type HeaderSearchFormProps = {
  placeholder: string;
};

export default function HeaderSearchForm({
  placeholder,
}: HeaderSearchFormProps) {
  return (
    <form
      action="/search"
      method="GET"
      role="search"
      className="order-3 flex h-[42px] basis-full items-center rounded-full bg-white px-1.5 pl-4 md:order-none md:w-full md:max-w-[576px] md:basis-auto"
    >
      <input
        type="text"
        name="q"
        aria-label="Search foods"
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-500"
      />

      <button
        type="submit"
        aria-label="Search"
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#ffcc00] text-black hover:bg-yellow-400"
      >
        <Search
          size={19}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>
    </form>
  );
}
