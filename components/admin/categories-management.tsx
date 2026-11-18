"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  FolderOpen,
  ImageIcon,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

import { toast } from "sonner";

import AdminCategoryForm from "@/components/form/admin-category-form";
import AdminCategoryFilterForm from "@/components/form/admin-category-filter-form";

import type { CategoryFilters } from "@/components/form/admin-category-filter-form";

import {
  useAdminCategories,
  useAdminCategoryActions,
} from "@/hooks/admin-category.hook";

import { formatAdminDate } from "@/lib/admin";
import { getErrorMessage } from "@/lib/utils";

import type { AdminCategory } from "@/types/admin-category.type";

const PAGE_SIZE = 10;

export default function CategoriesManagement() {
  // Category filters
  const [filters, setFilters] = useState<CategoryFilters>({
    search: "",
    status: "ALL",
  });

  const [page, setPage] = useState(1);

  // Add / Edit Modal
  const [formOpen, setFormOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(
    null,
  );

  // Track which category is being updated
  const [busyId, setBusyId] = useState<string | null>(null);

  // Backend data
  const categoriesQuery = useAdminCategories();
  const actions = useAdminCategoryActions();

  const categories = categoriesQuery.data ?? [];

  // Summary calculations
  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.isActive,
  ).length;

  const inactiveCategories = totalCategories - activeCategories;

  // Search and status filtering
  const filteredCategories = categories.filter((category) => {
    const keyword = filters.search.toLowerCase();

    const matchesSearch =
      category.name.toLowerCase().includes(keyword) ||
      category.slug.toLowerCase().includes(keyword) ||
      (category.description ?? "").toLowerCase().includes(keyword);

    const matchesStatus =
      filters.status === "ALL" ||
      (filters.status === "ACTIVE" && category.isActive) ||
      (filters.status === "INACTIVE" && !category.isActive);

    return matchesSearch && matchesStatus;
  });

  // Client-side pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const visibleCategories = filteredCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Close modal with Escape
  useEffect(() => {
    if (!formOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFormOpen(false);
        setEditingCategory(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [formOpen]);

  // Open create form
  const handleCreate = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  // Open edit form
  const handleEdit = (category: AdminCategory) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  // Close form
  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingCategory(null);
  };

  // After saving
  const handleSaved = () => {
    handleCloseForm();
    setPage(1);
  };

  // Apply filters
  const handleFilter = (value: CategoryFilters) => {
    setFilters(value);
    setPage(1);
  };

  // Activate / Deactivate category
  const handleStatus = async (category: AdminCategory) => {
    // Deactivation may hide products from public menu
    if (category.isActive) {
      const confirmed = window.confirm(
        `Deactivate "${category.name}"?\n\nIts products will be hidden from the public menu.`,
      );

      if (!confirmed) return;
    }

    setBusyId(category.id);

    try {
      await actions.updateStatus.mutateAsync({
        id: category.id,
        isActive: !category.isActive,
      });

      toast.success(
        category.isActive
          ? "Category deactivated successfully"
          : "Category activated successfully",
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  // Delete category
  const handleDelete = async (category: AdminCategory) => {
    const confirmed = window.confirm(
      `Delete "${category.name}" permanently?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    setBusyId(category.id);

    try {
      await actions.deleteCategory.mutateAsync(category.id);

      toast.success("Category deleted successfully");
    } catch (error) {
      // Backend returns 409 if category contains products
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      {/* Category Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Categories",
            value: totalCategories,
            color: "bg-[#edf7f1] text-[#08613f]",
          },
          {
            label: "Active Categories",
            value: activeCategories,
            color: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "Inactive Categories",
            value: inactiveCategories,
            color: "bg-red-50 text-red-600",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[22px] border border-[#e9eee9] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-[#73817b]">{item.label}</p>

              <span className={`rounded-xl p-3 ${item.color}`}>
                <FolderOpen size={19} />
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">
              {categoriesQuery.isPending
                ? "..."
                : categoriesQuery.isError
                  ? "—"
                  : item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main Category Table */}
      <section className="overflow-hidden rounded-[22px] border border-[#e9eee9] bg-white shadow-sm">
        {/* Table Heading */}
        <div className="border-b border-[#edf0ec] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">All Categories</h2>

              <p className="mt-1 text-xs text-[#73817b]">
                Manage your restaurant menu categories
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Refresh */}
              <button
                type="button"
                aria-label="Refresh categories"
                disabled={categoriesQuery.isFetching}
                onClick={() => void categoriesQuery.refetch()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5ddd8] disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={categoriesQuery.isFetching ? "animate-spin" : ""}
                />
              </button>

              {/* Add Category */}
              <button
                type="button"
                onClick={handleCreate}
                className="flex h-11 items-center gap-2 rounded-full bg-[#ffcc00] px-5 text-sm font-semibold text-[#052b24] hover:bg-[#f2c200]"
              >
                <Plus size={17} />
                Add Category
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-5">
            <AdminCategoryFilterForm onApply={handleFilter} />
          </div>
        </div>

        {/* Loading */}
        {categoriesQuery.isPending ? (
          <p role="status" className="p-10 text-center text-sm text-[#73817b]">
            Loading categories...
          </p>
        ) : categoriesQuery.isError ? (
          /* Error */
          <div role="alert" className="p-10 text-center text-sm">
            <p>{getErrorMessage(categoriesQuery.error)}</p>

            <button
              type="button"
              onClick={() => void categoriesQuery.refetch()}
              className="mt-3 font-semibold text-[#08613f] underline"
            >
              Try again
            </button>
          </div>
        ) : visibleCategories.length === 0 ? (
          /* Empty State */
          <div className="p-10 text-center">
            <p className="text-sm font-medium">No categories found.</p>

            <p className="mt-2 text-xs text-[#73817b]">
              Try another search or add a new category.
            </p>
          </div>
        ) : (
          /* Category Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[#f8faf7] text-xs text-[#73817b]">
                <tr>
                  {[
                    "Category",
                    "Description",
                    "Created",
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
                {visibleCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-[#fafcf9]">
                    {/* Image, Name and Slug */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-[60px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#edf7f1]">
                          {category.imageUrl ? (
                            <Image
                              src={category.imageUrl}
                              alt={category.name}
                              fill
                              sizes="60px"
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon size={23} className="text-[#08613f]" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[190px] truncate font-semibold text-[#052b24]">
                            {category.name}
                          </p>

                          <p className="mt-1 max-w-[190px] truncate text-xs text-[#73817b]">
                            {category.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4 text-[#52645b]">
                      <p
                        title={category.description ?? ""}
                        className="max-w-[230px] truncate"
                      >
                        {category.description || "—"}
                      </p>
                    </td>

                    {/* Created Date */}
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-[#73817b]">
                      {formatAdminDate(category.createdAt)}
                    </td>

                    {/* Active / Inactive */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        aria-label={`Change status for ${category.name}`}
                        aria-pressed={category.isActive}
                        disabled={busyId !== null}
                        onClick={() => void handleStatus(category)}
                        className={`rounded-full px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                          category.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {busyId === category.id
                          ? "Updating..."
                          : category.isActive
                            ? "Active"
                            : "Inactive"}
                      </button>
                    </td>

                    {/* Edit and Delete */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={busyId !== null}
                          onClick={() => handleEdit(category)}
                          className="flex h-9 items-center gap-1.5 rounded-lg border border-[#d5ddd8] px-3 text-xs font-semibold hover:bg-[#edf7f1] disabled:opacity-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={busyId !== null}
                          onClick={() => void handleDelete(category)}
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
        {!categoriesQuery.isPending && !categoriesQuery.isError && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0ec] p-5">
            <p className="text-xs text-[#73817b]">
              Page {currentPage} of {totalPages}
              {" · "}
              {filteredCategories.length} categories
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
                className="rounded-full border border-[#d5ddd8] px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
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
            aria-labelledby="category-dialog-title"
            className="max-h-[92dvh] w-full max-w-[600px] overflow-y-auto rounded-[22px] bg-white p-5 shadow-2xl sm:p-7"
          >
            {/* Modal Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="category-dialog-title"
                  className="text-xl font-bold text-[#052b24]"
                >
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>

                <p className="mt-1 text-xs text-[#73817b]">
                  Fill in the category information below.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                aria-label="Close category form"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf7f1]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Reusable Category Form */}
            <AdminCategoryForm
              key={editingCategory?.id ?? "new"}
              category={editingCategory}
              onClose={handleCloseForm}
              onSaved={handleSaved}
            />
          </section>
        </div>
      )}
    </>
  );
}
