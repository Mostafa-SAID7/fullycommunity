/**
 * Request to provide feedback on suggestions
 */
export interface FeedbackRequest {
  helpful: boolean;
  reason?: string; // Optional reason for feedback
  tags?: string[]; // Optional tags for categorization
}
