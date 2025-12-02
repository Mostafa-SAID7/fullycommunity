import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChannelService } from '../../../core/services/channel.service';
import { VideoService, Video, ChannelSummary } from '../../../core/services/video.service';
import { VideoCardComponent } from '../shared/video-card.component';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, RouterLink, VideoCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Subscriptions</h1>

        <!-- Subscribed Channels -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Channels</h2>
          @if (loadingChannels()) {
            <div class="flex gap-4 overflow-x-auto pb-2">
              @for (i of [1,2,3,4,5,6]; track i) {
                <div class="animate-pulse flex-shrink-0">
                  <div class="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div class="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded mt-2 mx-auto"></div>
                </div>
              }
            </div>
          } @else if (subscriptions().length) {
            <div class="flex gap-4 overflow-x-auto pb-2">
              @for (channel of subscriptions(); track channel.id) {
                <a [routerLink]="['/videos/channel', channel.handle]" class="flex-shrink-0 text-center group">
                  <div class="relative">
                    <img [src]="channel.avatarUrl || 'assets/default-avatar.png'" 
                      class="w-20 h-20 rounded-full object-cover border-2 border-transparent group-hover:border-red-500 transition-colors">
                    @if (channel.isVerified) {
                      <div class="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                    }
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300 mt-2 truncate w-20">{{ channel.displayName }}</p>
                </a>
              }
            </div>
          } @else {
            <div class="text-center py-8 bg-white dark:bg-gray-800 rounded-xl">
              <p class="text-gray-500 dark:text-gray-400">You haven't subscribed to any channels yet</p>
              <a routerLink="/videos" class="text-blue-600 hover:underline mt-2 inline-block">Discover channels</a>
            </div>
          }
        </div>

        <!-- Latest Videos from Subscriptions -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Latest Videos</h2>
          @if (loadingVideos()) {
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
          } @else if (videos().length) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              @for (video of videos(); track video.id) {
                <app-video-card [video]="video" />
              }
            </div>
            
            @if (hasMore()) {
              <div class="text-center mt-8">
                <button (click)="loadMore()" [disabled]="loadingMore()"
                  class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50">
                  {{ loadingMore() ? 'Loading...' : 'Load More' }}
                </button>
              </div>
            }
          } @else {
            <div class="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No videos yet</h3>
              <p class="text-gray-500 dark:text-gray-400">Subscribe to channels to see their latest videos here</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class SubscriptionsComponent implements OnInit {
  private channelService = inject(ChannelService);
  private videoService = inject(VideoService);

  subscriptions = signal<ChannelSummary[]>([]);
  videos = signal<Video[]>([]);
  
  loadingChannels = signal(true);
  loadingVideos = signal(true);
  loadingMore = signal(false);
  hasMore = signal(true);
  page = 1;

  ngOnInit() {
    this.loadSubscriptions();
    this.loadVideos();
  }

  loadSubscriptions() {
    this.channelService.getMySubscriptions(1, 50).subscribe({
      next: (result) => {
        this.subscriptions.set(result.items);
        this.loadingChannels.set(false);
      },
      error: () => this.loadingChannels.set(false)
    });
  }

  loadVideos() {
    this.loadingVideos.set(true);
    this.page = 1;
    this.videoService.getFeed({ feedType: 'Following', page: 1, pageSize: 20 }).subscribe({
      next: (result) => {
        this.videos.set(result.items);
        this.hasMore.set(result.page < result.totalPages);
        this.loadingVideos.set(false);
      },
      error: () => this.loadingVideos.set(false)
    });
  }

  loadMore() {
    this.loadingMore.set(true);
    this.page++;
    this.videoService.getFeed({ feedType: 'Following', page: this.page, pageSize: 20 }).subscribe({
      next: (result) => {
        this.videos.update(v => [...v, ...result.items]);
        this.hasMore.set(result.page < result.totalPages);
        this.loadingMore.set(false);
      },
      error: () => this.loadingMore.set(false)
    });
  }
}
