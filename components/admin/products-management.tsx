"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Pencil, Plus, RefreshCw, Star, Trash2, X } from "lucide-react";

import { toast } from "sonner";

import AdminProductForm from "@/components/form/admin-product-form";
import AdminProductFilterForm from "@/components/form/admin-product-filter-form";

import {
  useAdminProducts,
  useAdminProductActions,
} from "@/hooks/admin-product.hook";

import { formatAdminMoney } from "@/lib/admin";
import { getErrorMessage } from "@/lib/utils";

import type { Product } from "@/types/product.type";
import type { AdminProductQuery } from "@/types/admin-product.type";

const defaultFilters: AdminProductQuery = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export default function ProductsManagement() {
  const [filters, setFilters] = useState<AdminProductQuery>(defaultFilters);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [busyId, setBusyId] = useState<string | null>(null);

  const productsQuery = useAdminProducts(filters);
  const actions = useAdminProductActions();

  const products = productsQuery.data?.products ?? [];
  const pagination = productsQuery.data?.pagination;

  // Close modal using Escape key
  useEffect(() => {
    if (!formOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFormOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [formOpen]);

  // Open Create Form
  const handleCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  // Open Edit Form
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  // Close Form
  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  // After create or edit
  const handleSaved = () => {
    if (!editingProduct) {
      setFilters(defaultFilters);
    }

    handleCloseForm();
  };

  // Change Product Availability
  const handleAvailability = async (product: Product) => {
    setBusyId(product.id);

    try {
      await actions.changeAvailability.mutateAsync({
        id: product.id,
        isAvailable: !product.isAvailable,
      });

      toast.success("Product availability updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  // Change Product Featured Status
  const handleFeatured = async (product: Product) => {
    setBusyId(product.id);

    try {
      await actions.changeFeatured.mutateAsync({
        id: product.id,
        isFeatured: !product.isFeatured,
      });

      toast.success("Featured status updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  // Delete Product
  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) return;

    setBusyId(product.id);

    try {
      await actions.deleteProduct.mutateAsync(product.id);

      toast.success("Product deleted successfully");
    } catch (error) {
      // Backend returns 409 when product is used in orders
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  // Pagination
  const handlePageChange = (page: number) => {
    setFilters((current) => ({
      ...current,
      page,
    }));
  };

  return (
    <>
      <section className="overflow-hidden rounded-[22px] border border-[#e9eee9] bg-white shadow-sm">
        {/* Table Header */}
        <div className="border-b border-[#edf0ec] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">All Products</h2>

              <p className="mt-1 text-xs text-[#73817b]">
                Manage your restaurant menu and availability
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Refresh */}
              <button
                type="button"
                aria-label="Refresh products"
                onClick={() => void productsQuery.refetch()}
                disabled={productsQuery.isFetching}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5ddd8] disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={productsQuery.isFetching ? "animate-spin" : ""}
                />
              </button>

              {/* Add Product */}
              <button
                type="button"
                onClick={handleCreate}
                className="flex h-11 items-center gap-2 rounded-full bg-[#ffcc00] px-5 text-sm font-semibold text-[#052b24] hover:bg-[#f2c200]"
              >
                <Plus size={17} />
                Add Product
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-5">
            <AdminProductFilterForm
              onApply={({ search, categoryId }) => {
                setFilters({
                  ...defaultFilters,
                  search: search || undefined,
                  categoryId: categoryId || undefined,
                });
              }}
            />
          </div>
        </div>

        {/* Loading */}
        {productsQuery.isPending ? (
          <p role="status" className="p-10 text-center text-sm text-[#73817b]">
            Loading products...
          </p>
        ) : productsQuery.isError ? (
          /* Error */
          <div role="alert" className="p-10 text-center text-sm">
            <p>{getErrorMessage(productsQuery.error)}</p>

            <button
              type="button"
              onClick={() => void productsQuery.refetch()}
              className="mt-3 font-semibold text-[#08613f] underline"
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="p-10 text-center">
            <p className="text-sm font-medium">No products found.</p>

            <p className="mt-2 text-xs text-[#73817b]">
              Try another search or add a new product.
            </p>
          </div>
        ) : (
          /* Product Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-[#f8faf7] text-xs text-[#73817b]">
                <tr>
                  {[
                    "Product",
                    "Category",
                    "Price",
                    "Availability",
                    "Featured",
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
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#fafcf9]">
                    {/* Image and Product Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-xl bg-[#edf7f1]">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="60px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <p
                            title={product.name}
                            className="max-w-[200px] truncate font-semibold text-[#052b24]"
                          >
                            {product.name}
                          </p>

                          <p className="mt-1 max-w-[200px] truncate text-xs text-[#73817b]">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-[#52645b]">
                      {product.category.name}
                    </td>

                    {/* Price */}
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#052b24]">
                      {formatAdminMoney(product.price)}
                    </td>

                    {/* Availability */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        disabled={busyId !== null}
                        onClick={() => void handleAvailability(product)}
                        aria-label={`Change availability for ${product.name}`}
                        aria-pressed={product.isAvailable}
                        className={`rounded-full px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                          product.isAvailable
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {busyId === product.id
                          ? "Updating..."
                          : product.isAvailable
                            ? "Available"
                            : "Unavailable"}
                      </button>
                    </td>

                    {/* Featured */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        disabled={busyId !== null}
                        onClick={() => void handleFeatured(product)}
                        aria-label={`Change featured status for ${product.name}`}
                        aria-pressed={product.isFeatured}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                          product.isFeatured
                            ? "bg-amber-50 text-amber-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Star
                          size={13}
                          fill={product.isFeatured ? "currentColor" : "none"}
                        />
                        {product.isFeatured ? "Featured" : "Normal"}
                      </button>
                    </td>

                    {/* Edit and Delete */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={busyId !== null}
                          onClick={() => handleEdit(product)}
                          className="flex h-9 items-center gap-1.5 rounded-lg border border-[#d5ddd8] px-3 text-xs font-semibold hover:bg-[#edf7f1] disabled:opacity-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={busyId !== null}
                          onClick={() => void handleDelete(product)}
                          className="flex h-9 items-center gap-1.5 rounded-lg border border-red-100 px-3 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          Delete
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
        {pagination && !productsQuery.isError && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0ec] p-5">
            <p className="text-xs text-[#73817b]">
              Page {pagination.currentPage} of{" "}
              {Math.max(1, pagination.totalPages)} · {pagination.totalProducts}{" "}
              products
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={filters.page <= 1 || productsQuery.isFetching}
                onClick={() => handlePageChange(filters.page - 1)}
                className="rounded-full border border-[#d5ddd8] px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={
                  filters.page >= pagination.totalPages ||
                  productsQuery.isFetching
                }
                onClick={() => handlePageChange(filters.page + 1)}
                className="rounded-full border border-[#d5ddd8] px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Add / Edit Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-3 sm:p-5">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-dialog-title"
            className="max-h-[92dvh] w-full max-w-[620px] overflow-y-auto rounded-[22px] bg-white p-5 shadow-2xl sm:p-7"
          >
            {/* Modal Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="product-dialog-title"
                  className="text-xl font-bold text-[#052b24]"
                >
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>

                <p className="mt-1 text-xs text-[#73817b]">
                  Fill in the product details below.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                aria-label="Close product form"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf7f1]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Product Form */}
            <AdminProductForm
              key={editingProduct?.id ?? "new"}
              product={editingProduct}
              onClose={handleCloseForm}
              onSaved={handleSaved}
            />
          </section>
        </div>
      )}
    </>
  );
}
