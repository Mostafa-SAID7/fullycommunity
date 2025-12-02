import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoService, Video, VideoCategory } from '../../../core/services/video.service';

@Component({
  selector: 'app-video-trending',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Trending</h1>
            <p class="text-gray-600 dark:text-gray-400">See what's popular right now</p>
          </div>
        </div>

        <!-- Category Tabs -->
        <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button (click)="selectCategory(null)"
            [class]="!selectedCategory() 
              ? 'px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full whitespace-nowrap' 
              : 'px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full whitespace-nowrap hover:bg-gray-300 dark:hover:bg-gray-600'">
            All
          </button>
          @for (cat of categories(); track cat.id) {
            <button (click)="selectCategory(cat)"
              [class]="selectedCategory()?.id === cat.id 
                ? 'px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full whitespace-nowrap' 
                : 'px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full whitespace-nowrap hover:bg-gray-300 dark:hover:bg-gray-600'">
              {{ cat.name }}
            </button>
          }
        </div>

        <!-- Trending Videos -->
        @if (loading()) {
          <div class="space-y-4">
            @for (i of [1,2,3,4,5,6,7,8,9,10]; track i) {
              <div class="flex gap-4 animate-pulse">
                <div class="text-2xl font-bold text-gray-300 dark:text-gray-700 w-8">{{ i }}</div>
                <div class="w-40 aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
                <div class="flex-1">
                  <div class="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="space-y-4">
            @for (video of videos(); track video.id; let i = $index) {
              <a [routerLink]="['/videos/watch', video.id]" class="flex gap-4 group">
                <div class="text-2xl font-bold text-gray-400 dark:text-gray-500 w-8 flex-shrink-0 flex items-center justify-center">
                  {{ i + 1 }}
                </div>
                <div class="relative w-40 md:w-60 flex-shrink-0">
                  <img [src]="video.thumbnailUrl || 'assets/video-placeholder.png'" 
                    class="w-full aspect-video rounded-lg object-cover group-hover:scale-105 transition-transform">
                  <div class="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded">
                    {{ formatDuration(video.duration) }}
                  </div>
                </div>
                <div class="flex-1 min-w-0 py-1">
                  <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {{ video.title }}
                  </h3>
                  <div class="flex items-center gap-2 mt-2">
                    <img [src]="video.channel.avatarUrl || 'assets/default-avatar.png'" 
                      class="w-6 h-6 rounded-full object-cover">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ video.channel.displayName }}</span>
                    @if (video.channel.isVerified) {
                      <svg class="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                    }
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {{ formatViews(video.viewCount) }} views · {{ formatDate(video.publishedAt || video.createdAt) }}
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class VideoTrendingComponent implements OnInit {
  private videoService = inject(VideoService);

  videos = signal<Video[]>([]);
  categories = signal<VideoCategory[]>([]);
  selectedCategory = signal<VideoCategory | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.loadCategories();
    this.loadTrending();
  }

  loadCategories() {
    this.videoService.getCategories().subscribe(cats => this.categories.set(cats));
  }

  loadTrending() {
    this.loading.set(true);
    this.videoService.getTrendingVideos(50).subscribe({
      next: (videos) => {
        this.videos.set(videos);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectCategory(category: VideoCategory | null) {
    this.selectedCategory.set(category);
    this.loading.set(true);
    
    if (category) {
      this.videoService.searchVideos({ categoryId: category.id, sortBy: 'Trending', pageSize: 50 }).subscribe({
        next: (result) => {
          this.videos.set(result.items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.loadTrending();
    }
  }

  formatDuration(duration: string): string {
    if (!duration) return '0:00';
    const parts = duration.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const mins = parseInt(parts[1]);
      const secs = parseInt(parts[2]);
      if (hours > 0) return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return duration;
  }

  formatViews(count: number): string {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  }
}
