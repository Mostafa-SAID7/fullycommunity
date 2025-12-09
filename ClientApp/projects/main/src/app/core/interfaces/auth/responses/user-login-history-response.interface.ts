/**
 * User login history response interface
 */
export interface UserLoginHistoryResponse {
  id: string;
  ipAddress: string | null;
  country: string | null;
  city: string | null;
  browser: string | null;
  platform: string | null;
  isSuccessful: boolean;
  loginAt: string;
}
