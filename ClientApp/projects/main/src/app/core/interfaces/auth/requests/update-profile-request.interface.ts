/**
 * Update profile request interface
 */
export interface UpdateProfileRequest {
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
  birthday?: string | null;
  location?: string | null;
  themeColor?: string | null;
  preferredLanguage?: string | null;
}
