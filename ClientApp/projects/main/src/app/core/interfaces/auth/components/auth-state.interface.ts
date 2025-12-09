import { User } from '../user.interface';

/**
 * Authentication state interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
