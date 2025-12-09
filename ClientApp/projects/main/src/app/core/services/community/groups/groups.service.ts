import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PagedResult } from '../../../types';
import {
  Group,
  GroupList,
  GroupMember,
  GroupPrivacy,
  GroupType,
  GroupRole,
  GroupFilter,
  CreateGroupRequest,
  UpdateGroupRequest
} from '../../../interfaces/community/groups';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/community/groups`;

  groups = signal<GroupList[]>([]);
  loading = signal(false);

  // ============================================================================
  // GROUP OPERATIONS
  // ============================================================================

  getGroups(filter: GroupFilter = {}, page = 1, pageSize = 20): Observable<PagedResult<GroupList>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter.type !== undefined) params = params.set('type', filter.type.toString());
    if (filter.privacy !== undefined) params = params.set('privacy', filter.privacy.toString());
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);

    return this.http.get<PagedResult<GroupList>>(this.apiUrl, { params });
  }

  getGroup(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }

  getGroupBySlug(slug: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/slug/${slug}`);
  }

  getMyGroups(page = 1, pageSize = 20): Observable<PagedResult<GroupList>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<GroupList>>(`${this.apiUrl}/my`, { params });
  }

  getSuggestedGroups(count = 10): Observable<GroupList[]> {
    return this.http.get<GroupList[]>(`${this.apiUrl}/suggested`, {
      params: { count: count.toString() }
    });
  }

  createGroup(request: CreateGroupRequest): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, request);
  }

  updateGroup(id: string, request: UpdateGroupRequest): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${id}`, request);
  }

  deleteGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ============================================================================
  // MEMBERSHIP OPERATIONS
  // ============================================================================

  getMembers(groupId: string, page = 1, pageSize = 20): Observable<PagedResult<GroupMember>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<GroupMember>>(`${this.apiUrl}/${groupId}/members`, { params });
  }

  joinGroup(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/join`, {});
  }

  leaveGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/leave`);
  }

  inviteMember(groupId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${groupId}/invite/${userId}`, {});
  }

  removeMember(groupId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${groupId}/members/${userId}`);
  }

  updateMemberRole(groupId: string, userId: string, role: GroupRole): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${groupId}/members/${userId}/role`, { role });
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  loadGroups(filter: GroupFilter = {}) {
    this.loading.set(true);
    this.getGroups(filter).subscribe({
      next: (result) => {
        this.groups.set(result.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
