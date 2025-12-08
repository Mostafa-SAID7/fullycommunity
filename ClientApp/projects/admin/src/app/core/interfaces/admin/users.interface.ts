export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber?: string;
  accountStatus: string;
  roles: string[];
  createdAt: string;
  lastLoginAt?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface UserListResponse {
  items: AdminUser[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleType?: string;
  permissions?: string[];
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  accountStatus?: string;
}

export interface AssignRoleRequest {
  role: string;
}
