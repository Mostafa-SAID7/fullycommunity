/**
 * Group Privacy Enum - matches GroupPrivacy enum from backend
 */
export enum GroupPrivacy {
  Public = 0,
  Private = 1,
  Secret = 2
}

/**
 * Group Role Enum - matches GroupRole enum from backend
 */
export enum GroupRole {
  Member = 0,
  Moderator = 1,
  Admin = 2,
  Owner = 3
}

/**
 * Group Type Enum - matches GroupType enum from backend
 */
export enum GroupType {
  General = 0,
  CarBrand = 1,
  CarModel = 2,
  Location = 3,
  Interest = 4,
  Official = 5
}

/**
 * Member Status Enum - matches MemberStatus enum from backend
 */
export enum MemberStatus {
  Pending = 0,
  Active = 1,
  Banned = 2,
  Left = 3
}
