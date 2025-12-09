/**
 * Generic media interface for images, videos, etc.
 * Used across Posts, Reviews, Guides, etc.
 */
export interface Media {
  id: string;
  url: string;
  type: MediaType;
  thumbnailUrl: string | null;
  caption: string | null;
  order: number;
}

export enum MediaType {
  Image = 0,
  Video = 1,
  Audio = 2,
  Document = 3
}
