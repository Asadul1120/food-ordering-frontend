// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useFeaturedProducts } from "@/hooks/product.hook";

// const Hero = () => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   const featuredQuery = useFeaturedProducts();

//   const foodSlides = (featuredQuery.data?.data ?? []).filter(
//     (product) => product.isFeatured === true,
//   );

//   const totalSlides = foodSlides.length;

//   const currentIndex = totalSlides > 0 ? activeIndex % totalSlides : 0;

//   const activeFood = foodSlides[currentIndex];

//   // Next Slide
//   const nextSlide = () => {
//     if (totalSlides <= 1) return;

//     setActiveIndex((prev) => (prev + 1) % totalSlides);
//   };

//   // Previous Slide
//   const prevSlide = () => {
//     if (totalSlides <= 1) return;

//     setActiveIndex(
//       (prev) => ((prev % totalSlides) - 1 + totalSlides) % totalSlides,
//     );
//   };

//   // Automatic Slider
//   useEffect(() => {
//     if (totalSlides <= 1) return;

//     const interval = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % totalSlides);
//     }, 4500);

//     return () => clearInterval(interval);
//   }, [totalSlides]);

//   return (
//     <>
//       {/* Hero Section */}
//       <section className="overflow-hidden bg-gradient-to-br from-[#eef8f2] via-[#edf7f1] to-[#f1f4d9]">
//         <div className="mx-auto grid max-w-[1155px] items-center gap-12 px-5 py-14 lg:grid-cols-2 lg:gap-16 lg:py-[62px]">
//           {/* Left Content */}
//           <div>
//             <span className="inline-flex rounded-full border border-[#a5d9bd] bg-white px-4 py-1.5 text-xs font-bold tracking-[2px] text-[#075b3d]">
//               MADE FOR GOOD MOMENTS
//             </span>

//             <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-[#03291c] sm:text-5xl lg:text-[45px]">
//               Restaurant meals.
//               <span className="block text-[#08613f]">Café favorites.</span>
//             </h1>

//             <p className="mt-6 max-w-[500px] text-[15px] leading-7 text-gray-700">
//               Side Kitchen made food and handcrafted coffee from Savar&apos;s
//               favorite fusion café, delivered to your door.
//             </p>

//             {/* Action Buttons */}
//             <div className="mt-8 flex flex-wrap items-center gap-3">
//               <Link
//                 href="/foods"
//                 className="rounded-full bg-[#ffcc00] px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-yellow-400"
//               >
//                 Order Now
//               </Link>

//               <Link
//                 href="/categories"
//                 className="rounded-full border border-[#08613f] px-7 py-3.5 text-sm font-semibold text-[#075b3d] transition hover:bg-[#075b3d] hover:text-white"
//               >
//                 View Categories
//               </Link>
//             </div>

//             {/* Restaurant Information */}
//             <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-700">
//               <span className="flex items-center gap-2">
//                 <span className="h-2.5 w-2.5 rounded-full bg-[#24c66b]" />
//                 Open now · until 11 PM
//               </span>

//               <span className="flex items-center gap-2">
//                 <span className="h-1.5 w-1.5 rounded-full bg-[#ffcc00]" />
//                 10 AM – 10 PM daily
//               </span>

//               <span className="flex items-center gap-2">
//                 <span className="h-1.5 w-1.5 rounded-full bg-[#ffcc00]" />
//                 Delivery in Rayer Bazar, Mohammadpur, Dhaka-1209.
//               </span>

//               <span className="flex items-center gap-2">
//                 <span className="h-1.5 w-1.5 rounded-full bg-[#ffcc00]" />
//                 bKash · Nagad · COD
//               </span>
//             </div>
//           </div>

//           {/* Right Food Slider */}
//           <div className="relative mx-auto w-full max-w-[575px] pt-4">
//             {/* Background Decoration */}
//             <div className="absolute -inset-2 rotate-[5deg] rounded-[35px] bg-[#e8d95c]" />

//             <div className="absolute -inset-2 -rotate-[3deg] rounded-[35px] bg-[#287c59]" />

//             {/* Most Loved Badge */}
//             <div className="absolute -left-5 top-0 z-20 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-gray-800 shadow-lg">
//               <Flame size={18} className="text-orange-500" aria-hidden="true" />
//               Most loved
//             </div>

//             {/* Slider Card */}
//             <div className="relative aspect-[1.42] min-h-[270px] overflow-hidden rounded-[30px] border-[4px] border-white bg-gray-200 shadow-2xl sm:min-h-0">
//               {/* Loading State */}
//               {featuredQuery.isLoading ? (
//                 <div className="absolute inset-0 animate-pulse bg-gray-300">
//                   <div className="absolute bottom-10 left-6 space-y-3">
//                     <div className="h-3 w-28 rounded bg-gray-400" />
//                     <div className="h-7 w-48 rounded bg-gray-400" />
//                     <div className="h-5 w-20 rounded bg-gray-400" />
//                     <div className="h-10 w-28 rounded-full bg-gray-400" />
//                   </div>
//                 </div>
//               ) : featuredQuery.isError ? (
//                 /* Error State */
//                 <div className="flex h-full items-center justify-center">
//                   <p className="text-sm text-gray-500">
//                     Failed to load featured foods.
//                   </p>
//                 </div>
//               ) : activeFood ? (
//                 <>
//                   {/* Food Image */}
//                   {activeFood.imageUrl && (
//                     <Image
//                       key={activeFood.id}
//                       src={activeFood.imageUrl}
//                       alt={activeFood.name}
//                       fill
//                       priority={currentIndex === 0}
//                       sizes="(max-width: 768px) 100vw, 575px"
//                       className="object-cover transition-all duration-700"
//                     />
//                   )}

//                   {/* Dark Overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-[#001b10]/95 via-[#001b10]/25 to-transparent" />

//                   {/* Slider Navigation */}
//                   {totalSlides > 1 && (
//                     <>
//                       {/* Previous Button */}
//                       <button
//                         type="button"
//                         onClick={prevSlide}
//                         aria-label="Previous food"
//                         className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#806c42]/90 text-white transition hover:bg-[#ffcc00] hover:text-black"
//                       >
//                         <ChevronLeft size={24} strokeWidth={2} />
//                       </button>

//                       {/* Next Button */}
//                       <button
//                         type="button"
//                         onClick={nextSlide}
//                         aria-label="Next food"
//                         className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#806c42]/90 text-white transition hover:bg-[#ffcc00] hover:text-black"
//                       >
//                         <ChevronRight size={24} strokeWidth={2} />
//                       </button>
//                     </>
//                   )}

//                   {/* Food Details */}
//                   <div className="absolute bottom-8 left-25 z-10">
//                     <p className="text-xs font-bold tracking-wider text-[#ffcc33]">
//                       FEATURED FOOD
//                     </p>

//                     <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
//                       {activeFood.name}
//                     </h2>

//                     <p className="mt-2 text-xl font-bold text-[#ffcc33]">
//                       ৳{activeFood.price}
//                     </p>

//                     <Link
//                       href={`/foods/${activeFood.id}`}
//                       className="mt-4 inline-flex rounded-full bg-[#ffcc00] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400"
//                     >
//                       Order Now
//                     </Link>
//                   </div>

//                   {/* Slider Indicators */}
//                   {totalSlides > 1 && (
//                     <div className="absolute bottom-5 right-6 z-10 flex items-center gap-2">
//                       {foodSlides.map((food, index) => (
//                         <button
//                           key={food.id}
//                           type="button"
//                           aria-label={`Go to slide ${index + 1}`}
//                           onClick={() => setActiveIndex(index)}
//                           className={`h-2.5 rounded-full transition-all duration-300 ${
//                             currentIndex === index
//                               ? "w-6 bg-[#ffcc00]"
//                               : "w-2.5 bg-white/60 hover:bg-white"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 /* Empty State */
//                 <div className="flex h-full flex-col items-center justify-center gap-3">
//                   <Flame size={32} className="text-[#075b3d]" />

//                   <p className="text-sm font-medium text-gray-600">
//                     No featured foods available.
//                   </p>

//                   <Link
//                     href="/foods"
//                     className="rounded-full bg-[#ffcc00] px-5 py-2 text-sm font-semibold text-black"
//                   >
//                     Explore Foods
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Feature Section */}
//       <section className="border-b border-gray-100 bg-white">
//         <div className="mx-auto grid max-w-[1155px] grid-cols-1 divide-y divide-gray-100 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
//           <div className="py-5 text-center">
//             <h3 className="text-sm font-bold text-[#075b3d]">
//               Fresh & Made to Order
//             </h3>
//             <p className="mt-1 text-xs text-gray-500">
//               Prepared when you order
//             </p>
//           </div>

//           <div className="py-5 text-center">
//             <h3 className="text-sm font-bold text-[#075b3d]">
//               Fast Local Delivery
//             </h3>
//             <p className="mt-1 text-xs text-gray-500">Savar, Dhaka</p>
//           </div>

//           <div className="py-5 text-center">
//             <h3 className="text-sm font-bold text-[#075b3d]">Pay Your Way</h3>
//             <p className="mt-1 text-xs text-gray-500">
//               bKash, Nagad, SSLCOMMERZ & COD
//             </p>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Hero;

"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { useEffect, useState } from "react";

import { useFeaturedProducts } from "@/hooks/product.hook";
import { useRestaurantSetting } from "@/hooks/restaurant-setting.hook";
import RestaurantStatus from "@/components/share/restaurant-status";

const Hero = () => {
  const setting = useRestaurantSetting().data?.data;
  const [activeIndex, setActiveIndex] = useState(0);

  const featuredQuery = useFeaturedProducts();

  const foodSlides = (featuredQuery.data?.data ?? []).filter(
    (product) => product.isFeatured === true,
  );

  const totalSlides = foodSlides.length;
  const currentIndex = totalSlides > 0 ? activeIndex % totalSlides : 0;
  const activeFood = foodSlides[currentIndex];

  const nextSlide = () => {
    if (totalSlides <= 1) return;

    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (totalSlides <= 1) return;

    setActiveIndex(
      (prev) => ((prev % totalSlides) - 1 + totalSlides) % totalSlides,
    );
  };

  // Rotate only when there is more than one featured food.
  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <>
      <section className="overflow-hidden bg-gradient-to-br from-[#eef8f2] via-[#edf7f1] to-[#f1f4d9]">
        <div className="mx-auto grid max-w-[1155px] items-center gap-12 px-5 py-14 lg:grid-cols-2 lg:gap-16 lg:py-[62px]">
          {/* Left Content */}
          <div>
            <span className="inline-flex rounded-full border border-[#a5d9bd] bg-white px-4 py-1.5 text-xs font-bold tracking-[2px] text-[#075b3d]">
              MADE FOR GOOD MOMENTS
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-[#03291c] sm:text-5xl lg:text-[45px]">
              Restaurant meals.
              <span className="block text-[#08613f]">Café favorites.</span>
            </h1>

            <p className="mt-6 max-w-[500px] text-[15px] leading-7 text-gray-700">
              {setting?.description ??
                "Restaurant meals and handcrafted coffee, delivered to your door."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/foods"
                className="rounded-full bg-[#ffcc00] px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-yellow-400"
              >
                Order Now
              </Link>

              <Link
                href="#menu-categories"
                className="rounded-full border border-[#08613f] px-7 py-3.5 text-sm font-semibold text-[#075b3d] transition hover:bg-[#075b3d] hover:text-white"
              >
                View Categories
              </Link>
            </div>

            {/* Restaurant Information */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-700">
              <RestaurantStatus />

              {setting?.deliveryArea && (
                <span>Delivery in {setting.deliveryArea}</span>
              )}

              <span>bKash · Cash on Delivery</span>
            </div>
          </div>

          {/* Featured Food Slider */}
          <div className="relative mx-auto w-full max-w-[575px] pt-4">
            <div className="absolute -inset-2 rotate-[5deg] rounded-[35px] bg-[#e8d95c]" />
            <div className="absolute -inset-2 -rotate-[3deg] rounded-[35px] bg-[#287c59]" />

            <div className="absolute -left-5 top-0 z-20 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-gray-800 shadow-lg">
              <Flame size={18} className="text-orange-500" aria-hidden="true" />
              Most loved
            </div>

            <div className="relative aspect-[1.42] min-h-[270px] overflow-hidden rounded-[30px] border-[4px] border-white bg-gray-200 shadow-2xl sm:min-h-0">
              {featuredQuery.isLoading ? (
                <div className="absolute inset-0 animate-pulse bg-gray-300">
                  <div className="absolute bottom-10 left-6 space-y-3">
                    <div className="h-3 w-28 rounded bg-gray-400" />
                    <div className="h-7 w-48 rounded bg-gray-400" />
                    <div className="h-5 w-20 rounded bg-gray-400" />
                    <div className="h-10 w-28 rounded-full bg-gray-400" />
                  </div>
                </div>
              ) : featuredQuery.isError ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-gray-500">
                    Failed to load featured foods.
                  </p>
                </div>
              ) : activeFood ? (
                <>
                  {activeFood.imageUrl && (
                    <Image
                      key={activeFood.id}
                      src={activeFood.imageUrl}
                      alt={activeFood.name}
                      fill
                      priority={currentIndex === 0}
                      sizes="(max-width: 768px) 100vw, 575px"
                      className="object-cover transition-all duration-700"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#001b10]/95 via-[#001b10]/25 to-transparent" />

                  {totalSlides > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Previous food"
                        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#806c42]/90 text-white transition hover:bg-[#ffcc00] hover:text-black"
                      >
                        <ChevronLeft size={24} strokeWidth={2} />
                      </button>

                      <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next food"
                        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#806c42]/90 text-white transition hover:bg-[#ffcc00] hover:text-black"
                      >
                        <ChevronRight size={24} strokeWidth={2} />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-20 left-25 z-10">
                    <p className="text-xs font-bold tracking-wider text-[#ffcc33]">
                      FEATURED FOOD
                    </p>

                    <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                      {activeFood.name}
                    </h2>

                    <p className="mt-2 text-xl font-bold text-[#ffcc33]">
                      ৳{activeFood.price}
                    </p>

                    <Link
                      href={`/foods/${activeFood.id}`}
                      className="mt-4 inline-flex rounded-full bg-[#ffcc00] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400"
                    >
                      Order Now
                    </Link>
                  </div>

                  {totalSlides > 1 && (
                    <div className="absolute bottom-5 right-6 z-10 flex items-center gap-2">
                      {foodSlides.map((food, index) => (
                        <button
                          key={food.id}
                          type="button"
                          aria-label={`Go to slide ${index + 1}`}
                          onClick={() => setActiveIndex(index)}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            currentIndex === index
                              ? "w-6 bg-[#ffcc00]"
                              : "w-2.5 bg-white/60 hover:bg-white"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  <Flame size={32} className="text-[#075b3d]" />

                  <p className="text-sm font-medium text-gray-600">
                    No featured foods available.
                  </p>

                  <Link
                    href="/foods"
                    className="rounded-full bg-[#ffcc00] px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-400"
                  >
                    Explore Foods
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-[1155px] grid-cols-1 divide-y divide-gray-100 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="py-5 text-center">
            <h3 className="text-sm font-bold text-[#075b3d]">
              Fresh & Made to Order
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Prepared when you order
            </p>
          </div>

          <div className="py-5 text-center">
            <h3 className="text-sm font-bold text-[#075b3d]">
              Fast Local Delivery
            </h3>

            {setting?.deliveryArea && (
              <p className="mt-1 text-xs text-gray-500">
                {setting.deliveryArea}
              </p>
            )}
          </div>

          <div className="py-5 text-center">
            <h3 className="text-sm font-bold text-[#075b3d]">Pay Your Way</h3>

            <p className="mt-1 text-xs text-gray-500">
              bKash & Cash on Delivery
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
