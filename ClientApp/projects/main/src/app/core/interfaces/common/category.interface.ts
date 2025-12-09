/**
 * Generic category interface used across multiple features
 * (News, Posts, QA, Guides, etc.)
 */
export interface Category {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  icon: string | null;
  color: string | null;
  itemCount: number;
  isActive: boolean;
}
