
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock3,
  Truck,
  CreditCard,
  ArrowUp,
} from "lucide-react";

import Logo from "./logo";

const Footer = () => {
  return (
    <footer className="bg-[#031f14] text-white">
      {/* Main Footer */}
      <div className="mx-auto grid max-w-[1220px] grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_1.35fr_0.55fr_0.55fr]">
        {/* Brand Section */}
        <div>
          <Logo />

          <p className="mt-6 max-w-[340px] text-sm leading-6 text-gray-200">
            Restaurant meals and café favorites from Savar, cooked fresh and
            delivered to your door.
          </p>

          {/* Social Links */}
          <div className="mt-4 flex items-center gap-2">
            {/* Phone */}
            <a
              href="tel:+8809658788505"
              aria-label="Call us"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#294236] bg-[#18382b] transition hover:bg-[#294236]"
            >
              <Phone
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/8801904070111"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#294236] bg-[#18382b] transition hover:bg-[#294236]"
            >
              <MessageCircle
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#294236] bg-[#18382b] text-base font-bold transition hover:bg-[#294236]"
            >
              f
            </a>
          </div>
        </div>

        {/* Visit & Order */}
        <div>
          <h3 className="mb-4 text-xs font-bold tracking-[2px] text-[#ffcc00]">
            VISIT & ORDER
          </h3>

          <div className="space-y-3 text-sm">
            {/* Location */}
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-[#ffcc00]">
                <MapPin
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>

              <span>
                Side Kitchen, Rayer Bazar, Mohammadpur, Dhaka-1209
              </span>
            </div>

            {/* Opening Hours */}
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-[#ffcc00]">
                <Clock3
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>

              <p>
                Every day · 10 AM–10 PM
                <span className="text-gray-400">
                  {" "}· pre-orders anytime
                </span>
              </p>
            </div>

            {/* Delivery */}
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-[#ffcc00]">
                <Truck
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>

              <span>
                Home delivery across Rayer Bazar, Mohammadpur, Dhaka-1209
              </span>
            </div>

            {/* Payment */}
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-[#ffcc00]">
                <CreditCard
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>

              <div>
                <p>
                  bKash, Nagad, Rocket, Upay & Cash on Delivery
                </p>

                <p className="text-gray-400">
                  Merchant number 00000000000 · Bangla QR
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start gap-3 pt-1">
              <span className="mt-0.5 text-[#ffcc00]">
                <Phone
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>

              <p>
                <a
                  href="tel:+8809658788505"
                  className="hover:text-[#ffcc00]"
                >
                  +8801715819298
                </a>

                {" · "}

                <a
                  href="https://wa.me/8801904070111"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ffcc00]"
                >
                  WhatsApp 01715819298
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Order Links */}
        <div>
          <h3 className="mb-4 text-xs font-bold tracking-[2px] text-[#ffcc00]">
            ORDER
          </h3>

          <ul className="space-y-3 text-sm text-gray-100">
            <li>
              <Link
                href="/menu"
                className="hover:text-[#ffcc00]"
              >
                Full Menu
              </Link>
            </li>

            <li>
              <Link
                href="/track-order"
                className="hover:text-[#ffcc00]"
              >
                Track Order
              </Link>
            </li>

            <li>
              <Link
                href="/cart"
                className="hover:text-[#ffcc00]"
              >
                Your Cart
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className="hover:text-[#ffcc00]"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Account Links */}
        <div>
          <h3 className="mb-4 text-xs font-bold tracking-[2px] text-[#ffcc00]">
            ACCOUNT
          </h3>

          <ul className="space-y-3 text-sm text-gray-100">
            <li>
              <Link
                href="/login"
                className="hover:text-[#ffcc00]"
              >
                Sign in
              </Link>
            </li>

            <li>
              <Link
                href="/order-history"
                className="hover:text-[#ffcc00]"
              >
                Order History
              </Link>
            </li>

            <li>
              <Link
                href="/wishlist"
                className="hover:text-[#ffcc00]"
              >
                Wishlist
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#294236]">
        <div className="mx-auto flex max-w-[1220px] flex-col items-center justify-between gap-4 px-4 py-4 text-xs text-gray-300 md:flex-row">
          <p>
            © 2026 Side Kitchen. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/about"
              className="hover:text-[#ffcc00]"
            >
              About Us
            </Link>

            <Link
              href="/terms"
              className="hover:text-[#ffcc00]"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/refund-policy"
              className="hover:text-[#ffcc00]"
            >
              Refund & Cancellation
            </Link>

            <Link
              href="/privacy-policy"
              className="hover:text-[#ffcc00]"
            >
              Privacy Policy
            </Link>
          </div>

          <a
            href="#"
            className="whitespace-nowrap hover:text-[#ffcc00]"
          >
            Back to top{" "}
            <ArrowUp
              size={12}
              strokeWidth={2}
              className="inline-block"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
