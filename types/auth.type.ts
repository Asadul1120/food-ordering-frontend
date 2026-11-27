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


export interface LoginOtpRequiredData {
  requiresOtp: true;
  email: string;
  role: UserRole;
}

export interface LoginSuccessData {
  requiresOtp?: false;
  accessToken: string;
  refreshToken: string;
  role: UserRole;
}

export type LoginResultData =
  | LoginOtpRequiredData
  | LoginSuccessData;

export interface VerifyLoginOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyLoginOtpData {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
}