/**
 * Post Media DTO - matches PostMediaDto.cs from backend
 */
export interface PostMedia {
  id: string;
  url: string;
  type: string;
  thumbnailUrl: string | null;
}
