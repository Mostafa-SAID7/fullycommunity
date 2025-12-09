import { Category } from '../../../common';

/**
 * Post Category DTO - matches PostCategoryDto.cs from backend
 */
export interface PostCategory extends Omit<Category, 'description' | 'color' | 'itemCount' | 'isActive'> {}
