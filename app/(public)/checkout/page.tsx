import Link from "next/link";

import CheckoutForm from "@/components/form/checkout-form";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#052b24]">
      {/* Category Navigation */}
      <nav
        aria-label="Food menu"
        className="border-b border-[#dce8e0] bg-white"
      >
        <div className="mx-auto flex min-h-[40px] max-w-[1248px] items-center justify-between gap-6 px-4">
          <div className="flex min-w-0 items-center gap-7 overflow-x-auto whitespace-nowrap py-2 text-[13px]">
            <Link href="/foods" className="font-semibold text-[#08613f]">
              Full Menu
            </Link>

            <Link href="/foods" className="text-[#3f4d46] hover:text-[#08613f]">
              Ready Meals
            </Link>

            <Link href="/foods" className="text-[#3f4d46] hover:text-[#08613f]">
              Cafe Menu
            </Link>

            <Link href="/foods" className="text-[#3f4d46] hover:text-[#08613f]">
              Freshlya Organics
            </Link>
          </div>

          <div className="hidden shrink-0 items-center gap-6 text-[13px] text-[#3f4d46] md:flex">
            <Link href="/track-order">Track Order</Link>

            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Checkout Heading */}
      <section className="border-b border-[#dce8e0] bg-[#edf7f1]">
        <div className="mx-auto max-w-[1248px] px-4 py-[18px]">
          <h1 className="text-[30px] font-bold leading-[38px] tracking-tight text-[#052b24]">
            Checkout
          </h1>

          <p className="mt-1 text-[14px] text-[#73817b]">
            Almost there — confirm your delivery details and payment
          </p>
        </div>
      </section>

      {/* Main Checkout Content */}
      <main className="mx-auto max-w-[1248px] px-4 pb-20 pt-8">
        {/* Closed / Pre-order Notice */}
        <div className="flex min-h-[64px] items-center gap-3 rounded-[13px] border border-[#ffdc80] bg-[#fff3d0] px-4 py-3 text-[13px] leading-5 text-[#27342e]">
          <span aria-hidden="true" className="shrink-0 text-[20px]">
            🌙
          </span>

          <p>
            <strong>We're closed right now</strong> (open 3 PM – 11PM daily).
            You can still order — it will be a <strong>pre-order</strong> and
            we'll start cooking at <strong>3 PM tomorrow.</strong>
          </p>
        </div>

        {/* Delivery Form + Payment + Summary */}
        <div className="mt-6">
          <CheckoutForm />
        </div>
      </main>
    </div>
  );
}
