import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AdminCMSPage,
  AdminCMSMenu,
  AdminCMSMenuItem,
  AdminCMSMedia,
  AdminCMSCategory,
  AdminCMSTag,
  AdminCMSComment,
  CMSFilter,
  CMSStatistics
} from '../../interfaces/cms/admin-cms.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminCMSService {
  private readonly apiUrl = `${environment.apiUrl}/admin/cms`;

  constructor(private http: HttpClient) {}

  /**
   * Get CMS pages
   */
  getPages(filter: CMSFilter, page: number = 1, pageSize: number = 20): Observable<{ pages: AdminCMSPage[], total: number }> {
    let params = this.buildFilterParams(filter, page, pageSize);
    return this.http.get<{ pages: AdminCMSPage[], total: number }>(`${this.apiUrl}/pages`, { params });
  }

  /**
   * Get CMS menus
   */
  getMenus(): Observable<AdminCMSMenu[]> {
    return this.http.get<AdminCMSMenu[]>(`${this.apiUrl}/menus`);
  }

  /**
   * Get CMS media
   */
  getMedia(page: number = 1, pageSize: number = 20): Observable<{ media: AdminCMSMedia[], total: number }> {
    return this.http.get<{ media: AdminCMSMedia[], total: number }>(`${this.apiUrl}/media`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get CMS categories
   */
  getCategories(): Observable<AdminCMSCategory[]> {
    return this.http.get<AdminCMSCategory[]>(`${this.apiUrl}/categories`);
  }

  /**
   * Get CMS tags
   */
  getTags(): Observable<AdminCMSTag[]> {
    return this.http.get<AdminCMSTag[]>(`${this.apiUrl}/tags`);
  }

  /**
   * Get CMS comments
   */
  getComments(page: number = 1, pageSize: number = 20): Observable<{ comments: AdminCMSComment[], total: number }> {
    return this.http.get<{ comments: AdminCMSComment[], total: number }>(`${this.apiUrl}/comments`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get page by ID
   */
  getPage(pageId: string): Observable<AdminCMSPage> {
    return this.http.get<AdminCMSPage>(`${this.apiUrl}/pages/${pageId}`);
  }

  /**
   * Create page
   */
  createPage(page: Partial<AdminCMSPage>): Observable<AdminCMSPage> {
    return this.http.post<AdminCMSPage>(`${this.apiUrl}/pages`, page);
  }

  /**
   * Update page
   */
  updatePage(pageId: string, page: Partial<AdminCMSPage>): Observable<AdminCMSPage> {
    return this.http.put<AdminCMSPage>(`${this.apiUrl}/pages/${pageId}`, page);
  }

  /**
   * Delete page
   */
  deletePage(pageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pages/${pageId}`);
  }

  /**
   * Publish page
   */
  publishPage(pageId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/pages/${pageId}/publish`, {});
  }

  /**
   * Unpublish page
   */
  unpublishPage(pageId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/pages/${pageId}/unpublish`, {});
  }

  /**
   * Archive page
   */
  archivePage(pageId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/pages/${pageId}/archive`, {});
  }

  /**
   * Create menu
   */
  createMenu(menu: Partial<AdminCMSMenu>): Observable<AdminCMSMenu> {
    return this.http.post<AdminCMSMenu>(`${this.apiUrl}/menus`, menu);
  }

  /**
   * Update menu
   */
  updateMenu(menuId: string, menu: Partial<AdminCMSMenu>): Observable<AdminCMSMenu> {
    return this.http.put<AdminCMSMenu>(`${this.apiUrl}/menus/${menuId}`, menu);
  }

  /**
   * Delete menu
   */
  deleteMenu(menuId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/menus/${menuId}`);
  }

  /**
   * Create menu item
   */
  createMenuItem(menuItem: Partial<AdminCMSMenuItem>): Observable<AdminCMSMenuItem> {
    return this.http.post<AdminCMSMenuItem>(`${this.apiUrl}/menu-items`, menuItem);
  }

  /**
   * Update menu item
   */
  updateMenuItem(itemId: string, menuItem: Partial<AdminCMSMenuItem>): Observable<AdminCMSMenuItem> {
    return this.http.put<AdminCMSMenuItem>(`${this.apiUrl}/menu-items/${itemId}`, menuItem);
  }

  /**
   * Delete menu item
   */
  deleteMenuItem(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/menu-items/${itemId}`);
  }

  /**
   * Upload media
   */
  uploadMedia(file: File, alt?: string, caption?: string): Observable<AdminCMSMedia> {
    const formData = new FormData();
    formData.append('file', file);
    if (alt) formData.append('alt', alt);
    if (caption) formData.append('caption', caption);
    
    return this.http.post<AdminCMSMedia>(`${this.apiUrl}/media/upload`, formData);
  }

  /**
   * Update media
   */
  updateMedia(mediaId: string, media: Partial<AdminCMSMedia>): Observable<AdminCMSMedia> {
    return this.http.put<AdminCMSMedia>(`${this.apiUrl}/media/${mediaId}`, media);
  }

  /**
   * Delete media
   */
  deleteMedia(mediaId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/media/${mediaId}`);
  }

  /**
   * Create category
   */
  createCategory(category: Partial<AdminCMSCategory>): Observable<AdminCMSCategory> {
    return this.http.post<AdminCMSCategory>(`${this.apiUrl}/categories`, category);
  }

  /**
   * Update category
   */
  updateCategory(categoryId: string, category: Partial<AdminCMSCategory>): Observable<AdminCMSCategory> {
    return this.http.put<AdminCMSCategory>(`${this.apiUrl}/categories/${categoryId}`, category);
  }

  /**
   * Delete category
   */
  deleteCategory(categoryId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${categoryId}`);
  }

  /**
   * Create tag
   */
  createTag(tag: Partial<AdminCMSTag>): Observable<AdminCMSTag> {
    return this.http.post<AdminCMSTag>(`${this.apiUrl}/tags`, tag);
  }

  /**
   * Update tag
   */
  updateTag(tagId: string, tag: Partial<AdminCMSTag>): Observable<AdminCMSTag> {
    return this.http.put<AdminCMSTag>(`${this.apiUrl}/tags/${tagId}`, tag);
  }

  /**
   * Delete tag
   */
  deleteTag(tagId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tags/${tagId}`);
  }

  /**
   * Approve comment
   */
  approveComment(commentId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/comments/${commentId}/approve`, {});
  }

  /**
   * Reject comment
   */
  rejectComment(commentId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/comments/${commentId}/reject`, {});
  }

  /**
   * Mark comment as spam
   */
  markCommentAsSpam(commentId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/comments/${commentId}/spam`, {});
  }

  /**
   * Delete comment
   */
  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}`);
  }

  /**
   * Get CMS statistics
   */
  getStatistics(): Observable<CMSStatistics> {
    return this.http.get<CMSStatistics>(`${this.apiUrl}/statistics`);
  }

  /**
   * Export CMS data
   */
  exportData(filter: CMSFilter, format: string = 'csv'): Observable<Blob> {
    let params = this.buildFilterParams(filter, 1, 10000);
    params = params.set('format', format);
    
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Build filter parameters
   */
  private buildFilterParams(filter: CMSFilter, page: number, pageSize: number): HttpParams {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
    
    if (filter.search) params = params.set('search', filter.search);
    if (filter.contentType !== null && filter.contentType !== undefined) params = params.set('contentType', filter.contentType.toString());
    if (filter.status !== null && filter.status !== undefined) params = params.set('status', filter.status.toString());
    if (filter.pageType !== null && filter.pageType !== undefined) params = params.set('pageType', filter.pageType.toString());
    if (filter.authorId) params = params.set('authorId', filter.authorId);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    
    return params;
  }
}