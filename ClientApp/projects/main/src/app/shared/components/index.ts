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
] as const;