/**
 * Request to dismiss a suggestion
 */
export interface DismissSuggestionRequest {
  reason?: 'not-interested' | 'already-seen' | 'irrelevant' | 'other';
  feedback?: string; // Optional user feedback
}
