export type UserRole = "ADMIN" | "STAFF" | "CUSTOMER";

export interface UserProfile {
  id: string;
  userId: string;
  deliveryAddress: string | null;
  city: string | null;
  area: string | null;
  postalCode: string | null;
}

export interface AuthUser {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  profile?: UserProfile | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone?: string;
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
