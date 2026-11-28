"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Heart } from "lucide-react";

import Logo from "./logo";
import CartCount from "./cart-count";
import HeaderAccount from "./header-account";
import MobileMenu from "./mobile-menu";
import HeaderSearchForm from "@/components/share/HeaderSearchForm";
import RestaurantStatus from "@/components/share/restaurant-status";
import { useRestaurantSetting } from "@/hooks/restaurant-setting.hook";


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const setting = useRestaurantSetting().data?.data;

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full text-white">
      {/* Top Bar */}
      <div className="bg-[#02170f]">
        <div className="mx-auto flex h-[33px] max-w-[1220px] items-center justify-between px-4 text-xs">
          <div className="flex items-center gap-2 font-medium">
           

            {/* <span>Open now · until 11 PM</span> */}
            <RestaurantStatus />
          </div>

          {/* <p className="hidden md:block">
            Delivery in Savar, Dhaka · bKash · Nagad · Cash on Delivery
          </p> */}
          {setting?.deliveryArea && (
            <p className="hidden md:block">
              Delivery in {setting.deliveryArea}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full bg-[#1b352b] px-3 py-1 font-medium"
            >
              বাংলা
            </button>

            {setting?.phone && (
              <a
                href={`tel:${setting.phone}`}
                className="font-semibold text-yellow-400"
              >
                Call us
              </a>
            )}
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
