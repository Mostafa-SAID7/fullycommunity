/**
 * Authentication error interface
 */
export interface AuthError {
  code: string;
  message: string;
  details?: any;
}
