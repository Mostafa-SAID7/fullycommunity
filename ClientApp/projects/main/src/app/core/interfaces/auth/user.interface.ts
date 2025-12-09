/**
 * User interface - matches UserDto from backend
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  userType: string;
  isVerified: boolean;
  roles: string[];
}
