export interface Page {
  id: string;
  name: string;
  description: string;
  category: string;
  followerCount: number;
  postCount: number;
  isVerified: boolean;
  createdAt: string;
}

export interface PagesListResponse {
  items: Page[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
