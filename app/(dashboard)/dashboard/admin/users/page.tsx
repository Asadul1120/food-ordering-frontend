import UsersManagement from "@/components/admin/users-management";

export const instant = false;

export default function AdminUsersPage() {
  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[2px] text-[#08613f]">
          Restaurant operations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#052b24]">
          User Management
        </h1>

        <p className="mt-2 text-sm text-[#73817b]">
          View customer and staff accounts, update user information, manage
          roles and control account access.
        </p>
      </div>

      <UsersManagement />
    </div>
  );
}
