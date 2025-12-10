import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';
import {
  ProfileContent,
  SavedContent,
  ContentCollection,
  CollectionItem,
  CreateCollectionRequest
} from '../../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileContentService {
  private readonly apiUrl = `${environment.apiUrl}/profile/content`;

  constructor(private http: HttpClient) {}

  /**
   * Get profile content
   */
  getContent(userId: string): Observable<ProfileContent> {
    return this.http.get<ProfileContent>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Get saved content
   */
  getSavedContent(page: number = 1, pageSize: number = 20): Observable<PagedResult<SavedContent>> {
    return this.http.get<PagedResult<SavedContent>>(`${this.apiUrl}/saved`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Save content
   */
  saveContent(contentId: string, contentType: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/saved`, { contentId, contentType });
  }

  /**
   * Unsave content
   */
  unsaveContent(contentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/saved/${contentId}`);
  }

  /**
   * Get collections
   */
  getCollections(): Observable<ContentCollection[]> {
    return this.http.get<ContentCollection[]>(`${this.apiUrl}/collections`);
  }

  /**
   * Get collection
   */
  getCollection(collectionId: string): Observable<ContentCollection> {
    return this.http.get<ContentCollection>(`${this.apiUrl}/collections/${collectionId}`);
  }

  /**
   * Create collection
   */
  createCollection(request: CreateCollectionRequest): Observable<ContentCollection> {
    return this.http.post<ContentCollection>(`${this.apiUrl}/collections`, request);
  }

  /**
   * Update collection
   */
  updateCollection(collectionId: string, request: Partial<CreateCollectionRequest>): Observable<ContentCollection> {
    return this.http.put<ContentCollection>(`${this.apiUrl}/collections/${collectionId}`, request);
  }

  /**
   * Delete collection
   */
  deleteCollection(collectionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/collections/${collectionId}`);
  }

  /**
   * Get collection items
   */
  getCollectionItems(collectionId: string): Observable<CollectionItem[]> {
    return this.http.get<CollectionItem[]>(`${this.apiUrl}/collections/${collectionId}/items`);
  }

  /**
   * Add to collection
   */
  addToCollection(collectionId: string, contentId: string, contentType: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/collections/${collectionId}/items`, {
      contentId,
      contentType
    });
  }

  /**
   * Remove from collection
   */
  removeFromCollection(collectionId: string, itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/collections/${collectionId}/items/${itemId}`);
  }
}
