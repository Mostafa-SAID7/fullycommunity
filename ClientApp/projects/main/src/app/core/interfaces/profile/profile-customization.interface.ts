/**
 * Profile Theme
 * Custom profile appearance
 */
export interface ProfileTheme {
  id: string;
  userId: string;
  name: string;
  
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  
  // Layout
  layoutType: ProfileLayoutType;
  showBanner: boolean;
  showStats: boolean;
  showBadges: boolean;
  showRecentActivity: boolean;
  
  // Fonts
  fontFamily: string | null;
  fontSize: FontSize;
  
  // Custom CSS
  customCss: string | null;
  
  // Status
  isActive: boolean;
  isPublic: boolean;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Profile Layout Type
 */
export enum ProfileLayoutType {
  Classic = 0,
  Modern = 1,
  Minimal = 2,
  Creative = 3,
  Professional = 4,
  Custom = 5
}

/**
 * Font Size
 */
export enum FontSize {
  Small = 0,
  Medium = 1,
  Large = 2,
  ExtraLarge = 3
}

/**
 * Profile Widget
 * Customizable profile sections
 */
export interface ProfileWidget {
  id: string;
  userId: string;
  widgetType: ProfileWidgetType;
  title: string;
  position: number;
  isVisible: boolean;
  isCollapsed: boolean;
  settings: ProfileWidgetSettings | null;
}

/**
 * Profile Widget Type
 */
export enum ProfileWidgetType {
  About = 0,
  RecentPosts = 1,
  RecentVideos = 2,
  RecentPodcasts = 3,
  Skills = 4,
  Experience = 5,
  Education = 6,
  Portfolio = 7,
  Achievements = 8,
  Stats = 9,
  SocialLinks = 10,
  Testimonials = 11,
  Gallery = 12,
  Calendar = 13,
  Contact = 14
}

/**
 * Profile Widget Settings
 */
export interface ProfileWidgetSettings {
  itemLimit: number | null;
  showImages: boolean;
  showStats: boolean;
  sortBy: string | null;
  filterBy: string | null;
}

/**
 * Profile Status
 * User status and availability
 */
export interface ProfileStatus {
  userId: string;
  status: UserStatus;
  customMessage: string | null;
  emoji: string | null;
  expiresAt: string | null;
  isVisible: boolean;
  updatedAt: string;
}

/**
 * User Status
 */
export enum UserStatus {
  Online = 0,
  Away = 1,
  Busy = 2,
  DoNotDisturb = 3,
  Invisible = 4,
  Offline = 5
}

/**
 * Profile Visitor
 * Who viewed the profile
 */
export interface ProfileVisitor {
  id: string;
  profileUserId: string;
  visitorUserId: string;
  visitorName: string;
  visitorAvatarUrl: string | null;
  visitorVerified: boolean;
  visitCount: number;
  lastVisitAt: string;
  firstVisitAt: string;
}

/**
 * Profile Analytics
 * Profile view analytics
 */
export interface ProfileAnalytics {
  userId: string;
  timeRange: string;
  
  // Views
  totalViews: number;
  uniqueViews: number;
  averageViewDuration: number;
  
  // Visitors
  totalVisitors: number;
  returningVisitors: number;
  newVisitors: number;
  
  // Demographics
  topCountries: string[];
  topCities: string[];
  
  // Referrers
  topReferrers: string[];
  
  // Engagement
  profileInteractions: number;
  contactClicks: number;
  socialLinkClicks: number;
  
  generatedAt: string;
}