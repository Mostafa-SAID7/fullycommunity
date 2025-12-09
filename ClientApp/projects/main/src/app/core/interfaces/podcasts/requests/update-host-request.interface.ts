/**
 * Update Host Request
 */
export interface UpdateHostRequest {
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  websiteUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  isPrimaryHost: boolean | null;
}
