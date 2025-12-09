// Interface matching backend DTO: PageReviewDto
import { PageOwner } from './page-owner.interface';

export interface PageReview {
  id: string;
  userId: string;
  user: PageOwner;
  rating: number;
  title: string | null;
  content: string;
  imageUrls: string[];
  helpfulCount: number;
  ownerResponse: string | null;
  ownerResponseAt: string | null;
  createdAt: string;
}
