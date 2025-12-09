import { Category } from '../../../common';

// Interface matching backend DTO: GuideCategoryDto
export interface GuideCategory extends Omit<Category, 'color' | 'itemCount' | 'isActive'> {}
