/**
 * Basic user info with just ID and name
 * Used when only minimal user data is needed
 */
export interface BasicUser {
  id: string;
  name: string;
  avatarUrl: string | null;
}

/**
 * User info with first/last name split
 * Matches backend DTOs like PostAuthorDto, QuestionAuthorDto, PageOwnerDto
 */
export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

/**
 * Generic author/user info interface with verification
 * Used across Posts, News, QA, Reviews, Guides, etc.
 */
export interface Author extends BasicUser {
  isVerified: boolean;
}

/**
 * User info with verification and user type
 * Used in Posts and QA
 */
export interface AuthorWithType extends UserInfo {
  userType: string;
}

/**
 * User info with verification (matches PageOwnerDto)
 */
export interface UserWithVerification extends UserInfo {
  isVerified: boolean;
}

/**
 * Extended author info with additional details
 */
export interface AuthorDetail extends Author {
  bio: string | null;
  followerCount: number;
  postCount: number;
}
