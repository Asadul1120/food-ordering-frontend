"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Heart } from "lucide-react";

import Logo from "./logo";
import CartCount from "./cart-count";
import HeaderAccount from "./header-account";
import MobileMenu from "./mobile-menu";
import HeaderSearchForm from "@/components/share/HeaderSearchForm";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

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
          {/* Mobile Menu - Left Side */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
            className="flex shrink-0 items-center justify-center text-white md:hidden"
          >
            <Menu size={26} strokeWidth={2} />
          </button>

          {/* Logo - Original Design */}
          <Logo />

          {/* Search Bar - Original Design */}
          <HeaderSearchForm placeholder="Search biryani, coffee, sandwich..." />

          {/* Right Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-3 md:gap-6">
            {/* Home - Desktop Only */}
            <Link
              href="/"
              className="hidden items-center gap-2 text-sm font-semibold hover:text-yellow-400 md:flex"
            >
              Home
            </Link>

            {/* Foods - Desktop Only */}
            <Link
              href="/foods"
              className="hidden items-center gap-2 text-sm font-semibold hover:text-yellow-400 md:flex"
            >
              Foods
            </Link>
            {/* Wishlist - Desktop Only */}
            <Link
              href="/wishlist"
              className="hidden items-center gap-2 text-sm font-semibold hover:text-yellow-400 md:flex"
            >
            
              Wishlist
            </Link>
      
            {/* User Dropdown - Desktop Only */}
            <div className="hidden md:block">
              <HeaderAccount />
            </div>

            {/* Shopping Cart - Original Design */}
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#294236] bg-[#18382b] hover:bg-[#254a39]"
            >
              <ShoppingCart size={21} strokeWidth={2} aria-hidden="true" />

              <CartCount />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && <MobileMenu onClose={closeMenu} />}
    </header>
  );
};

export default Header;
