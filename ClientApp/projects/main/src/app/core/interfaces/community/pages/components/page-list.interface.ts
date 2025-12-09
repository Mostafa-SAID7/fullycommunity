// Interface matching backend DTO: PageListDto
import { PageCategory, PageType } from '../enums';

export interface PageList {
  id: string;
  name: string;
  username: string;
  description: string | null;
  profileImageUrl: string | null;
  category: PageCategory;
  type: PageType;
  isVerified: boolean;
  followerCount: number;
  averageRating: number;
  isFollowing: boolean;
}
