"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Eye,
  Pencil,
  RefreshCw,
  Search,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  useAdminUser,
  useAdminUserActions,
  useAdminUsers,
} from "@/hooks/admin-user.hook";
import { useGetMe } from "@/hooks/auth.hook";
import { formatAdminDate } from "@/lib/admin";
import { getErrorMessage } from "@/lib/utils";

import type {
  AdminUser,
  AdminUserQuery,
  UpdateAdminUserBody,
} from "@/types/admin-user.type";
import type { UserRole } from "@/types/auth.type";

const roleOptions: UserRole[] = ["ADMIN", "STAFF", "CUSTOMER"];

const roleStyles: Record<UserRole, string> = {
  ADMIN: "bg-violet-50 text-violet-700",
  STAFF: "bg-blue-50 text-blue-700",
  CUSTOMER: "bg-slate-100 text-slate-700",
};

function UserDetailsDialog({
  id,
  currentAdminId,
  onClose,
}: {
  id: string;
  currentAdminId?: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const userQuery = useAdminUser(id);
  const { updateUser } = useAdminUserActions();

  const user = userQuery.data;
  const isCurrentAdmin = user?.id === currentAdminId;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("CUSTOMER");

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();

    return () => dialog?.close();
  }, []);

  useEffect(() => {
    if (!user) return;

    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone ?? "");
    setRole(user.role);
  }, [user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body: UpdateAdminUserBody = {
      name: name.trim(),
      email: email.trim(),
      role,
      ...(phone.trim() ? { phone: phone.trim() } : {}),
    };

    try {
      const response = await updateUser.mutateAsync({ id, body });
      toast.success(response.message || "User updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      aria-labelledby="admin-user-dialog-title"
      className="fixed inset-0 m-auto max-h-[88vh] w-[calc(100%-24px)] max-w-xl overflow-y-auto rounded-3xl border-0 bg-white p-0 text-[#052b24] shadow-2xl backdrop:bg-black/40"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#edf0ec] bg-white px-5 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[1.5px] text-[#08613f]">
            Account information
          </p>
          <h2
            id="admin-user-dialog-title"
            className="mt-1 text-xl font-bold"
          >
            {isEditing ? "Edit user" : "User details"}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close user details"
          className="rounded-full bg-[#edf7f1] p-2 text-[#052b24] hover:bg-[#dcefe3]"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5 sm:p-6">
        {userQuery.isPending ? (
          <p role="status" className="py-10 text-center text-sm text-[#73817b]">
            Loading user details...
          </p>
        ) : userQuery.isError ? (
          <div role="alert" className="py-8 text-center text-sm">
            <p>{getErrorMessage(userQuery.error)}</p>
            <button
              type="button"
              onClick={() => void userQuery.refetch()}
              className="mt-3 text-[#08613f] underline"
            >
              Try again
            </button>
          </div>
        ) : user ? (
          isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-user-name"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Full name
                </label>
                <input
                  id="admin-user-name"
                  required
                  minLength={2}
                  maxLength={80}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-11 w-full rounded-xl border border-[#d5ddd8] px-4 text-sm outline-none focus:border-[#08613f]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-user-email"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Email address
                </label>
                <input
                  id="admin-user-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 w-full rounded-xl border border-[#d5ddd8] px-4 text-sm outline-none focus:border-[#08613f]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-user-phone"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Phone number
                </label>
                <input
                  id="admin-user-phone"
                  type="tel"
                  pattern="\+?[0-9]{8,15}"
                  title="Use 8 to 15 digits, optionally starting with +"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Optional phone number"
                  className="h-11 w-full rounded-xl border border-[#d5ddd8] px-4 text-sm outline-none focus:border-[#08613f]"
                />
                <p className="mt-1.5 text-xs text-[#73817b]">
                  Leave blank to keep the existing number. The current API
                  does not support removing a saved phone number.
                </p>
              </div>

              <div>
                <label
                  htmlFor="admin-user-role"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Account role
                </label>
                <select
                  id="admin-user-role"
                  value={role}
                  disabled={isCurrentAdmin}
                  onChange={(event) => setRole(event.target.value as UserRole)}
                  className="h-11 w-full rounded-xl border border-[#d5ddd8] bg-white px-4 text-sm outline-none focus:border-[#08613f] disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {isCurrentAdmin && (
                  <p className="mt-1.5 text-xs text-amber-700">
                    You cannot change your own administrator role here.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t border-[#edf0ec] pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={updateUser.isPending}
                  className="h-10 rounded-full border border-[#d5ddd8] px-5 text-sm font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateUser.isPending}
                  className="h-10 rounded-full bg-[#08613f] px-5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {updateUser.isPending ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="mb-5 flex items-center gap-4 rounded-2xl bg-[#f6faf6] p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e4f1e8] text-[#08613f]">
                  <UserRound size={23} />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold">{user.name}</h3>
                  <p className="break-all text-sm text-[#73817b]">
                    {user.email}
                  </p>
                </div>
              </div>

              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-[#73817b]">Phone</dt>
                  <dd className="mt-1 text-sm font-medium">
                    {user.phone || "Not provided"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#73817b]">Role</dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[user.role]}`}
                    >
                      {user.role}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#73817b]">Account status</dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        user.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#73817b]">Joined</dt>
                  <dd className="mt-1 text-sm font-medium">
                    {formatAdminDate(user.createdAt)}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-[#73817b]">Last updated</dt>
                  <dd className="mt-1 text-sm font-medium">
                    {formatAdminDate(user.updatedAt)}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-[#edf0ec] pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 rounded-full border border-[#d5ddd8] px-5 text-sm font-medium"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-[#08613f] px-5 text-sm font-semibold text-white"
                >
                  <Pencil size={15} />
                  Edit user
                </button>
              </div>
            </>
          )
        ) : null}
      </div>
    </dialog>
  );
}

export default function UsersManagement() {
  const [filters, setFilters] = useState<AdminUserQuery>({
    page: 1,
    limit: 10,
  });
  const [searchInput, setSearchInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<"ALL" | UserRole>("ALL");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const currentUserQuery = useGetMe();
  const currentAdminId = currentUserQuery.data?.data?.id;

  const usersQuery = useAdminUsers(filters);
  const { updateStatus } = useAdminUserActions();

  const users = usersQuery.data?.users ?? [];
  const pagination = usersQuery.data?.pagination;

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilters({
      page: 1,
      limit: 10,
      search: searchInput.trim() || undefined,
      role: selectedRole === "ALL" ? undefined : selectedRole,
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    setSelectedRole("ALL");
    setFilters({ page: 1, limit: 10 });
  };

  const handleStatusChange = async (user: AdminUser) => {
    if (user.id === currentAdminId) {
      toast.error("You cannot deactivate your own administrator account.");
      return;
    }

    const nextStatus = !user.isActive;
    const action = nextStatus ? "activate" : "deactivate";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}'s account?`,
    );

    if (!confirmed) return;

    try {
      const response = await updateStatus.mutateAsync({
        id: user.id,
        isActive: nextStatus,
      });
      toast.success(response.message || "User status updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const goToPage = (page: number) => {
    if (!pagination) return;
    setFilters((current) => ({
      ...current,
      page: Math.max(1, Math.min(pagination.totalPages, page)),
    }));
  };

  return (
    <>
      <section className="overflow-hidden rounded-[22px] border border-[#e9eee9] bg-white shadow-sm">
        <div className="border-b border-[#edf0ec] p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">All users</h2>
              <p className="mt-1 text-xs text-[#73817b]">
                Search accounts, filter by role, edit details and manage access.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-[#edf7f1] px-3 py-2 text-xs font-semibold text-[#08613f]">
              <Users size={15} />
              {pagination ? `${pagination.totalUsers} users` : "User accounts"}
            </div>
          </div>

          <form
            onSubmit={applyFilters}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="relative min-w-[210px] flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#73817b]"
              />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search name, email or phone..."
                className="h-11 w-full rounded-xl border border-[#d5ddd8] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#08613f]"
              />
            </div>

            <select
              aria-label="Filter users by role"
              value={selectedRole}
              onChange={(event) =>
                setSelectedRole(event.target.value as "ALL" | UserRole)
              }
              className="h-11 min-w-[155px] rounded-xl border border-[#d5ddd8] bg-white px-4 text-sm outline-none focus:border-[#08613f]"
            >
              <option value="ALL">All roles</option>
              {roleOptions.map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="h-11 rounded-full bg-[#08613f] px-5 text-sm font-semibold text-white hover:bg-[#064d34]"
            >
              Search
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="h-11 rounded-full border border-[#d5ddd8] px-5 text-sm font-medium"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => void usersQuery.refetch()}
              disabled={usersQuery.isFetching}
              aria-label="Refresh users"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d5ddd8] disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={usersQuery.isFetching ? "animate-spin" : ""}
              />
            </button>
          </form>
        </div>

        {usersQuery.isPending ? (
          <p role="status" className="p-10 text-center text-sm text-[#73817b]">
            Loading users...
          </p>
        ) : usersQuery.isError ? (
          <div role="alert" className="p-10 text-center text-sm">
            <p>{getErrorMessage(usersQuery.error)}</p>
            <button
              type="button"
              onClick={() => void usersQuery.refetch()}
              className="mt-3 text-[#08613f] underline"
            >
              Try again
            </button>
          </div>
        ) : users.length === 0 ? (
          <p className="p-10 text-center text-sm text-[#73817b]">
            No users found for these filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[#f8faf7] text-xs text-[#73817b]">
                <tr>
                  {["User", "Phone", "Role", "Status", "Joined", "Actions"].map(
                    (heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-5 py-4 font-medium"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#edf0ec]">
                {users.map((user) => {
                  const isCurrentUser = user.id === currentAdminId;

                  return (
                    <tr
                      key={user.id}
                      className="align-middle hover:bg-[#fafcf9]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">{user.name}</p>
                        <p className="mt-1 break-all text-xs text-[#73817b]">
                          {user.email}
                        </p>
                        {isCurrentUser && (
                          <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wide text-[#08613f]">
                            Current account
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-[#52615a]">
                        {user.phone || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[user.role]}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-[#73817b]">
                        {formatAdminDate(user.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedUserId(user.id)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#d5ddd8] px-3 py-2 text-xs font-medium hover:bg-[#f6faf6]"
                          >
                            <Eye size={14} />
                            View / edit
                          </button>

                          <button
                            type="button"
                            disabled={
                              isCurrentUser ||
                              updateStatus.isPending
                            }
                            onClick={() => void handleStatusChange(user)}
                            title={
                              isCurrentUser
                                ? "You cannot deactivate your own account"
                                : undefined
                            }
                            className={`rounded-full px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${
                              user.isActive
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
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

        {pagination && !usersQuery.isError && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0ec] p-5">
            <p className="text-xs text-[#73817b]">
              Page {pagination.currentPage} of {Math.max(1, pagination.totalPages)}
              {" · "}
              {pagination.totalUsers} matching users
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={filters.page <= 1 || usersQuery.isFetching}
                onClick={() => goToPage(filters.page - 1)}
                className="rounded-full border border-[#d5ddd8] px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={
                  filters.page >= pagination.totalPages ||
                  usersQuery.isFetching
                }
                onClick={() => goToPage(filters.page + 1)}
                className="rounded-full border border-[#d5ddd8] px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {selectedUserId && (
        <UserDetailsDialog
          id={selectedUserId}
          currentAdminId={currentAdminId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  );
}
