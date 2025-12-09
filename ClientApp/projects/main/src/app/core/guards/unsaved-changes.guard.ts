import { type CanDeactivateFn } from '@angular/router';

/**
 * Interface for components that have unsaved changes
 */
export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
}

/**
 * Unsaved changes guard - prevents navigation away from forms with unsaved changes
 * Usage: canDeactivate: [unsavedChangesGuard]
 * Component must implement ComponentCanDeactivate interface
 */
export const unsavedChangesGuard: CanDeactivateFn<ComponentCanDeactivate> = (component) => {
  if (component.canDeactivate) {
    return component.canDeactivate();
  }
  return true;
};

/**
 * Helper function to show confirmation dialog
 */
export function confirmLeave(message = 'You have unsaved changes. Do you really want to leave?'): boolean {
  return confirm(message);
}
