/**
 * Profile Visibility
 */
export enum ProfileVisibility {
  Public = 0,
  Private = 1,
  FriendsOnly = 2
}

/**
 * Gender
 */
export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2,
  PreferNotToSay = 3
}

/**
 * Account Status
 */
export enum AccountStatus {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
  Deactivated = 3,
  Deleted = 4,
  Banned = 5
}

/**
 * Verification Status
 */
export enum VerificationStatus {
  Unverified = 0,
  Pending = 1,
  Verified = 2,
  Rejected = 3
}

/**
 * Badge Type
 */
export enum BadgeType {
  Verified = 0,
  Premium = 1,
  Creator = 2,
  Moderator = 3,
  Admin = 4,
  EarlyAdopter = 5,
  TopContributor = 6,
  Expert = 7,
  Influencer = 8
}

/**
 * Report Reason
 */
export enum ReportReason {
  Spam = 0,
  Harassment = 1,
  HateSpeech = 2,
  Violence = 3,
  Nudity = 4,
  FalseInformation = 5,
  Scam = 6,
  IntellectualProperty = 7,
  Other = 8
}
