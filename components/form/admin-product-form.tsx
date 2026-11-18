"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";

import { useCategories } from "@/hooks/category.hook";
import { useAdminProductActions } from "@/hooks/admin-product.hook";

import {
  adminProductSchema,
  type AdminProductFormValues,
} from "@/validation/admin-product.validation";

import { getErrorMessage, getFieldError } from "@/lib/utils";

import type { Product } from "@/types/product.type";

type Props = {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
};

const inputClass =
  "h-11 w-full rounded-xl border border-[#d5ddd8] bg-white px-4 text-sm text-[#052b24] outline-none focus:border-[#08613f]";

const labelClass = "mb-2 block text-sm font-medium text-[#052b24]";

function FieldError({ errors }: { errors: readonly unknown[] }) {
  const message = getFieldError(errors);

  if (!message) return null;

  return (
    <p role="alert" className="mt-1 text-xs text-red-600">
      {message}
    </p>
  );
}

export default function AdminProductForm({ product, onClose, onSaved }: Props) {
  const isEdit = Boolean(product);

  const categoriesQuery = useCategories();
  const categories = categoriesQuery.data?.data ?? [];

  const actions = useAdminProductActions();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const isSaving =
    actions.createProduct.isPending || actions.updateProduct.isPending;

  // Clean up temporary image preview
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      event.target.value = "";
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const form = useForm({
    defaultValues: {
      name: product?.name ?? "",
      categoryId: product?.categoryId ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      price: product?.price ?? "",
      preparationTime: String(product?.preparationTime ?? ""),
    } as AdminProductFormValues,

    validators: {
      onSubmit: adminProductSchema,
    },

    onSubmit: async ({ value }) => {
      // New product must contain an image
      if (!isEdit && !image) {
        toast.error("Product image is required");
        return;
      }

      const body = new FormData();

      body.append("name", value.name.trim());
      body.append("categoryId", value.categoryId);
      body.append("price", value.price.trim());
      body.append("description", value.description.trim());
      body.append("preparationTime", value.preparationTime.trim());

      // Backend generates slug if not provided
      if (value.slug.trim()) {
        body.append("slug", value.slug.trim());
      }

      if (image) {
        body.append("image", image);
      }

      try {
        if (product) {
          await actions.updateProduct.mutateAsync({
            id: product.id,
            body,
          });

          toast.success("Product updated successfully");
        } else {
          await actions.createProduct.mutateAsync(body);

          toast.success("Product created successfully");
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
      {/* Product Name */}
      <form.Field name="name">
        {(field) => (
          <div>
            <label htmlFor="product-name" className={labelClass}>
              Product name <span className="text-red-500">*</span>
            </label>

            <input
              id="product-name"
              name={field.name}
              type="text"
              required
              maxLength={100}
              placeholder="e.g. Chicken Biryani"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              className={inputClass}
            />

            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      {/* Category */}
      <form.Field name="categoryId">
        {(field) => (
          <div>
            <label htmlFor="product-category" className={labelClass}>
              Category <span className="text-red-500">*</span>
            </label>

            <select
              id="product-category"
              name={field.name}
              required
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              className={inputClass}
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {categoriesQuery.isError && (
              <p className="mt-1 text-xs text-red-500">
                Could not load categories.
              </p>
            )}

            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      {/* Price and Preparation Time */}
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="price">
          {(field) => (
            <div>
              <label htmlFor="product-price" className={labelClass}>
                Price (৳) <span className="text-red-500">*</span>
              </label>

              <input
                id="product-price"
                name={field.name}
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="e.g. 350"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                className={inputClass}
              />

              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

        <form.Field name="preparationTime">
          {(field) => (
            <div>
              <label htmlFor="product-time" className={labelClass}>
                Preparation time (min)
              </label>

              <input
                id="product-time"
                name={field.name}
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 25"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                className={inputClass}
              />

              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>
      </div>

      {/* Slug */}
      <form.Field name="slug">
        {(field) => (
          <div>
            <label htmlFor="product-slug" className={labelClass}>
              Product slug (optional)
            </label>

            <input
              id="product-slug"
              name={field.name}
              type="text"
              placeholder="e.g. chicken-biryani"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(event.target.value.toLowerCase())
              }
              className={inputClass}
            />

            <p className="mt-1 text-xs text-[#73817b]">
              Leave blank to generate from an English name. For Bengali names,
              provide an English slug.
            </p>

            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      {/* Description */}
      <form.Field name="description">
        {(field) => (
          <div>
            <label htmlFor="product-description" className={labelClass}>
              Description (optional)
            </label>

            <textarea
              id="product-description"
              name={field.name}
              rows={3}
              maxLength={1000}
              placeholder="Write a short product description..."
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              className="w-full resize-y rounded-xl border border-[#d5ddd8] bg-white px-4 py-3 text-sm text-[#052b24] outline-none focus:border-[#08613f]"
            />

            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      {/* Product Image */}
      <div>
        <label htmlFor="product-image" className={labelClass}>
          Product image {!isEdit && <span className="text-red-500">*</span>}
        </label>

        <div className="flex items-center gap-4 rounded-xl border border-dashed border-[#d5ddd8] p-4">
          <div className="relative flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#edf7f1]">
            {preview || product?.imageUrl ? (
              <Image
                src={preview || product!.imageUrl}
                alt="Product preview"
                fill
                unoptimized={Boolean(preview)}
                sizes="84px"
                className="object-cover"
              />
            ) : (
              <ImagePlus size={28} className="text-[#08613f]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-[#edf7f1] file:px-3 file:py-2 file:font-semibold file:text-[#08613f]"
            />

            <p className="mt-2 text-xs text-[#73817b]">
              Image only · Maximum 5 MB
            </p>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 border-t border-[#edf0ec] pt-5">
        <button
          type="button"
          disabled={isSaving}
          onClick={onClose}
          className="h-11 rounded-full border border-[#d5ddd8] px-6 text-sm font-semibold disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving || categoriesQuery.isError}
          className="h-11 rounded-full bg-[#ffcc00] px-6 text-sm font-semibold text-[#052b24] disabled:opacity-50"
        >
          {isSaving
            ? "Saving..."
            : isEdit
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
}
