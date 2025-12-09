/**
 * Save Video Request
 */
export interface SaveVideoRequest {
  videoId: string;
  collectionId?: string;
}

/**
 * Unsave Video Request
 */
export interface UnsaveVideoRequest {
  videoId: string;
}

/**
 * Create Collection Request
 */
export interface CreateCollectionRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
}

/**
 * Update Collection Request
 */
export interface UpdateCollectionRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
}
