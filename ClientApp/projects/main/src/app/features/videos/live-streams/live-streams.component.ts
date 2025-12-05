import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LiveStreamService } from '../../../core/services/media/livestream.service';
import { LiveStream } from '../../../core/services/media/video.service';

@Component({
  selector: 'app-live-streams',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Live Streams</h1>
          <a routerLink="/videos/studio" class="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
            </svg>
            Go Live
          </a>
        </div>

        <!-- Live Now Section -->
        <section class="mb-8">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            Live Now
          </h2>
          
          @if (loadingLive()) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              @for (i of [1,2,3,4]; track i) {
                <div class="animate-pulse">
                  <div class="aspect-video bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                  <div class="flex gap-3 mt-3">
                    <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                    <div class="flex-1">
                      <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else if (liveNow().length) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              @for (stream of liveNow(); track stream.id) {
                <a [routerLink]="['/videos/live', stream.id]" class="group">
                  <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img [src]="stream.thumbnailUrl || 'assets/live-placeholder.png'" 
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                    <div class="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-xs font-medium rounded flex items-center gap-1">
                      <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </div>
                    <div class="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded flex items-center gap-1">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                      </svg>
                      {{ formatCount(stream.viewerCount) }}
                    </div>
                  </div>
                  <div class="flex gap-3 mt-3">
                    <img [src]="stream.channel.avatarUrl || 'assets/default-avatar.png'" 
                      class="w-10 h-10 rounded-full object-cover">
                    <div class="flex-1 min-w-0">
                      <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600">
                        {{ stream.title }}
                      </h3>
                      <div class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span>{{ stream.channel.displayName }}</span>
                        @if (stream.channel.isVerified) {
                          <svg class="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                          </svg>
                        }
                      </div>
                    </div>
                  </div>
                </a>
              }
            </div>
          } @else {
            <div class="text-center py-8 bg-white dark:bg-gray-800 rounded-xl">
              <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <p class="text-gray-500 dark:text-gray-400">No one is live right now</p>
            </div>
          }
        </section>

        <!-- Upcoming Section -->
        <section>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Upcoming Streams
          </h2>
          
          @if (loadingUpcoming()) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              @for (i of [1,2,3,4]; track i) {
                <div class="animate-pulse">
                  <div class="aspect-video bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                  <div class="mt-3">
                    <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (upcoming().length) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              @for (stream of upcoming(); track stream.id) {
                <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                  <div class="relative aspect-video bg-gray-200 dark:bg-gray-700">
                    <img [src]="stream.thumbnailUrl || 'assets/live-placeholder.png'" 
                      class="w-full h-full object-cover">
                    <div class="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                      SCHEDULED
                    </div>
                  </div>
                  <div class="p-4">
                    <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2">{{ stream.title }}</h3>
                    <div class="flex items-center gap-2 mt-2">
                      <img [src]="stream.channel.avatarUrl || 'assets/default-avatar.png'" 
                        class="w-6 h-6 rounded-full object-cover">
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ stream.channel.displayName }}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ formatScheduledDate(stream.scheduledStartAt!) }}
                    </div>
                    <button class="w-full mt-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                      </svg>
                      Notify Me
                    </button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="text-center py-8 bg-white dark:bg-gray-800 rounded-xl">
              <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p class="text-gray-500 dark:text-gray-400">No upcoming streams scheduled</p>
            </div>
          }
        </section>
      </div>
    </div>
  `
})
export class LiveStreamsComponent implements OnInit {
  private liveStreamService = inject(LiveStreamService);

  liveNow = signal<LiveStream[]>([]);
  upcoming = signal<LiveStream[]>([]);
  loadingLive = signal(true);
  loadingUpcoming = signal(true);

  ngOnInit() {
    this.loadLiveNow();
    this.loadUpcoming();
  }

  loadLiveNow() {
    this.liveStreamService.getLiveNow(20).subscribe({
      next: (streams) => {
        this.liveNow.set(streams);
        this.loadingLive.set(false);
      },
      error: () => this.loadingLive.set(false)
    });
  }

  loadUpcoming() {
    this.liveStreamService.getUpcoming(20).subscribe({
      next: (streams) => {
        this.upcoming.set(streams);
        this.loadingUpcoming.set(false);
      },
      error: () => this.loadingUpcoming.set(false)
    });
  }

  formatCount(count: number): string {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  }

  formatScheduledDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return `In ${hours} hours`;
    }
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }
}
