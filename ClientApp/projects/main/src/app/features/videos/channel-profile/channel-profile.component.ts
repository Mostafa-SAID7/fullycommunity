import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ChannelService } from '../../../core/services/channel.service';
import { VideoService, Video, Channel } from '../../../core/services/video.service';
import { VideoCardComponent } from '../shared/video-card.component';

@Component({
  selector: 'app-channel-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, VideoCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      @if (loading()) {
        <div class="animate-pulse">
          <div class="h-48 bg-gray-300 dark:bg-gray-700"></div>
          <div class="max-w-6xl mx-auto px-4 -mt-16">
            <div class="flex items-end gap-4">
              <div class="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-white dark:border-gray-900"></div>
              <div class="pb-4">
                <div class="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                <div class="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      } @else if (channel()) {
        <!-- Banner -->
        <div class="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          @if (channel()!.bannerUrl) {
            <img [src]="channel()!.bannerUrl" class="w-full h-full object-cover">
          }
        </div>

        <!-- Channel Info -->
        <div class="max-w-6xl mx-auto px-4">
          <div class="flex flex-col md:flex-row md:items-end gap-4 -mt-16 relative z-10">
            <img [src]="channel()!.avatarUrl || 'assets/default-avatar.png'" 
              class="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-900 bg-gray-200">
            
            <div class="flex-1 pb-4">
              <div class="flex items-center gap-2">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ channel()!.displayName }}</h1>
                @if (channel()!.isVerified) {
                  <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                }
              </div>
              <p class="text-gray-600 dark:text-gray-400">&#64;{{ channel()!.handle }}</p>
              <div class="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{{ formatCount(channel()!.subscriberCount) }} subscribers</span>
                <span>{{ channel()!.videoCount }} videos</span>
              </div>
            </div>

            <div class="flex items-center gap-3 pb-4">
              <button (click)="toggleSubscribe()" 
                [class]="isSubscribed() 
                  ? 'px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600' 
                  : 'px-6 py-2.5 bg-red-600 text-white rounded-full font-medium hover:bg-red-700'">
                {{ isSubscribed() ? 'Subscribed' : 'Subscribe' }}
              </button>
              
              <!-- Social Links -->
              <div class="flex items-center gap-2">
                @if (channel()!.youTubeUrl) {
                  <a [href]="channel()!.youTubeUrl" target="_blank" class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                }
                @if (channel()!.instagramUrl) {
                  <a [href]="channel()!.instagramUrl" target="_blank" class="p-2 text-gray-600 dark:text-gray-400 hover:text-pink-600">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                }
                @if (channel()!.twitterUrl) {
                  <a [href]="channel()!.twitterUrl" target="_blank" class="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-400">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                }
                @if (channel()!.tikTokUrl) {
                  <a [href]="channel()!.tikTokUrl" target="_blank" class="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  </a>
                }
              </div>
            </div>
          </div>

          <!-- Bio -->
          @if (channel()!.bio) {
            <p class="text-gray-700 dark:text-gray-300 mt-4 max-w-3xl">{{ channel()!.bio }}</p>
          }

          <!-- Tabs -->
          <div class="flex gap-6 mt-6 border-b border-gray-200 dark:border-gray-700">
            @for (tab of tabs; track tab.id) {
              <button (click)="activeTab.set(tab.id)"
                [class]="activeTab() === tab.id 
                  ? 'pb-3 border-b-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-medium' 
                  : 'pb-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'">
                {{ tab.label }}
              </button>
            }
          </div>

          <!-- Content -->
          <div class="py-6">
            @switch (activeTab()) {
              @case ('videos') {
                @if (videos().length) {
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    @for (video of videos(); track video.id) {
                      <app-video-card [video]="video" />
                    }
                  </div>
                  @if (hasMoreVideos()) {
                    <div class="text-center mt-6">
                      <button (click)="loadMoreVideos()" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                        Load More
                      </button>
                    </div>
                  }
                } @else {
                  <div class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    <p class="text-gray-500 dark:text-gray-400">No videos yet</p>
                  </div>
                }
              }
              @case ('about') {
                <div class="max-w-2xl">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-4">About</h3>
                  <p class="text-gray-700 dark:text-gray-300 mb-6">{{ channel()!.bio || 'No description provided.' }}</p>
                  
                  <div class="space-y-3">
                    @if (channel()!.websiteUrl) {
                      <div class="flex items-center gap-3">
                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                        </svg>
                        <a [href]="channel()!.websiteUrl" target="_blank" class="text-blue-600 hover:underline">{{ channel()!.websiteUrl }}</a>
                      </div>
                    }
                    @if (channel()!.country) {
                      <div class="flex items-center gap-3">
                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span class="text-gray-700 dark:text-gray-300">{{ channel()!.city ? channel()!.city + ', ' : '' }}{{ channel()!.country }}</span>
                      </div>
                    }
                    <div class="flex items-center gap-3">
                      <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <span class="text-gray-700 dark:text-gray-300">Joined {{ formatDate(channel()!.createdAt) }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      <span class="text-gray-700 dark:text-gray-300">{{ formatCount(channel()!.totalViews) }} total views</span>
                    </div>
                  </div>
                </div>
              }
            }
          </div>
        </div>
      }
    </div>
  `
})
export class ChannelProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private channelService = inject(ChannelService);

  channel = signal<Channel | null>(null);
  videos = signal<Video[]>([]);
  loading = signal(true);
  isSubscribed = signal(false);
  activeTab = signal<'videos' | 'about'>('videos');
  hasMoreVideos = signal(true);
  
  videoPage = 1;
  tabs = [
    { id: 'videos' as const, label: 'Videos' },
    { id: 'about' as const, label: 'About' }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadChannel(params['handle']);
    });
  }

  loadChannel(handle: string) {
    this.loading.set(true);
    this.channelService.getChannelByHandle(handle).subscribe({
      next: (channel) => {
        this.channel.set(channel);
        this.isSubscribed.set(channel.isSubscribed || false);
        this.loading.set(false);
        this.loadVideos(channel.id);
      },
      error: () => this.loading.set(false)
    });
  }

  loadVideos(channelId: string) {
    this.videoPage = 1;
    this.channelService.getChannelVideos(channelId, 1, 20).subscribe(result => {
      this.videos.set(result.items);
      this.hasMoreVideos.set(result.page < result.totalPages);
    });
  }

  loadMoreVideos() {
    if (!this.channel()) return;
    this.videoPage++;
    this.channelService.getChannelVideos(this.channel()!.id, this.videoPage, 20).subscribe(result => {
      this.videos.update(v => [...v, ...result.items]);
      this.hasMoreVideos.set(result.page < result.totalPages);
    });
  }

  toggleSubscribe() {
    if (!this.channel()) return;
    if (this.isSubscribed()) {
      this.channelService.unsubscribe(this.channel()!.id).subscribe(() => {
        this.isSubscribed.set(false);
        this.channel.update(c => c ? { ...c, subscriberCount: c.subscriberCount - 1 } : null);
      });
    } else {
      this.channelService.subscribe(this.channel()!.id).subscribe(() => {
        this.isSubscribed.set(true);
        this.channel.update(c => c ? { ...c, subscriberCount: c.subscriberCount + 1 } : null);
      });
    }
  }

  formatCount(count: number): string {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
}
