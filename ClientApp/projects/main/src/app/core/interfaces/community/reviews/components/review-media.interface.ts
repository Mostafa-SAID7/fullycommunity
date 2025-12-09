import { Media } from '../../../common';

// Interface matching backend DTO: ReviewMediaDto
export interface ReviewMedia extends Omit<Media, 'type' | 'order'> {}
