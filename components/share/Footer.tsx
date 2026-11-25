// import Link from "next/link";
// import {
//   Phone,
//   MessageCircle,
//   MapPin,
//   Clock3,
//   Truck,
//   CreditCard,
//   ArrowUp,
// } from "lucide-react";

// import Logo from "./logo";

// const Footer = () => {
//   return (
//     <footer className="bg-[#031f14] text-white">
//       {/* Main Footer */}
//       <div className="mx-auto grid max-w-[1220px] grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_1.35fr_0.55fr_0.55fr]">
//         {/* Brand Section */}
//         <div>
//           <Logo />

//           <p className="mt-6 max-w-[340px] text-sm leading-6 text-gray-200">
//             Restaurant meals and café favorites from Savar, cooked fresh and
//             delivered to your door.
//           </p>

//           {/* Social Links */}
//           <div className="mt-4 flex items-center gap-2">
//             {/* Phone */}
//             <a
//               href="tel:+8809658788505"
//               aria-label="Call us"
//               className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#294236] bg-[#18382b] transition hover:bg-[#294236]"
//             >
//               <Phone
//                 size={18}
//                 strokeWidth={1.8}
//                 aria-hidden="true"
//               />
//             </a>

//             {/* WhatsApp */}
//             <a
//               href="https://wa.me/8801904070111"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="WhatsApp"
//               className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#294236] bg-[#18382b] transition hover:bg-[#294236]"
//             >
//               <MessageCircle
//                 size={18}
//                 strokeWidth={1.8}
//                 aria-hidden="true"
//               />
//             </a>

//             {/* Facebook */}
//             <a
//               href="https://www.facebook.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="Facebook"
//               className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#294236] bg-[#18382b] text-base font-bold transition hover:bg-[#294236]"
//             >
//               f
//             </a>
//           </div>
//         </div>

//         {/* Visit & Order */}
//         <div>
//           <h3 className="mb-4 text-xs font-bold tracking-[2px] text-[#ffcc00]">
//             VISIT & ORDER
//           </h3>

//           <div className="space-y-3 text-sm">
//             {/* Location */}
//             <div className="flex items-start gap-3">
//               <span className="mt-0.5 text-[#ffcc00]">
//                 <MapPin
//                   size={17}
//                   strokeWidth={2}
//                   aria-hidden="true"
//                 />
//               </span>

//               <span>
//                 Side Kitchen, Rayer Bazar, Mohammadpur, Dhaka-1209
//               </span>
//             </div>

//             {/* Opening Hours */}
//             <div className="flex items-start gap-3">
//               <span className="mt-0.5 text-[#ffcc00]">
//                 <Clock3
//                   size={17}
//                   strokeWidth={2}
//                   aria-hidden="true"
//                 />
//               </span>

//               <p>
//                 Every day · 10 AM–10 PM
//                 <span className="text-gray-400">
//                   {" "}· pre-orders anytime
//                 </span>
//               </p>
//             </div>

//             {/* Delivery */}
//             <div className="flex items-start gap-3">
//               <span className="mt-0.5 text-[#ffcc00]">
//                 <Truck
//                   size={17}
//                   strokeWidth={2}
//                   aria-hidden="true"
//                 />
//               </span>

//               <span>
//                 Home delivery across Rayer Bazar, Mohammadpur, Dhaka-1209
//               </span>
//             </div>

//             {/* Payment */}
//             <div className="flex items-start gap-3">
//               <span className="mt-0.5 text-[#ffcc00]">
//                 <CreditCard
//                   size={17}
//                   strokeWidth={2}
//                   aria-hidden="true"
//                 />
//               </span>

//               <div>
//                 <p>
//                   bKash, Nagad, Rocket, Upay & Cash on Delivery
//                 </p>

//                 <p className="text-gray-400">
//                   Merchant number 00000000000 · Bangla QR
//                 </p>
//               </div>
//             </div>

//             {/* Contact */}
//             <div className="flex items-start gap-3 pt-1">
//               <span className="mt-0.5 text-[#ffcc00]">
//                 <Phone
//                   size={17}
//                   strokeWidth={2}
//                   aria-hidden="true"
//                 />
//               </span>

//               <p>
//                 <a
//                   href="tel:+8809658788505"
//                   className="hover:text-[#ffcc00]"
//                 >
//                   +8801715819298
//                 </a>

//                 {" · "}

//                 <a
//                   href="https://wa.me/8801904070111"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="hover:text-[#ffcc00]"
//                 >
//                   WhatsApp 01715819298
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Order Links */}
//         <div>
//           <h3 className="mb-4 text-xs font-bold tracking-[2px] text-[#ffcc00]">
//             ORDER
//           </h3>

//           <ul className="space-y-3 text-sm text-gray-100">
//             <li>
//               <Link
//                 href="/menu"
//                 className="hover:text-[#ffcc00]"
//               >
//                 Full Menu
//               </Link>
//             </li>

//             <li>
//               <Link
//                 href="/track-order"
//                 className="hover:text-[#ffcc00]"
//               >
//                 Track Order
//               </Link>
//             </li>

//             <li>
//               <Link
//                 href="/cart"
//                 className="hover:text-[#ffcc00]"
//               >
//                 Your Cart
//               </Link>
//             </li>

//             <li>
//               <Link
//                 href="/contact"
//                 className="hover:text-[#ffcc00]"
//               >
//                 Contact Us
//               </Link>
//             </li>
//           </ul>
//         </div>

//         {/* Account Links */}
//         <div>
//           <h3 className="mb-4 text-xs font-bold tracking-[2px] text-[#ffcc00]">
//             ACCOUNT
//           </h3>

//           <ul className="space-y-3 text-sm text-gray-100">
//             <li>
//               <Link
//                 href="/login"
//                 className="hover:text-[#ffcc00]"
//               >
//                 Sign in
//               </Link>
//             </li>

//             <li>
//               <Link
//                 href="/order-history"
//                 className="hover:text-[#ffcc00]"
//               >
//                 Order History
//               </Link>
//             </li>

//             <li>
//               <Link
//                 href="/wishlist"
//                 className="hover:text-[#ffcc00]"
//               >
//                 Wishlist
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Bottom Footer */}
//       <div className="border-t border-[#294236]">
//         <div className="mx-auto flex max-w-[1220px] flex-col items-center justify-between gap-4 px-4 py-4 text-xs text-gray-300 md:flex-row">
//           <p>
//             © 2026 Side Kitchen. All rights reserved.
//           </p>

//           <div className="flex flex-wrap items-center justify-center gap-4">
//             <Link
//               href="/about"
//               className="hover:text-[#ffcc00]"
//             >
//               About Us
//             </Link>

//             <Link
//               href="/terms"
//               className="hover:text-[#ffcc00]"
//             >
//               Terms & Conditions
//             </Link>

//             <Link
//               href="/refund-policy"
//               className="hover:text-[#ffcc00]"
//             >
//               Refund & Cancellation
//             </Link>

//             <Link
//               href="/privacy-policy"
//               className="hover:text-[#ffcc00]"
//             >
//               Privacy Policy
//             </Link>
//           </div>

//           <a
//             href="#"
//             className="whitespace-nowrap hover:text-[#ffcc00]"
//           >
//             Back to top{" "}
//             <ArrowUp
//               size={12}
//               strokeWidth={2}
//               className="inline-block"
//               aria-hidden="true"
//             />
//           </a>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

"use client";

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
import { useRestaurantSetting } from "@/hooks/restaurant-setting.hook";
import { weekdays } from "@/lib/restaurant-hours";
import type { RestaurantHour } from "@/types/restaurant-setting.type";

const socialButtonClass =
  "flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#294236] bg-[#18382b] transition hover:bg-[#294236]";

const iconClass = "mt-0.5 shrink-0 text-[#ffcc00]";
const footerLinkClass = "hover:text-[#ffcc00]";

// Convert 22:00 to 10 PM and 22:30 to 10:30 PM.
function formatTime(time: string) {
  const [hourText, minute] = time.split(":");
  const hour = Number(hourText);
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour % 12 || 12;

  return minute === "00"
    ? `${displayHour} ${period}`
    : `${displayHour}:${minute} ${period}`;
}

function formatHours(day: RestaurantHour) {
  const { isClosed, opensAt, closesAt } = day;

  if (isClosed || !opensAt || !closesAt) return "Closed";

  const range = `${formatTime(opensAt)}–${formatTime(closesAt)}`;

  return closesAt < opensAt ? `${range} (next day)` : range;
}

const Footer = () => {
  const setting = useRestaurantSetting().data?.data;
  const restaurantName = setting?.name ?? "Freshlya";

  const phone = setting?.phone;
  const phoneUrl = phone ? `tel:${phone}` : null;

  const whatsappNumber = setting?.whatsappNumber;
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/^\+/, "")}`
    : null;

  const hours = setting?.hours ?? [];
  const firstDay = hours[0];

  const sameHoursEveryDay =
    firstDay &&
    hours.length === 7 &&
    hours.every(
      (day) =>
        day.isClosed === firstDay.isClosed &&
        day.opensAt === firstDay.opensAt &&
        day.closesAt === firstDay.closesAt,
    );

  return (
    <footer className="bg-[#031f14] text-white">
      {/* Main Footer */}
      <div className="mx-auto grid max-w-[1220px] grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_1.35fr_0.55fr_0.55fr]">
        {/* Brand Section */}
        <div>
          <Logo />

          <p className="mt-6 max-w-[340px] text-sm leading-6 text-gray-200">
            {setting?.description ??
              "Restaurant meals and café favorites, cooked fresh and delivered to your door."}
          </p>

          {/* Social Links */}
          {(phoneUrl || whatsappUrl || setting?.facebookUrl) && (
            <div className="mt-4 flex items-center gap-2">
              {phoneUrl && (
                <a
                  href={phoneUrl}
                  aria-label="Call us"
                  className={socialButtonClass}
                >
                  <Phone size={18} strokeWidth={1.8} aria-hidden="true" />
                </a>
              )}

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className={socialButtonClass}
                >
                  <MessageCircle
                    size={18}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </a>
              )}

              {setting?.facebookUrl && (
                <a
                  href={setting.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className={`${socialButtonClass} text-base font-bold`}
                >
                  f
                </a>
              )}
            </div>
          )}
        </div>

        {/* Visit & Order */}
        <div id="restaurant-contact" className="scroll-mt-6">
          <h3 className="mb-4 text-xs font-bold tracking-[2px] text-[#ffcc00]">
            VISIT & ORDER
          </h3>

          <div className="space-y-3 text-sm">
            {/* Location */}
            {setting?.address && (
              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  strokeWidth={2}
                  className={iconClass}
                  aria-hidden="true"
                />

                {setting.googleMapsUrl ? (
                  <a
                    href={setting.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footerLinkClass}
                  >
                    {setting.address}
                  </a>
                ) : (
                  <span>{setting.address}</span>
                )}
              </div>
            )}

            {/* Opening Hours */}
            {hours.length > 0 && (
              <div className="flex items-start gap-3">
                <Clock3
                  size={17}
                  strokeWidth={2}
                  className={iconClass}
                  aria-hidden="true"
                />

                <details>
                  <summary className="cursor-pointer list-none rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffcc00]">
                    {sameHoursEveryDay
                      ? `Every day · ${formatHours(firstDay)}`
                      : "Opening hours"}

                    <span className="text-gray-400"> · View schedule</span>
                  </summary>

                  <ul className="mt-2 space-y-1 text-gray-300">
                    {hours.map((day) => (
                      <li key={day.dayOfWeek}>
                        {weekdays[day.dayOfWeek]} · {formatHours(day)}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            )}

            {/* Delivery */}
            {setting?.deliveryArea && (
              <div className="flex items-start gap-3">
                <Truck
                  size={17}
                  strokeWidth={2}
                  className={iconClass}
                  aria-hidden="true"
                />

                <span>Home delivery across {setting.deliveryArea}</span>
              </div>
            )}

            {/* Payment */}
            <div className="flex items-start gap-3">
              <CreditCard
                size={17}
                strokeWidth={2}
                className={iconClass}
                aria-hidden="true"
              />

              <div>
                <p>bKash &amp; Cash on Delivery</p>
                <p className="text-gray-400">
                  Choose your payment method at checkout.
                </p>
              </div>
            </div>

            {/* Contact */}
            {(phoneUrl || whatsappUrl) && (
              <div className="flex items-start gap-3 pt-1">
                <Phone
                  size={17}
                  strokeWidth={2}
                  className={iconClass}
                  aria-hidden="true"
                />

                <p>
                  {phoneUrl && (
                    <a href={phoneUrl} className={footerLinkClass}>
                      {phone}
                    </a>
                  )}

                  {phoneUrl && whatsappUrl && " · "}

                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={footerLinkClass}
                    >
                      WhatsApp {whatsappNumber}
                    </a>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Links */}
        <div>
          <h3 className="mb-4 text-xs font-bold tracking-[2px] text-[#ffcc00]">
            ORDER
          </h3>

          <ul className="space-y-3 text-sm text-gray-100">
            <li>
              <Link href="/foods" className={footerLinkClass}>
                Full Menu
              </Link>
            </li>

            <li>
              <Link href="/track-order" className={footerLinkClass}>
                Track Order
              </Link>
            </li>

            <li>
              <Link href="/cart" className={footerLinkClass}>
                Your Cart
              </Link>
            </li>

            <li>
              <Link href="#restaurant-contact" className={footerLinkClass}>
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
              <Link href="/login" className={footerLinkClass}>
                Sign in
              </Link>
            </li>

            <li>
              <Link href="/customer/orders" className={footerLinkClass}>
                Order History
              </Link>
            </li>

            <li>
              <Link href="/wishlist" className={footerLinkClass}>
                Wishlist
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#294236]">
        <div className="mx-auto flex max-w-[1220px] flex-col items-center justify-between gap-4 px-4 py-4 text-xs text-gray-300 md:flex-row">
          <p>© 2026 {restaurantName}. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/about" className={footerLinkClass}>
              About Us
            </Link>

            <Link href="/terms" className={footerLinkClass}>
              Terms &amp; Conditions
            </Link>

            <Link href="/refund-policy" className={footerLinkClass}>
              Refund &amp; Cancellation
            </Link>

            <Link href="/privacy-policy" className={footerLinkClass}>
              Privacy Policy
            </Link>
          </div>

          <a href="#" className="whitespace-nowrap hover:text-[#ffcc00]">
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
