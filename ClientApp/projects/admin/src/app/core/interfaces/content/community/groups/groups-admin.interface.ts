export type GroupPrivacy = 'public' | 'private' | 'secret';

export interface Group {
  id: string;
  name: string;
  description: string;
  privacy: GroupPrivacy;
  memberCount: number;
  postCount: number;
  createdAt: string;
}

export interface GroupsListResponse {
  items: Group[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
