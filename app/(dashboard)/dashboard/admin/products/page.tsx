import ProductsManagement from "@/components/admin/products-management";

export const instant = false;

export default function AdminProductsPage() {
  return (
    <div>
      {/* Page Heading */}
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[2px] text-[#08613f]">
          Restaurant operations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#052b24]">
          Product Management
        </h1>

        <p className="mt-2 text-sm text-[#73817b]">
          Add, edit and manage products, prices, availability and featured
          items.
        </p>
      </div>

      {/* Product Management Table */}
      <ProductsManagement />
    </div>
  );
}
