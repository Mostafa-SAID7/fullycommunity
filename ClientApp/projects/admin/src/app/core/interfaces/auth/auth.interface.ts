/**
 * Authentication Interfaces
 */

export enum AdminRoleType {
  SuperAdmin = 0,
  Admin = 1,
  ContentAdmin = 2,
  MarketplaceAdmin = 3,
  ServicesAdmin = 4,
  CMSAdmin = 5
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  roles?: string[];
}

export interface AdminUser extends User {
  adminRoleType?: AdminRoleType;
  permissions?: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
  requiresTwoFactor?: boolean;
  requiresVerification?: boolean;
}

export interface AdminAuthResponse {
  userId: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  adminRoleType?: AdminRoleType;
  roles: string[];
  permissions: string[];
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
  message: string;
}
