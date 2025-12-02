import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideoService, Video, VideoCategory, VideoFeedRequest } from '../../../core/services/video.service';
import { ChannelService, Channel } from '../../../core/services/channel.service';
import { VideoCardComponent } from '../shared/video-card.component';

@Component({
  selector: 'app-video-feed',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, VideoCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Videos</h1>
            <div class="flex items-center gap-4">
              <div class="relative">
                <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="search()"
                  placeholder="Search videos..."
                  class="w-64 px-4 py-2 pl-10 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <a routerLink="/videos/upload" class="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Upload
              </a>
            </div>
          </div>
          
          <!-- Feed Type Tabs -->
          <div class="flex gap-2 mt-4 overflow-x-auto pb-2">
            @for (tab of feedTabs; track tab.value) {
              <button (click)="setFeedType(tab.value)"
                [class]="feedType() === tab.value 
                  ? 'px-4 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium' 
                  : 'px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'">
                {{ tab.label }}
              </button>
            }
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex gap-6">
          <!-- Main Content -->
          <div class="flex-1">
            <!-- Categories -->
            <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button (click)="selectCategory(null)"
                [class]="!selectedCategory() 
                  ? 'px-4 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm whitespace-nowrap' 
                  : 'px-4 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm whitespace-nowrap hover:bg-gray-300 dark:hover:bg-gray-600'">
                All
              </button>
              @for (cat of categories(); track cat.id) {
                <button (click)="selectCategory(cat)"
                  [class]="selectedCategory()?.id === cat.id 
                    ? 'px-4 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm whitespace-nowrap' 
                    : 'px-4 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm whitespace-nowrap hover:bg-gray-300 dark:hover:bg-gray-600'">
                  {{ cat.name }}
                </button>
              }
            </div>

            <!-- Video Grid -->
            @if (loading()) {
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                @for (i of [1,2,3,4,5,6,7,8]; track i) {
                  <div class="animate-pulse">
                    <div class="aspect-video bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                    <div class="flex gap-3 mt-3">
                      <div class="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                      <div class="flex-1">
                        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                @for (video of videos(); track video.id) {
                  <app-video-card [video]="video" />
                }
              </div>
              
              @if (videos().length === 0) {
                <div class="text-center py-12">
                  <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  <p class="text-gray-500 dark:text-gray-400">No videos found</p>
                </div>
              }

              @if (hasMore()) {
                <div class="text-center mt-8">
                  <button (click)="loadMore()" [disabled]="loadingMore()"
                    class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50">
                    {{ loadingMore() ? 'Loading...' : 'Load More' }}
                  </button>
                </div>
              }
            }
          </div>

          <!-- Sidebar -->
          <div class="hidden lg:block w-80">
            <!-- Trending Hashtags -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Trending Hashtags</h3>
              <div class="flex flex-wrap gap-2">
                @for (tag of trendingHashtags(); track tag.hashtag) {
                  <button (click)="searchByHashtag(tag.hashtag)"
                    class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                    #{{ tag.hashtag }}
                  </button>
                }
              </div>
            </div>

            <!-- Suggested Channels -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Suggested Channels</h3>
              <div class="space-y-3">
                @for (channel of suggestedChannels(); track channel.id) {
                  <a [routerLink]="['/videos/channel', channel.handle]" class="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg -mx-2">
                    <img [src]="channel.avatarUrl || 'assets/default-avatar.png'" [alt]="channel.displayName"
                      class="w-10 h-10 rounded-full object-cover">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-1">
                        <span class="font-medium text-gray-900 dark:text-white truncate">{{ channel.displayName }}</span>
                        @if (channel.isVerified) {
                          <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                          </svg>
                        }
                      </div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatSubscribers(channel.subscriberCount) }} subscribers</span>
                    </div>
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VideoFeedComponent implements OnInit {
  private videoService = inject(VideoService);
  private channelService = inject(ChannelService);

  videos = signal<Video[]>([]);
  categories = signal<VideoCategory[]>([]);
  trendingHashtags = signal<{ hashtag: string; count: number }[]>([]);
  suggestedChannels = signal<Channel[]>([]);
  
  loading = signal(true);
  loadingMore = signal(false);
  hasMore = signal(true);
  
  feedType = signal<'ForYou' | 'Following' | 'Trending' | 'New'>('ForYou');
  selectedCategory = signal<VideoCategory | null>(null);
  searchQuery = '';
  page = 1;

  feedTabs = [
    { label: 'For You', value: 'ForYou' as const },
    { label: 'Following', value: 'Following' as const },
    { label: 'Trending', value: 'Trending' as const },
    { label: 'New', value: 'New' as const }
  ];

  ngOnInit() {
    this.loadFeed();
    this.loadCategories();
    this.loadTrendingHashtags();
    this.loadSuggestedChannels();
  }

  loadFeed() {
    this.loading.set(true);
    this.page = 1;
    const request: VideoFeedRequest = {
      feedType: this.feedType(),
      page: this.page,
      pageSize: 20
    };
    
    this.videoService.getFeed(request).subscribe({
      next: (result) => {
        this.videos.set(result.items);
        this.hasMore.set(result.page < result.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadMore() {
    this.loadingMore.set(true);
    this.page++;
    const request: VideoFeedRequest = {
      feedType: this.feedType(),
      page: this.page,
      pageSize: 20
    };
    
    this.videoService.getFeed(request).subscribe({
      next: (result) => {
        this.videos.update(v => [...v, ...result.items]);
        this.hasMore.set(result.page < result.totalPages);
        this.loadingMore.set(false);
      },
      error: () => this.loadingMore.set(false)
    });
  }

  loadCategories() {
    this.videoService.getCategories().subscribe(cats => this.categories.set(cats));
  }

  loadTrendingHashtags() {
    this.videoService.getTrendingHashtags(10).subscribe(tags => this.trendingHashtags.set(tags));
  }

  loadSuggestedChannels() {
    this.channelService.getSuggestedChannels(5).subscribe(channels => this.suggestedChannels.set(channels));
  }

  setFeedType(type: 'ForYou' | 'Following' | 'Trending' | 'New') {
    this.feedType.set(type);
    this.loadFeed();
  }

  selectCategory(category: VideoCategory | null) {
    this.selectedCategory.set(category);
    this.loadFeed();
  }

  search() {
    if (!this.searchQuery.trim()) return;
    this.loading.set(true);
    this.videoService.searchVideos({ query: this.searchQuery, page: 1, pageSize: 20 }).subscribe({
      next: (result) => {
        this.videos.set(result.items);
        this.hasMore.set(result.page < result.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  searchByHashtag(hashtag: string) {
    this.loading.set(true);
    this.videoService.searchVideos({ hashtag, page: 1, pageSize: 20 }).subscribe({
      next: (result) => {
        this.videos.set(result.items);
        this.hasMore.set(result.page < result.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  formatSubscribers(count: number): string {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  }
}
