import { Media } from '../../../common';

/**
 * Post Media DTO - matches PostMediaDto.cs from backend
 */
export interface PostMedia extends Omit<Media, 'caption' | 'order'> {
  type: string; // Keep as string to match backend DTO
}
