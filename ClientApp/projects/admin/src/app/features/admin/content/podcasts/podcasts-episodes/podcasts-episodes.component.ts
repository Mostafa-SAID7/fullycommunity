import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  showTitle: string;
  duration: number;
  playCount: number;
  publishedAt: string;
  status: string;
}

@Component({
  selector: 'app-podcasts-episodes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Podcast Episodes</h1>
        <p class="text-gray-600">Manage podcast episodes and track performance</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
            placeholder="Search episodes..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            [(ngModel)]="selectedStatus"
            (change)="onStatusChange($any($event.target).value)"
            class="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
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

      @if (!loading() && episodes().length > 0) {
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Episode</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Show</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plays</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (episode of episodes(); track episode.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="flex flex-col">
                      <span class="text-sm font-medium text-gray-900">{{ episode.title }}</span>
                      <span class="text-xs text-gray-500 line-clamp-1">{{ episode.description }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ episode.showTitle }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ formatDuration(episode.duration) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ episode.playCount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="'px-2 py-1 text-xs rounded-full ' + getStatusBadgeClass(episode.status)">
                      {{ episode.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(episode.publishedAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      (click)="deleteEpisode(episode)"
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

      @if (!loading() && episodes().length === 0) {
        <div class="bg-white rounded-lg shadow-sm p-12 text-center">
          <div class="text-gray-400 text-6xl mb-4">🎧</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No episodes found</h3>
        </div>
      }
    </div>
  `
})
export class PodcastsEpisodesComponent implements OnInit {
  private http = inject(HttpClient);
  
  episodes = signal<PodcastEpisode[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  pageSize = 20;
  totalPages = signal(1);
  totalCount = signal(0);
  searchQuery = signal('');
  selectedStatus = signal('');

  ngOnInit() {
    this.loadEpisodes();
  }

  loadEpisodes() {
    this.loading.set(true);
    
    let params = new HttpParams()
      .set('page', this.currentPage().toString())
      .set('pageSize', this.pageSize.toString());
    
    if (this.searchQuery()) params = params.set('search', this.searchQuery());
    if (this.selectedStatus()) params = params.set('status', this.selectedStatus());

    this.http.get<any>(`${environment.apiUrl}/admin/dashboard/podcasts/episodes`, { params }).subscribe({
      next: (response) => {
        if (response.items) {
          this.episodes.set(response.items);
          this.totalCount.set(response.totalCount);
          this.totalPages.set(Math.ceil(response.totalCount / this.pageSize));
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading episodes:', error);
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadEpisodes();
  }

  onStatusChange(status: string) {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
    this.loadEpisodes();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadEpisodes();
  }

  deleteEpisode(episode: PodcastEpisode) {
    if (!confirm(`Delete episode "${episode.title}"? This action cannot be undone.`)) return;

    this.http.delete(`${environment.apiUrl}/admin/dashboard/podcasts/episodes/${episode.id}`).subscribe({
      next: () => this.loadEpisodes(),
      error: (error) => console.error('Error deleting episode:', error)
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
