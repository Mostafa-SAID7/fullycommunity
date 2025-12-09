/**
 * Video Category
 */
export interface VideoCategory {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  slug: string;
  icon: string | null;
  color: string | null;
  videoCount: number;
  isActive: boolean;
  displayOrder: number;
}
