// Re-export all UI components
export * from './ui';

// Re-export all shared components
export * from './components';

// Re-export pipes
export * from './pipes/translate.pipe';

// Combined exports for convenience
import { UI_COMPONENTS } from './ui';
import { SHARED_COMPONENTS } from './components';

export const ALL_SHARED_COMPONENTS = [
  ...UI_COMPONENTS,
  ...SHARED_COMPONENTS,
] as const;