
import CouponsManagement from "@/components/admin/coupons-management";

export const instant = false;

export default function AdminCouponsPage() {
  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[2px] text-[#08613f]">
          Restaurant operations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#052b24]">
          Coupon Management
        </h1>

        <p className="mt-2 text-sm text-[#73817b]">
          Create discount coupons, set usage rules and manage coupon availability.
        </p>
      </div>

      <CouponsManagement />
    </div>
  );
}
