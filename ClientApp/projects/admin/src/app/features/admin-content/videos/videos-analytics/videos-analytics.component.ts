import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { DateUtils } from '../../../../core/utils/date.utils';

interface VideoStats {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  averageViewDuration: number;
  topVideos: Array<{
    id: string;
    title: string;
    viewCount: number;
    likeCount: number;
  }>;
}

@Component({
  selector: 'app-videos-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Video Analytics</h1>
        <p class="text-gray-600">Track video performance and engagement metrics</p>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (!loading() && stats()) {
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="text-sm text-gray-600 mb-2">Total Videos</div>
            <div class="text-3xl font-bold text-gray-900">{{ stats()!.totalVideos }}</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="text-sm text-gray-600 mb-2">Total Views</div>
            <div class="text-3xl font-bold text-gray-900">{{ formatNumber(stats()!.totalViews) }}</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="text-sm text-gray-600 mb-2">Total Likes</div>
            <div class="text-3xl font-bold text-gray-900">{{ formatNumber(stats()!.totalLikes) }}</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="text-sm text-gray-600 mb-2">Avg. View Duration</div>
            <div class="text-3xl font-bold text-gray-900">{{ formatDuration(stats()!.averageViewDuration) }}</div>
          </div>
        </div>

        <!-- Top Videos -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Top Performing Videos</h2>
          <div class="space-y-4">
            @for (video of stats()!.topVideos; track video.id) {
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ video.title }}</h3>
                </div>
                <div class="flex gap-6 text-sm text-gray-600">
                  <span>👁️ {{ formatNumber(video.viewCount) }} views</span>
                  <span>❤️ {{ formatNumber(video.likeCount) }} likes</span>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class VideosAnalyticsComponent implements OnInit {
  private http = inject(HttpClient);
  
  stats = signal<VideoStats | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading.set(true);
    
    this.http.get<VideoStats>(`${environment.apiUrl}/admin/dashboard/videos/analytics`).subscribe({
      next: (response) => {
        this.stats.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
        this.loading.set(false);
      }
    });
  }

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  formatDuration = DateUtils.formatDuration;
}
