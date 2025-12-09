/**
 * Create Share Request
 */
export interface CreateShareRequest {
  platform: string;
  message: string | null;
  timestamp: string | null; // TimeSpan
}
