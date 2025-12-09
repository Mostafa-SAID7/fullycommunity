/**
 * Post Type Enum - matches PostType enum from backend
 */
export enum PostType {
  General = 0,
  Question = 1,
  Article = 2,
  Tutorial = 3,
  Review = 4,
  News = 5,
  Event = 6,
  Poll = 7
}

/**
 * Post Visibility Enum - matches PostVisibility enum from backend
 */
export enum PostVisibility {
  Public = 0,
  FriendsOnly = 1,
  Private = 2,
  GroupOnly = 3
}
