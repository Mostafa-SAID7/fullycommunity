import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface Page {
  id: string;
  name: string;
  description: string;
  category: string;
  followerCount: number;
  postCount: number;
  isVerified: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-pages-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Pages Management</h1>
        <p class="text-gray-600">Manage community pages, verify pages, and monitor activity</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
            placeholder="Search pages..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
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

      @if (!loading() && pages().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (page of pages(); track page.id) {
            <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ page.name }}</h3>
                @if (page.isVerified) {
                  <span class="text-blue-500" title="Verified">✓</span>
                }
              </div>
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ page.description }}</p>
              <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span>👥 {{ page.followerCount }} followers</span>
                <span>📝 {{ page.postCount }} posts</span>
              </div>
              <div class="flex gap-2">
                @if (!page.isVerified) {
                  <button
                    (click)="verifyPage(page)"
                    class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Verify
                  </button>
                }
                <button
                  (click)="deletePage(page)"
                  class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex justify-between items-center">
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
      }

      @if (!loading() && pages().length === 0) {
        <div class="bg-white rounded-lg shadow-sm p-12 text-center">
          <div class="text-gray-400 text-6xl mb-4">📄</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
        </div>
      }
    </div>
  `
})
export class PagesManagementComponent implements OnInit {
  private http = inject(HttpClient);
  
  pages = signal<Page[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  pageSize = 12;
  totalPages = signal(1);
  totalCount = signal(0);
  searchQuery = signal('');

  ngOnInit() {
    this.loadPages();
  }

  loadPages() {
    this.loading.set(true);
    
    let params = new HttpParams()
      .set('page', this.currentPage().toString())
      .set('pageSize', this.pageSize.toString());
    
    if (this.searchQuery()) params = params.set('search', this.searchQuery());

    this.http.get<any>(`${environment.apiUrl}/admin/dashboard/community/pages`, { params }).subscribe({
      next: (response) => {
        if (response.items) {
          this.pages.set(response.items);
          this.totalCount.set(response.totalCount);
          this.totalPages.set(Math.ceil(response.totalCount / this.pageSize));
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading pages:', error);
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadPages();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadPages();
  }

  verifyPage(page: Page) {
    if (!confirm(`Verify page "${page.name}"?`)) return;

    this.http.post(`${environment.apiUrl}/admin/dashboard/community/pages/${page.id}/verify`, {}).subscribe({
      next: () => this.loadPages(),
      error: (error) => console.error('Error verifying page:', error)
    });
  }

  deletePage(page: Page) {
    if (!confirm(`Delete page "${page.name}"? This action cannot be undone.`)) return;

    this.http.delete(`${environment.apiUrl}/admin/dashboard/community/pages/${page.id}`).subscribe({
      next: () => this.loadPages(),
      error: (error) => console.error('Error deleting page:', error)
    });
  }
}
