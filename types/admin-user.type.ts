import type { UserRole } from "@/types/auth.type";

export interface AdminUser {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserQuery {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
}

export interface AdminUserList {
  users: AdminUser[];
  pagination: {
    totalUsers: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export interface UpdateAdminUserBody {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface UpdateAdminUserPayload {
  id: string;
  body: UpdateAdminUserBody;
}

export interface UpdateAdminUserStatusPayload {
  id: string;
  isActive: boolean;
}
