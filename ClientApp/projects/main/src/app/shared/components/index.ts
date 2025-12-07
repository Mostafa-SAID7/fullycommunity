// Shared Components Library
export * from './empty-state/empty-state.component';
export * from './filter-bar/filter-bar.component';
export * from './toast-container/toast-container.component';
export * from './language-switcher/language-switcher.component';
export * from './left-sidebar/left-sidebar.component';
export * from './right-sidebar/right-sidebar.component';
export * from './sidebar-layout/sidebar-layout.component';
export * from './scroll-to-top/scroll-to-top.component';
export * from './chat-assistant/chat-assistant.component';
export * from './search-box/search-box.component';
export * from './story-viewer/story-viewer.component';
export * from './create-story-modal/create-story-modal.component';
export * from './ask-question-modal/ask-question-modal.component';
export * from './loading-state/loading-state.component';
export * from './user-avatar/user-avatar.component';
export * from './stats-card/stats-card.component';
export * from './tag-list/tag-list.component';
export * from './vote-button/vote-button.component';
export * from './brand-logo/brand-logo.component';

// Component Array for easy importing
import { EmptyStateComponent } from './empty-state/empty-state.component';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { ToastContainerComponent } from './toast-container/toast-container.component';
import { LanguageSwitcherComponent } from './language-switcher/language-switcher.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { SidebarLayoutComponent } from './sidebar-layout/sidebar-layout.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { ChatAssistantComponent } from './chat-assistant/chat-assistant.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { StoryViewerComponent } from './story-viewer/story-viewer.component';
import { CreateStoryModalComponent } from './create-story-modal/create-story-modal.component';
import { AskQuestionModalComponent } from './ask-question-modal/ask-question-modal.component';
import { LoadingStateComponent } from './loading-state/loading-state.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { StatsCardComponent } from './stats-card/stats-card.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { VoteButtonComponent } from './vote-button/vote-button.component';
import { BrandLogoComponent } from './brand-logo/brand-logo.component';

export const SHARED_COMPONENTS = [
  EmptyStateComponent,
  FilterBarComponent,
  ToastContainerComponent,
  LanguageSwitcherComponent,
  LeftSidebarComponent,
  RightSidebarComponent,
  SidebarLayoutComponent,
  ScrollToTopComponent,
  ChatAssistantComponent,
  SearchBoxComponent,
  StoryViewerComponent,
  CreateStoryModalComponent,
  AskQuestionModalComponent,
  LoadingStateComponent,
  UserAvatarComponent,
  StatsCardComponent,
  TagListComponent,
  VoteButtonComponent,
  BrandLogoComponent,
] as const;