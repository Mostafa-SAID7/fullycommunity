import { Category } from '../../../common';

// Interface matching backend DTO: NewsCategoryDto
export interface NewsCategory extends Omit<Category, 'icon' | 'color' | 'itemCount' | 'isActive'> {
  iconUrl: string | null;
}
