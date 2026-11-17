"use client";

import { toast } from "sonner";

import { useAdminOrderActions } from "@/hooks/admin.hook";

import { nextOrderStatus, statusLabels } from "@/lib/admin";

import { getErrorMessage } from "@/lib/utils";

import type { AdminOrder } from "@/types/admin.type";

type OrderActionsProps = {
  order: AdminOrder;
  onView: () => void;
};

export default function OrderActions({ order, onView }: OrderActionsProps) {
  const { updateStatus, cancelOrder } = useAdminOrderActions();

  const nextStatus = nextOrderStatus[order.orderStatus];

  const isBusy = updateStatus.isPending || cancelOrder.isPending;

  const canCancel =
    ["PENDING", "CONFIRMED", "PREPARING", "READY"].includes(
      order.orderStatus,
    ) && !order.payments.some((payment) => payment.paymentStatus === "PAID");

  const handleUpdate = async () => {
    if (!nextStatus) return;

    try {
      const response = await updateStatus.mutateAsync({
        id: order.id,
        orderStatus: nextStatus,
      });

      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(`Cancel order ${order.orderNumber}?`);

    if (!confirmed) return;

    try {
      const response = await cancelOrder.mutateAsync(order.id);

      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onView}
        className="rounded-full border border-[#d5ddd8] px-3 py-1.5 text-xs"
      >
        Details
      </button>

      {nextStatus && (
        <button
          type="button"
          disabled={isBusy}
          onClick={handleUpdate}
          className="rounded-full bg-[#08613f] px-3 py-1.5 text-xs text-white disabled:opacity-50"
        >
          {updateStatus.isPending
            ? "Updating..."
            : `Mark ${statusLabels[nextStatus]}`}
        </button>
      )}

      {canCancel && (
        <button
          type="button"
          disabled={isBusy}
          onClick={handleCancel}
          className="rounded-full bg-red-50 px-3 py-1.5 text-xs text-red-600 disabled:opacity-50"
        >
          {cancelOrder.isPending ? "Cancelling..." : "Cancel"}
        </button>
      )}
    </div>
  );
}
