// import Link from "next/link";
// import { ShoppingCart, User } from "lucide-react";

// import Logo from "./logo";
// import HeaderSearchForm from "@/components/share/HeaderSearchForm";

// const Header = () => {
//   return (
//     <header className="w-full text-white">
//       {/* Top Bar */}
//       <div className="bg-[#02170f]">
//         <div className="mx-auto flex h-[33px] max-w-[1220px] items-center justify-between px-4 text-xs">
//           <div className="flex items-center gap-2 font-medium">
//             <span className="h-2 w-2 rounded-full bg-[#42d98a]" />

//             <span>Open now · until 11 PM</span>
//           </div>

//           <p className="hidden md:block">
//             Delivery in Savar, Dhaka · bKash · Nagad · Cash on Delivery
//           </p>

//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               className="rounded-full bg-[#1b352b] px-3 py-1 font-medium"
//             >
//               বাংলা
//             </button>

//             <a
//               href="tel:+8801000000000"
//               className="font-semibold text-yellow-400"
//             >
//               Call us
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Main Header */}
//       <div className="bg-[#031f14]">
//         <div className="mx-auto flex min-h-[78px] max-w-[1220px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:h-[78px] md:flex-nowrap md:gap-5 md:py-0">
//           {/* Logo */}
//           <Logo />

//           {/* Search Bar */}
//           <HeaderSearchForm
//             placeholder="Search biryani, coffee, sandwich..."
//           />

//           {/* Right Actions */}
//           <div className="ml-auto flex shrink-0 items-center gap-3 md:gap-6">
//             {/* Home */}
//             <Link
//               href="/"
//               className="hidden items-center gap-2 text-sm font-semibold hover:text-yellow-400 md:flex"
//             >
//               Home
//             </Link>

//             {/* Foods */}
//             <Link
//               href="/"
//               className="hidden items-center gap-2 text-sm font-semibold hover:text-yellow-400 md:flex"
//             >
//               Foods
//             </Link>

//             {/* Contact Us */}
//             <Link
//               href="/"
//               className="hidden items-center gap-2 text-sm font-semibold hover:text-yellow-400 md:flex"
//             >
//               Contact Us
//             </Link>

//             {/* Sign In */}
//             <Link
//               href="/login"
//               className="flex items-center gap-2 text-sm font-semibold hover:text-yellow-400"
//             >
//               <User
//                 size={20}
//                 strokeWidth={2}
//                 aria-hidden="true"
//               />

//               <span className="hidden sm:inline">
//                 Sign in
//               </span>
//             </Link>

//             {/* Shopping Cart */}
//             <Link
//               href="/cart"
//               aria-label="Shopping cart"
//               className="relative flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#294236] bg-[#18382b] hover:bg-[#254a39]"
//             >
//               <ShoppingCart
//                 size={21}
//                 strokeWidth={2}
//                 aria-hidden="true"
//               />

//               {/* Cart Count */}
//               <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffcc00] text-[11px] font-bold text-black">
//                 2
//               </span>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";

import Logo from "./logo";
import CartCount from "./cart-count";
import HeaderSearchForm from "@/components/share/HeaderSearchForm";

const Header = () => {
  return (
    <header className="w-full text-white">
      {/* Top Bar */}
      <div className="bg-[#02170f]">
        <div className="mx-auto flex h-[33px] max-w-[1220px] items-center justify-between px-4 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="h-2 w-2 rounded-full bg-[#42d98a]" />

            <span>Open now · until 11 PM</span>
          </div>

          <p className="hidden md:block">
            Delivery in Savar, Dhaka · bKash · Nagad · Cash on Delivery
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full bg-[#1b352b] px-3 py-1 font-medium"
            >
              বাংলা
            </button>

            <a
              href="tel:+8801000000000"
              className="font-semibold text-yellow-400"
            >
              Call us
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-[#031f14]">
        <div className="mx-auto flex min-h-[78px] max-w-[1220px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:h-[78px] md:flex-nowrap md:gap-5 md:py-0">
          {/* Logo */}
          <Logo />

          {/* Search Bar */}
          <HeaderSearchForm placeholder="Search biryani, coffee, sandwich..." />

          {/* Right Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-3 md:gap-6">
            {/* Home */}
            <Link
              href="/"
              className="hidden items-center gap-2 text-sm font-semibold hover:text-yellow-400 md:flex"
            >
              Home
            </Link>

            {/* Foods */}
            <Link
              href="/foods"
              className="hidden items-center gap-2 text-sm font-semibold hover:text-yellow-400 md:flex"
            >
              Foods
            </Link>

            {/* Contact Us */}
            <Link
              href="/"
              className="hidden items-center gap-2 text-sm font-semibold hover:text-yellow-400 md:flex"
            >
              Contact Us
            </Link>

            {/* Sign In */}
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-semibold hover:text-yellow-400"
            >
              <User size={20} strokeWidth={2} aria-hidden="true" />

              <span className="hidden sm:inline">Sign in</span>
            </Link>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#294236] bg-[#18382b] hover:bg-[#254a39]"
            >
              <ShoppingCart size={21} strokeWidth={2} aria-hidden="true" />

              {/* Dynamic Cart Count */}
              <CartCount />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
