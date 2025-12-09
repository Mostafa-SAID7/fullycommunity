import { NewsStatus } from '../enums';

export interface NewsFilter {
  status?: NewsStatus;
  categoryId?: string;
  searchTerm?: string;
  tag?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  sortBy?: string;
}
