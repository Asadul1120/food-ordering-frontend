import CategoriesManagement from "@/components/admin/categories-management";

export const instant = false;

export default function AdminCategoriesPage() {
  return (
    <div>
      {/* Page Heading */}
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[2px] text-[#08613f]">
          Restaurant operations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#052b24]">
          Category Management
        </h1>

        <p className="mt-2 text-sm text-[#73817b]">
          Add, edit and manage food categories, images and availability.
        </p>
      </div>

      {/* Category Management */}
      <CategoriesManagement />
    </div>
  );
}
