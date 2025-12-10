/**
 * Home Widget
 * Customizable widget for home page
 */
export interface HomeWidget {
  id: string;
  userId: string;
  type: WidgetType;
  title: string;
  position: number;
  isVisible: boolean;
  isCollapsed: boolean;
  settings: WidgetSettings | null;
  updatedAt: string;
}

/**
 * Widget Type
 */
export enum WidgetType {
  TrendingContent = 0,
  Recommendations = 1,
  FollowingActivity = 2,
  NearbyContent = 3,
  SavedItems = 4,
  WatchLater = 5,
  Notifications = 6,
  Stories = 7,
  LiveStreams = 8,
  UpcomingEvents = 9,
  Weather = 10,
  News = 11,
  QuickActions = 12,
  Analytics = 13,
  Calendar = 14
}

/**
 * Widget Settings
 */
export interface WidgetSettings {
  refreshInterval: number | null;
  itemLimit: number | null;
  showImages: boolean;
  showStats: boolean;
  filterCategories: string[] | null;
  customTitle: string | null;
}

/**
 * Quick Action
 */
export interface QuickAction {
  id: string;
  title: string;
  description: string | null;
  iconUrl: string | null;
  actionUrl: string;
  actionType: QuickActionType;
  isEnabled: boolean;
  position: number;
}

/**
 * Quick Action Type
 */
export enum QuickActionType {
  CreatePost = 0,
  UploadVideo = 1,
  CreatePodcast = 2,
  ListProduct = 3,
  BookService = 4,
  CreateEvent = 5,
  AskQuestion = 6,
  WriteReview = 7,
  ShareLocation = 8,
  GoLive = 9
}

/**
 * Home Layout
 */
export interface HomeLayout {
  id: string;
  userId: string;
  layoutType: LayoutType;
  widgets: HomeWidget[];
  customCss: string | null;
  updatedAt: string;
}

/**
 * Layout Type
 */
export enum LayoutType {
  Default = 0,
  Compact = 1,
  Expanded = 2,
  Custom = 3
}
