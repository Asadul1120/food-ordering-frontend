
"use client";

import { useEffect, useState } from "react";

import {
  Pencil,
  Plus,
  RefreshCw,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import { toast } from "sonner";

import AdminCouponForm from "@/components/form/admin-coupon-form";
import AdminCouponFilterForm from "@/components/form/admin-coupon-filter-form";

import type { CouponFilters } from "@/components/form/admin-coupon-filter-form";

import {
  useAdminCouponActions,
  useAdminCoupons,
} from "@/hooks/admin-coupon.hook";

import {
  formatAdminDate,
  formatAdminMoney,
} from "@/lib/admin";

import { getErrorMessage } from "@/lib/utils";

import type { AdminCouponQuery } from "@/types/admin-coupon.type";
import type { Coupon } from "@/types/coupon.type";

const defaultFilters: AdminCouponQuery = {
  page: 1,
  limit: 10,
};

// Format discount for the table
const formatCouponDiscount = (coupon: Coupon) => {
  if (coupon.discountType === "FREE_DELIVERY") {
    return "Free delivery";
  }

  if (coupon.discountType === "PERCENTAGE") {
    const maximum = coupon.maxDiscountAmount
      ? ` · Max ${formatAdminMoney(coupon.maxDiscountAmount)}`
      : "";

    return `${Number(coupon.discountValue)}% off${maximum}`;
  }

  return `${formatAdminMoney(coupon.discountValue)} off`;
};

export default function CouponsManagement() {
  // Filters and pagination
  const [filters, setFilters] =
    useState<AdminCouponQuery>(defaultFilters);

  // Create / Edit modal
  const [formOpen, setFormOpen] = useState(false);

  const [editingCoupon, setEditingCoupon] =
    useState<Coupon | null>(null);

  // Track current action
  const [busyId, setBusyId] = useState<string | null>(null);

  // Backend data
  const couponsQuery = useAdminCoupons(filters);
  const actions = useAdminCouponActions();

  const coupons = couponsQuery.data?.coupons ?? [];
  const pagination = couponsQuery.data?.pagination;

  // Summary
  const totalCoupons = pagination?.totalCoupons ?? 0;

  const activeCoupons = coupons.filter(
    (coupon) => coupon.isActive,
  ).length;

  const inactiveCoupons = coupons.length - activeCoupons;

  const currentPage = pagination?.currentPage ?? filters.page;

  const totalPages = Math.max(
    1,
    pagination?.totalPages ?? 1,
  );

  // Close modal with Escape key
  useEffect(() => {
    if (!formOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFormOpen(false);
        setEditingCoupon(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [formOpen]);

  // Open create form
  const handleCreate = () => {
    setEditingCoupon(null);
    setFormOpen(true);
  };

  // Open edit form
  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormOpen(true);
  };

  // Close form
  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingCoupon(null);
  };

  // After successful create or edit
  const handleSaved = () => {
    handleCloseForm();

    setFilters((current) => ({
      ...current,
      page: 1,
    }));
  };

  // Search and filters
  const handleFilter = (value: CouponFilters) => {
    setFilters({
      page: 1,
      limit: 10,

      ...(value.search && {
        search: value.search,
      }),

      ...(value.discountType !== "ALL" && {
        discountType: value.discountType,
      }),

      ...(value.status !== "ALL" && {
        isActive: value.status === "ACTIVE",
      }),
    });
  };

  // Activate or deactivate coupon
  const handleStatus = async (coupon: Coupon) => {
    const nextStatus = !coupon.isActive;

    if (!nextStatus) {
      const confirmed = window.confirm(
        `Deactivate coupon "${coupon.code}"?\n\nCustomers will no longer be able to use it.`,
      );

      if (!confirmed) return;
    }

    setBusyId(coupon.id);

    try {
      await actions.updateStatus.mutateAsync({
        id: coupon.id,
        isActive: nextStatus,
      });

      toast.success(
        nextStatus
          ? "Coupon activated successfully"
          : "Coupon deactivated successfully",
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  // Delete coupon
  const handleDelete = async (coupon: Coupon) => {
    const confirmed = window.confirm(
      `Delete coupon "${coupon.code}" permanently?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    setBusyId(coupon.id);

    try {
      await actions.deleteCoupon.mutateAsync(coupon.id);

      toast.success("Coupon deleted successfully");

      // Move back if the last item on this page was deleted.
      if (coupons.length === 1 && currentPage > 1) {
        setFilters((current) => ({
          ...current,
          page: current.page - 1,
        }));
      }
    } catch (error) {
      // Backend prevents deleting coupons that have been used.
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Coupons",
            value: totalCoupons,
            color: "bg-[#edf7f1] text-[#08613f]",
          },
          {
            label: "Active on This Page",
            value: activeCoupons,
            color: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "Inactive on This Page",
            value: inactiveCoupons,
            color: "bg-red-50 text-red-600",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[22px] border border-[#e9eee9] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-[#73817b]">
                {item.label}
              </p>

              <span className={`rounded-xl p-3 ${item.color}`}>
                <Tag size={19} />
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">
              {couponsQuery.isPending
                ? "..."
                : couponsQuery.isError
                  ? "—"
                  : item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Coupon Table */}
      <section className="overflow-hidden rounded-[22px] border border-[#e9eee9] bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-[#edf0ec] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                All Coupons
              </h2>

              <p className="mt-1 text-xs text-[#73817b]">
                Manage discount codes and coupon availability.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Refresh */}
              <button
                type="button"
                aria-label="Refresh coupons"
                onClick={() => void couponsQuery.refetch()}
                disabled={couponsQuery.isFetching}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5ddd8] disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    couponsQuery.isFetching ? "animate-spin" : ""
                  }
                />
              </button>

              {/* Add Coupon */}
              <button
                type="button"
                onClick={handleCreate}
                className="flex h-11 items-center gap-2 rounded-full bg-[#ffcc00] px-5 text-sm font-semibold text-[#052b24] hover:bg-[#f2c200]"
              >
                <Plus size={17} />
                Add Coupon
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-5">
            <AdminCouponFilterForm onApply={handleFilter} />
          </div>
        </div>

        {/* Loading */}
        {couponsQuery.isPending ? (
          <p
            role="status"
            className="p-10 text-center text-sm text-[#73817b]"
          >
            Loading coupons...
          </p>
        ) : couponsQuery.isError ? (
          <div role="alert" className="p-10 text-center text-sm">
            <p>{getErrorMessage(couponsQuery.error)}</p>

            <button
              type="button"
              onClick={() => void couponsQuery.refetch()}
              className="mt-3 font-semibold text-[#08613f] underline"
            >
              Try again
            </button>
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium">
              No coupons found.
            </p>

            <p className="mt-2 text-xs text-[#73817b]">
              Try another filter or create a new coupon.
            </p>
          </div>
        ) : (
          /* Coupon Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-[#f8faf7] text-xs text-[#73817b]">
                <tr>
                  {[
                    "Coupon",
                    "Discount",
                    "Minimum Order",
                    "Usage",
                    "Validity",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-5 py-4 font-medium"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#edf0ec]">
                {coupons.map((coupon) => {
                  const now = Date.now();

                  const isExpired =
                    new Date(coupon.expiryDate).getTime() < now;

                  const isScheduled =
                    new Date(coupon.startDate).getTime() > now;

                  return (
                    <tr
                      key={coupon.id}
                      className="hover:bg-[#fafcf9]"
                    >
                      {/* Coupon Code */}
                      <td className="px-5 py-4">
                        <p className="font-bold tracking-wide text-[#052b24]">
                          {coupon.code}
                        </p>

                        <p
                          title={coupon.description ?? ""}
                          className="mt-1 max-w-[190px] truncate text-xs text-[#73817b]"
                        >
                          {coupon.description || "No description"}
                        </p>
                      </td>

                      {/* Discount */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-[#08613f]">
                          {formatCouponDiscount(coupon)}
                        </span>
                      </td>

                      {/* Minimum Order */}
                      <td className="whitespace-nowrap px-5 py-4 text-[#52645b]">
                        {formatAdminMoney(coupon.minOrderAmount)}
                      </td>

                      {/* Usage */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-[#052b24]">
                          {coupon.usedCount} / {coupon.usageLimit ?? "∞"}
                        </p>

                        <p className="mt-1 text-xs text-[#73817b]">
                          Per user: {coupon.perUserLimit ?? "Unlimited"}
                        </p>
                      </td>

                      {/* Validity */}
                      <td className="px-5 py-4 text-xs text-[#52645b]">
                        <p>
                          From: {formatAdminDate(coupon.startDate)}
                        </p>

                        <p className="mt-1">
                          Until: {formatAdminDate(coupon.expiryDate)}
                        </p>

                        {isExpired ? (
                          <p className="mt-1 font-semibold text-red-600">
                            Expired
                          </p>
                        ) : isScheduled ? (
                          <p className="mt-1 font-semibold text-amber-700">
                            Scheduled
                          </p>
                        ) : null}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          aria-label={`Change status for ${coupon.code}`}
                          aria-pressed={coupon.isActive}
                          disabled={busyId !== null}
                          onClick={() => void handleStatus(coupon)}
                          className={`rounded-full px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                            coupon.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {busyId === coupon.id
                            ? "Updating..."
                            : coupon.isActive
                              ? "Active"
                              : "Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={busyId !== null}
                            onClick={() => handleEdit(coupon)}
                            className="flex h-9 items-center gap-1.5 rounded-lg border border-[#d5ddd8] px-3 text-xs font-semibold hover:bg-[#edf7f1] disabled:opacity-50"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={busyId !== null}
                            onClick={() => void handleDelete(coupon)}
                            className="flex h-9 items-center gap-1.5 rounded-lg border border-red-100 px-3 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!couponsQuery.isPending && !couponsQuery.isError && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0ec] p-5">
            <p className="text-xs text-[#73817b]">
              Page {currentPage} of {totalPages}
              {" · "}
              {totalCoupons} coupons
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    page: currentPage - 1,
                  }))
                }
                className="rounded-full border border-[#d5ddd8] px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    page: currentPage + 1,
                  }))
                }
                className="rounded-full border border-[#d5ddd8] px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Create / Edit Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-3 sm:p-5">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="coupon-dialog-title"
            className="max-h-[92dvh] w-full max-w-[700px] overflow-y-auto rounded-[22px] bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="coupon-dialog-title"
                  className="text-xl font-bold text-[#052b24]"
                >
                  {editingCoupon
                    ? "Edit Coupon"
                    : "Create New Coupon"}
                </h2>

                <p className="mt-1 text-xs text-[#73817b]">
                  Enter discount rules and validity dates.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                aria-label="Close coupon form"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf7f1]"
              >
                <X size={18} />
              </button>
            </div>

            <AdminCouponForm
              key={editingCoupon?.id ?? "new"}
              coupon={editingCoupon}
              onClose={handleCloseForm}
              onSaved={handleSaved}
            />
          </section>
        </div>
      )}
    </>
  );
}
