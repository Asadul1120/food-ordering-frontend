
"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { useAdminCategoryActions } from "@/hooks/admin-category.hook";

import {
  adminCategorySchema,
  type AdminCategoryFormValues,
} from "@/validation/admin-category.validation";

import {
  getErrorMessage,
  getFieldError,
} from "@/lib/utils";

import type { AdminCategory } from "@/types/admin-category.type";

type Props = {
  category: AdminCategory | null;
  onClose: () => void;
  onSaved: () => void;
};

const inputClass =
  "h-11 w-full rounded-xl border border-[#d5ddd8] bg-white px-4 text-sm text-[#052b24] outline-none focus:border-[#08613f]";

const labelClass =
  "mb-2 block text-sm font-medium text-[#052b24]";

export default function AdminCategoryForm({
  category,
  onClose,
  onSaved,
}: Props) {
  const isEdit = Boolean(category);

  const actions = useAdminCategoryActions();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const isSaving =
    actions.createCategory.isPending ||
    actions.updateCategory.isPending;

  // Remove temporary image URL when no longer needed
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Handle image selection
  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image cannot exceed 5 MB");
      event.target.value = "";
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const form = useForm({
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
    } as AdminCategoryFormValues,

    validators: {
      onSubmit: adminCategorySchema,
    },

    onSubmit: async ({ value }) => {
      // Backend expects multipart/form-data for image uploads
      const body = new FormData();

      body.append("name", value.name.trim());
      body.append("description", value.description.trim());

      // Slug is optional
      if (value.slug.trim()) {
        body.append("slug", value.slug.trim());
      }

      // Image is optional for both create and edit
      if (image) {
        body.append("image", image);
      }

      try {
        if (category) {
          // Update existing category
          await actions.updateCategory.mutateAsync({
            id: category.id,
            body,
          });

          toast.success("Category updated successfully");
        } else {
          // Create new category
          await actions.createCategory.mutateAsync(body);

          toast.success("Category created successfully");
        }

        onSaved();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();

        void form.handleSubmit();
      }}
      className="space-y-5"
    >
      {/* Category Name */}
      <form.Field name="name">
        {(field) => (
          <div>
            <label htmlFor="category-name" className={labelClass}>
              Category Name
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              id="category-name"
              name={field.name}
              type="text"
              required
              maxLength={80}
              placeholder="e.g. Ready Meals"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(event.target.value)
              }
              className={inputClass}
            />

            {getFieldError(field.state.meta.errors) && (
              <p className="mt-1 text-xs text-red-500">
                {getFieldError(field.state.meta.errors)}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Category Slug */}
      <form.Field name="slug">
        {(field) => (
          <div>
            <label htmlFor="category-slug" className={labelClass}>
              Category Slug
              <span className="ml-2 text-xs font-normal text-[#73817b]">
                (optional)
              </span>
            </label>

            <input
              id="category-slug"
              name={field.name}
              type="text"
              placeholder="e.g. ready-meals"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(
                  event.target.value.toLowerCase(),
                )
              }
              className={inputClass}
            />

            <p className="mt-1 text-xs text-[#73817b]">
              Leave blank to generate automatically from
              an English name.
            </p>

            {getFieldError(field.state.meta.errors) && (
              <p className="mt-1 text-xs text-red-500">
                {getFieldError(field.state.meta.errors)}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Description */}
      <form.Field name="description">
        {(field) => (
          <div>
            <label
              htmlFor="category-description"
              className={labelClass}
            >
              Description
              <span className="ml-2 text-xs font-normal text-[#73817b]">
                (optional)
              </span>
            </label>

            <textarea
              id="category-description"
              name={field.name}
              rows={3}
              maxLength={500}
              placeholder="Write a short category description..."
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(event.target.value)
              }
              className="w-full resize-y rounded-xl border border-[#d5ddd8] bg-white px-4 py-3 text-sm text-[#052b24] outline-none focus:border-[#08613f]"
            />

            {getFieldError(field.state.meta.errors) && (
              <p className="mt-1 text-xs text-red-500">
                {getFieldError(field.state.meta.errors)}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Category Image */}
      <div>
        <label htmlFor="category-image" className={labelClass}>
          Category Image
          <span className="ml-2 text-xs font-normal text-[#73817b]">
            (optional)
          </span>
        </label>

        <div className="flex items-center gap-4 rounded-xl border border-dashed border-[#d5ddd8] p-4">
          {/* Image Preview */}
          <div className="relative flex h-[90px] w-[90px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#edf7f1]">
            {preview || category?.imageUrl ? (
              <Image
                src={preview || category!.imageUrl!}
                alt="Category image preview"
                fill
                sizes="90px"
                unoptimized={Boolean(preview)}
                className="object-cover"
              />
            ) : (
              <ImagePlus
                size={30}
                className="text-[#08613f]"
              />
            )}
          </div>

          {/* Image Input */}
          <div className="min-w-0 flex-1">
            <input
              id="category-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-xs file:mr-2 file:rounded-full file:border-0 file:bg-[#edf7f1] file:px-3 file:py-2 file:font-semibold file:text-[#08613f]"
            />

            <p className="mt-2 text-xs text-[#73817b]">
              JPG, PNG or other supported images · Max 5 MB
            </p>

            {isEdit && (
              <p className="mt-1 text-xs text-[#73817b]">
                Leave empty to keep the current image.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex justify-end gap-3 border-t border-[#edf0ec] pt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="h-11 rounded-full border border-[#d5ddd8] px-6 text-sm font-semibold disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="h-11 rounded-full bg-[#ffcc00] px-6 text-sm font-semibold text-[#052b24] hover:bg-[#f2c200] disabled:opacity-50"
        >
          {isSaving
            ? "Saving..."
            : isEdit
              ? "Update Category"
              : "Create Category"}
        </button>
      </div>
    </form>
  );
}
