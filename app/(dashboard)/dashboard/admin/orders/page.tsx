import OrdersManagement from "@/components/admin/orders-management";

export const instant = false;

export default function AdminOrdersPage() {
  return (
    <div>
      {/* Page Heading */}
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[2px] text-[#08613f]">
          Restaurant operations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Order Management
        </h1>

        <p className="mt-2 text-sm text-[#73817b]">
          Manage customer orders, track payments and update order statuses.
        </p>
      </div>

      {/* Reusable Orders Table */}
      <OrdersManagement />
    </div>
  );
}
