/**
 * Create Host Request
 */
export interface CreateHostRequest {
  userId: string | null;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  websiteUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  isPrimaryHost: boolean;
}
