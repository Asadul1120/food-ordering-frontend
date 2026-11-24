"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";

import { Heart, Eye, RefreshCw, X, MapPin, Trash2 } from "lucide-react";

import { toast } from "sonner";

import AdminWishlistFilterForm from "@/components/form/admin-wishlist-filter-form";

import type { WishlistFilters } from "@/components/form/admin-wishlist-filter-form";

import {
  useAdminWishlists,
  useAdminWishlist,
  useAdminWishlistActions,
} from "@/hooks/admin-wishlist.hook";

import type {
  AdminWishlist,
  AdminWishlistQuery,
  WishlistStatus,
} from "@/types/admin-wishlist.type";

import { formatAdminDate } from "@/lib/admin";
import { getErrorMessage } from "@/lib/utils";

// Default Filters
const defaultFilters: AdminWishlistQuery = {
  page: 1,
  limit: 10,
};

// Status Labels
const statusLabels: Record<WishlistStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

// Status Colors
const statusColors: Record<WishlistStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
};

// Wishlist Review Form Props
type WishlistReviewFormProps = {
  wishlist: AdminWishlist;
  isSaving: boolean;
  onSave: (status: WishlistStatus, adminNote: string) => Promise<void>;
  onClose: () => void;
};

// 1. Wishlist Review Form
function WishlistReviewForm({
  wishlist,
  isSaving,
  onSave,
  onClose,
}: WishlistReviewFormProps) {
  const [status, setStatus] = useState<WishlistStatus>(wishlist.status);

  const [adminNote, setAdminNote] = useState(wishlist.adminNote ?? "");

  const customerAddress =
    wishlist.customerAddress ||
    wishlist.currentProfileAddress ||
    "No address provided";

  // Handle Form Submit
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSave(status, adminNote.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Customer Information */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Customer Information</h3>

        <div className="grid gap-4 rounded-xl bg-[#faf7f0] p-4 text-sm sm:grid-cols-2">
          {/* Customer Name */}
          <div>
            <p className="text-xs text-[#73817b]">Customer Name</p>

            <p className="mt-1 font-semibold">{wishlist.customerName}</p>
          </div>

          {/* Customer Type */}
          <div>
            <p className="text-xs text-[#73817b]">Customer Type</p>

            <p className="mt-1 font-semibold">
              {wishlist.userId ? "Registered Customer" : "No linked account"}
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <p className="text-xs text-[#73817b]">Phone Number</p>

            <p className="mt-1 font-medium">
              {wishlist.customerPhone ?? "Not provided"}
            </p>
          </div>

          {/* Email Address */}
          <div className="min-w-0">
            <p className="text-xs text-[#73817b]">Email Address</p>

            <p className="mt-1 break-all font-medium">
              {wishlist.customerEmail ?? "Not provided"}
            </p>
          </div>

          {/* Customer Location */}
          <div className="border-t border-[#e3e9e4] pt-4 sm:col-span-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e5f2ea] text-[#08613f]">
                <MapPin size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#73817b]">Customer Location</p>

                <p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium leading-6">
                  {customerAddress}
                </p>

                {!wishlist.customerAddress &&
                  wishlist.currentProfileAddress && (
                    <p className="mt-1 text-xs text-[#73817b]">
                      Current saved profile address
                    </p>
                  )}

                {wishlist.customerAddress &&
                  wishlist.currentProfileAddress &&
                  wishlist.customerAddress !==
                    wishlist.currentProfileAddress && (
                    <div className="mt-3">
                      <p className="text-xs text-[#73817b]">
                        Current Profile Address
                      </p>

                      <p className="mt-1 break-words text-sm">
                        {wishlist.currentProfileAddress}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Information */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Food Information</h3>

        <div className="space-y-4 rounded-xl border border-[#edf0ec] p-4">
          {/* Food Name */}
          <div>
            <p className="text-xs text-[#73817b]">Food Name</p>

            <p className="mt-1 break-words font-semibold">
              {wishlist.foodName}
            </p>
          </div>

          {/* Food Description */}
          <div>
            <p className="text-xs text-[#73817b]">Food Description</p>

            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6">
              {wishlist.foodDescription}
            </p>
          </div>

          {/* Expected Time */}
          <div>
            <p className="text-xs text-[#73817b]">Expected Date & Time</p>

            <p className="mt-1 text-sm font-semibold">
              {formatAdminDate(wishlist.expectedTime)}
            </p>
          </div>

          {/* Submitted Time */}
          <div>
            <p className="text-xs text-[#73817b]">Submitted At</p>

            <p className="mt-1 text-sm">
              {formatAdminDate(wishlist.createdAt)}
            </p>
          </div>

        </div>
      </div>

      {/* Current Status */}
      <div className="flex items-center justify-between rounded-xl bg-[#faf7f0] p-4">
        <p className="text-sm font-semibold">Current Status</p>

        <span
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            statusColors[wishlist.status]
          }`}
        >
          {statusLabels[wishlist.status]}
        </span>
      </div>

      {/* Update Status */}
      <div>
        <label
          htmlFor="wishlist-status"
          className="mb-2 block text-sm font-semibold"
        >
          Update Wishlist Status
        </label>

        <select
          id="wishlist-status"
          value={status}
          disabled={isSaving}
          onChange={(event) => setStatus(event.target.value as WishlistStatus)}
          className="h-11 w-full rounded-xl border border-[#d5ddd8] bg-white px-4 text-sm outline-none focus:border-[#08613f] disabled:opacity-50"
        >
          <option value="PENDING">Pending</option>

          <option value="APPROVED">Approved</option>

          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Admin Note */}
      <div>
        <label
          htmlFor="admin-note"
          className="mb-2 block text-sm font-semibold"
        >
          Admin Note
          <span className="ml-1 font-normal text-[#73817b]">(Optional)</span>
        </label>

        <textarea
          id="admin-note"
          value={adminNote}
          rows={4}
          maxLength={500}
          disabled={isSaving}
          onChange={(event) => setAdminNote(event.target.value)}
          placeholder="Write a response for the customer..."
          className="w-full resize-y rounded-xl border border-[#d5ddd8] p-4 text-sm outline-none focus:border-[#08613f] disabled:opacity-50"
        />

        <div className="mt-1 flex justify-between gap-3">
          <p className="text-xs text-[#73817b]">
            This note is visible to the registered customer.
          </p>

          <p className="text-xs text-[#73817b]">{adminNote.length}/500</p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 border-t border-[#edf0ec] pt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="rounded-full border border-[#d5ddd8] px-5 py-3 text-sm font-medium hover:bg-[#faf7f0] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-full bg-[#08613f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#064d34] disabled:opacity-50"
        >
          {isSaving && <RefreshCw size={15} className="animate-spin" />}

          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

// Wishlist Details Props
type WishlistDetailsProps = {
  id: string;
  onClose: () => void;
};

// 2. Wishlist Review Modal
function WishlistDetails({ id, onClose }: WishlistDetailsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const wishlistQuery = useAdminWishlist(id);

  const { updateStatus } = useAdminWishlistActions();

  const wishlist = wishlistQuery.data;

  // Open Modal
  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    return () => {
      dialog?.close();
    };
  }, []);

  // Handle Close Modal
  const handleClose = () => {
    if (updateStatus.isPending) {
      return;
    }

    onClose();
  };

  // Handle Update Status
  const handleUpdate = async (status: WishlistStatus, adminNote: string) => {
    try {
      const response = await updateStatus.mutateAsync({
        id,

        body: {
          status,
          adminNote,
        },
      });

      toast.success(response.message || "Wishlist updated successfully");

      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="wishlist-details-title"
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-32px)] max-w-2xl overflow-y-auto rounded-3xl border-0 bg-white p-5 text-[#052b24] shadow-xl backdrop:bg-black/40 sm:p-7"
    >
      {/* Modal Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 id="wishlist-details-title" className="text-xl font-bold">
            Review Wishlist
          </h2>

          <p className="mt-1 text-xs text-[#73817b]">
            Review the customer food request and update its status.
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={updateStatus.isPending}
          aria-label="Close wishlist details"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf7f1] hover:bg-[#dceee3] disabled:opacity-50"
        >
          <X size={18} />
        </button>
      </div>

      {/* Loading State */}
      {wishlistQuery.isPending && (
        <div role="status" className="py-12 text-center">
          <RefreshCw
            size={24}
            className="mx-auto mb-3 animate-spin text-[#08613f]"
          />

          <p className="text-sm text-[#73817b]">Loading wishlist details...</p>
        </div>
      )}

      {/* Error State */}
      {wishlistQuery.isError && (
        <div role="alert" className="py-8 text-center">
          <p className="text-sm text-red-500">
            {getErrorMessage(wishlistQuery.error)}
          </p>

          <button
            type="button"
            onClick={() => void wishlistQuery.refetch()}
            className="mt-3 rounded-full border border-[#d5ddd8] px-5 py-2 text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Wishlist Review Form */}
      {!wishlistQuery.isError && wishlist && (
        <WishlistReviewForm
          key={wishlist.id}
          wishlist={wishlist}
          isSaving={updateStatus.isPending}
          onSave={handleUpdate}
          onClose={handleClose}
        />
      )}
    </dialog>
  );
}

// 3. Main Wishlist Management Component
export default function WishlistsManagement() {
  const [filters, setFilters] = useState<AdminWishlistQuery>(defaultFilters);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const wishlistsQuery = useAdminWishlists(filters);

  const { deleteWishlist } = useAdminWishlistActions();

  const wishlists = wishlistsQuery.data?.wishlists ?? [];

  const pagination = wishlistsQuery.data?.pagination;

  const totalWishlists = pagination?.totalWishlists ?? 0;

  const currentPage = pagination?.currentPage ?? filters.page;

  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  // Apply Filters
  const handleFilter = (value: WishlistFilters) => {
    setSelectedId(null);

    setFilters({
      page: 1,
      limit: 10,

      ...(value.search && {
        search: value.search,
      }),

      ...(value.status !== "ALL" && {
        status: value.status,
      }),
    });
  };

  // Change Page
  const handlePageChange = (page: number) => {
    setSelectedId(null);

    setFilters((current) => ({
      ...current,
      page,
    }));
  };

  // Fix Pagination After Delete or Status Update
  useEffect(() => {
    if (pagination && filters.page > totalPages) {
      setFilters((current) => ({
        ...current,
        page: totalPages,
      }));
    }
  }, [pagination, filters.page, totalPages]);

  // Handle Delete Wishlist
  const handleDelete = async (wishlist: AdminWishlist) => {
    if (deletingId !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${wishlist.foodName}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(wishlist.id);

    try {
      const response = await deleteWishlist.mutateAsync(wishlist.id);

      toast.success(response.message || "Wishlist deleted successfully");

      // Close Review Modal If Needed
      setSelectedId((current) => (current === wishlist.id ? null : current));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Total Wishlist Card */}
      <div className="rounded-[22px] border border-[#edf0ec] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf7f1] text-[#08613f]">
            <Heart size={24} />
          </div>

          <div>
            <p className="text-sm text-[#73817b]">Matching Wishlist Requests</p>

            <h2 className="mt-1 text-2xl font-bold">
              {wishlistsQuery.isPending || wishlistsQuery.isError
                ? "—"
                : totalWishlists}
            </h2>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <section className="rounded-[22px] border border-[#edf0ec] bg-white p-5 shadow-sm">
        <AdminWishlistFilterForm onApply={handleFilter} />
      </section>

      {/* Wishlist Table */}
      <section className="overflow-hidden rounded-[22px] border border-[#edf0ec] bg-white shadow-sm">
        {/* Table Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#edf0ec] p-5">
          <div>
            <h2 className="text-lg font-bold">Wishlist Requests</h2>

            <p className="mt-1 text-xs text-[#73817b]">
              Review and manage customer food requests.
            </p>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            disabled={wishlistsQuery.isFetching}
            onClick={() => void wishlistsQuery.refetch()}
            className="flex items-center gap-2 rounded-full border border-[#d5ddd8] px-4 py-2 text-sm hover:bg-[#faf7f0] disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={wishlistsQuery.isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {wishlistsQuery.isPending && (
          <div role="status" className="p-12 text-center">
            <RefreshCw
              size={25}
              className="mx-auto mb-3 animate-spin text-[#08613f]"
            />

            <p className="text-sm text-[#73817b]">Loading wishlists...</p>
          </div>
        )}

        {/* Error State */}
        {wishlistsQuery.isError && (
          <div role="alert" className="p-12 text-center">
            <p className="text-sm text-red-500">
              {getErrorMessage(wishlistsQuery.error)}
            </p>

            <button
              type="button"
              onClick={() => void wishlistsQuery.refetch()}
              className="mt-4 rounded-full bg-[#08613f] px-5 py-2 text-sm text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!wishlistsQuery.isPending &&
          !wishlistsQuery.isError &&
          wishlists.length === 0 && (
            <div className="flex flex-col items-center p-12 text-center">
              <Heart size={38} className="mb-4 text-[#73817b]" />

              <h3 className="font-semibold">No wishlists found</h3>

              <p className="mt-2 text-sm text-[#73817b]">
                No food requests match your filters.
              </p>
            </div>
          )}

        {/* Wishlist Table */}
        {!wishlistsQuery.isPending &&
          !wishlistsQuery.isError &&
          wishlists.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                {/* Table Head */}
                <thead className="bg-[#faf7f0] text-xs text-[#73817b]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      Food Information
                    </th>

                    <th className="px-5 py-4 font-semibold">Customer</th>

                    <th className="px-5 py-4 font-semibold">Expected Time</th>

                    <th className="px-5 py-4 font-semibold">Status</th>

                    <th className="px-5 py-4 font-semibold">Submitted At</th>

                    <th className="px-5 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {wishlists.map((wishlist) => (
                    <tr
                      key={wishlist.id}
                      className="border-t border-[#edf0ec] transition-colors hover:bg-[#fafcfb]"
                    >
                      {/* Food Information */}
                      <td className="max-w-[260px] px-5 py-4">
                        <p className="break-words font-semibold">
                          {wishlist.foodName}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs text-[#73817b]">
                          {wishlist.foodDescription}
                        </p>
                      </td>

                      {/* Customer Information */}
                      <td className="px-5 py-4">
                        <p className="font-semibold">{wishlist.customerName}</p>

                        <p className="mt-1 text-xs text-[#73817b]">
                          {wishlist.customerPhone ?? "No phone"}
                        </p>

                        <p className="mt-1 text-xs text-[#08613f]">
                          {wishlist.userId ? "Registered" : "No linked account"}
                        </p>
                      </td>

                      {/* Expected Time */}
                      <td className="whitespace-nowrap px-5 py-4">
                        {formatAdminDate(wishlist.expectedTime)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            statusColors[wishlist.status]
                          }`}
                        >
                          {statusLabels[wishlist.status]}
                        </span>
                      </td>

                      {/* Submitted At */}
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-[#73817b]">
                        {formatAdminDate(wishlist.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {/* Review Button */}
                          <button
                            type="button"
                            disabled={deletingId !== null}
                            onClick={() => setSelectedId(wishlist.id)}
                            className="flex h-9 items-center gap-1.5 rounded-lg border border-[#d5ddd8] px-3 text-xs font-semibold transition-colors hover:bg-[#edf7f1] disabled:opacity-50"
                          >
                            <Eye size={14} />
                            Review
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            disabled={deletingId !== null}
                            onClick={() => void handleDelete(wishlist)}
                            className="flex h-9 items-center gap-1.5 rounded-lg border border-red-100 px-3 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === wishlist.id ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}

                            {deletingId === wishlist.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        {/* Pagination */}
        {!wishlistsQuery.isPending && !wishlistsQuery.isError && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0ec] p-5">
            <p className="text-xs text-[#73817b]">
              Page {currentPage} of {totalPages}
              {" · "}
              {totalWishlists} requests
            </p>

            <div className="flex gap-2">
              {/* Previous Page */}
              <button
                type="button"
                disabled={
                  currentPage <= 1 ||
                  wishlistsQuery.isFetching ||
                  deletingId !== null
                }
                onClick={() => handlePageChange(currentPage - 1)}
                className="rounded-full border border-[#d5ddd8] px-4 py-2 text-sm hover:bg-[#faf7f0] disabled:opacity-40"
              >
                Previous
              </button>

              {/* Next Page */}
              <button
                type="button"
                disabled={
                  currentPage >= totalPages ||
                  wishlistsQuery.isFetching ||
                  deletingId !== null
                }
                onClick={() => handlePageChange(currentPage + 1)}
                className="rounded-full border border-[#d5ddd8] px-4 py-2 text-sm hover:bg-[#faf7f0] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Wishlist Review Modal */}
      {selectedId && (
        <WishlistDetails
          key={selectedId}
          id={selectedId}
          onClose={() =>
            setSelectedId((current) =>
              current === selectedId ? null : current,
            )
          }
        />
      )}
    </div>
  );
}
