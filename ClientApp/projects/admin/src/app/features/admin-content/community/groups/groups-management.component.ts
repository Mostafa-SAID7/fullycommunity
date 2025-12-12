import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { DateUtils } from '../../../../core/utils/date.utils';

interface Group {
  id: string;
  name: string;
  description: string;
  privacy: string;
  memberCount: number;
  postCount: number;
  createdAt: string;
}

@Component({
  selector: 'app-groups-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Groups Management</h1>
        <p class="text-gray-600">Manage community groups, monitor activity, and moderate content</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
            placeholder="Search groups..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            [(ngModel)]="selectedPrivacy"
            (change)="onPrivacyChange($any($event.target).value)"
            class="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Privacy</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="secret">Secret</option>
          </select>
          <button
            (click)="onSearch()"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (!loading() && groups().length > 0) {
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Privacy</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posts</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (group of groups(); track group.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="flex flex-col">
                      <span class="text-sm font-medium text-gray-900">{{ group.name }}</span>
                      <span class="text-xs text-gray-500 line-clamp-1">{{ group.description }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="'px-2 py-1 text-xs rounded-full ' + getPrivacyBadgeClass(group.privacy)">
                      {{ group.privacy }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ group.memberCount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ group.postCount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(group.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      (click)="deleteGroup(group)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="bg-gray-50 px-6 py-4 flex justify-between border-t">
            <div class="text-sm text-gray-700">
              Page {{ currentPage() }} of {{ totalPages() }} ({{ totalCount() }} total)
            </div>
            <div class="flex gap-2">
              <button
                (click)="goToPage(currentPage() - 1)"
                [disabled]="currentPage() === 1"
                class="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                (click)="goToPage(currentPage() + 1)"
                [disabled]="currentPage() === totalPages()"
                class="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      }

      @if (!loading() && groups().length === 0) {
        <div class="bg-white rounded-lg shadow-sm p-12 text-center">
          <div class="text-gray-400 text-6xl mb-4">👥</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
        </div>
      }
    </div>
  `
})
export class GroupsManagementComponent implements OnInit {
  private http = inject(HttpClient);
  
  groups = signal<Group[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  pageSize = 20;
  totalPages = signal(1);
  totalCount = signal(0);
  searchQuery = signal('');
  selectedPrivacy = signal('');

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.loading.set(true);
    
    let params = new HttpParams()
      .set('page', this.currentPage().toString())
      .set('pageSize', this.pageSize.toString());
    
    if (this.searchQuery()) params = params.set('search', this.searchQuery());
    if (this.selectedPrivacy()) params = params.set('privacy', this.selectedPrivacy());

    this.http.get<any>(`${environment.apiUrl}/admin/dashboard/community/groups`, { params }).subscribe({
      next: (response) => {
        if (response.items) {
          this.groups.set(response.items);
          this.totalCount.set(response.totalCount);
          this.totalPages.set(Math.ceil(response.totalCount / this.pageSize));
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading groups:', error);
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadGroups();
  }

  onPrivacyChange(privacy: string) {
    this.selectedPrivacy.set(privacy);
    this.currentPage.set(1);
    this.loadGroups();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadGroups();
  }

  deleteGroup(group: Group) {
    if (!confirm(`Delete group "${group.name}"? This action cannot be undone.`)) return;

    this.http.delete(`${environment.apiUrl}/admin/dashboard/community/groups/${group.id}`).subscribe({
      next: () => this.loadGroups(),
      error: (error) => console.error('Error deleting group:', error)
    });
  }

  getPrivacyBadgeClass(privacy: string): string {
    switch (privacy.toLowerCase()) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'private': return 'bg-yellow-100 text-yellow-800';
      case 'secret': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate = DateUtils.formatDate;
}
