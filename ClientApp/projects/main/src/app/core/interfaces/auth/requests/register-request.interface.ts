/**
 * Register request interface
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  userType?: string | null;
}
