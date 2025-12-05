import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../../core/services/media/channel.service';
import { VideoService, Video, Channel, ChannelStats } from '../../../core/services/media/video.service';

@Component({
  selector: 'app-creator-studio',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Creator Studio</h1>
            <a routerLink="/videos/upload" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Upload Video
            </a>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-6">
        @if (!channel()) {
          <!-- No Channel - Create One -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Create Your Channel</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Start sharing videos with the community</p>
            
            <div class="max-w-md mx-auto space-y-4">
              <input type="text" [(ngModel)]="newChannel.handle" placeholder="Channel handle (e.g., myawesomechannel)"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <input type="text" [(ngModel)]="newChannel.displayName" placeholder="Display name"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <textarea [(ngModel)]="newChannel.bio" placeholder="Tell viewers about your channel" rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
              <button (click)="createChannel()" [disabled]="!newChannel.handle || !newChannel.displayName"
                class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                Create Channel
              </button>
            </div>
          </div>
        } @else {
          <!-- Dashboard -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Stats Cards -->
            <div class="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
                <div class="text-sm text-gray-500 dark:text-gray-400">Subscribers</div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCount(channel()!.subscriberCount) }}</div>
                @if (stats()?.subscriberGrowth) {
                  <div class="text-sm text-green-500">+{{ stats()!.subscriberGrowth }} this week</div>
                }
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
                <div class="text-sm text-gray-500 dark:text-gray-400">Total Views</div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCount(channel()!.totalViews) }}</div>
                @if (stats()?.viewsGrowth) {
                  <div class="text-sm text-green-500">+{{ formatCount(stats()!.viewsGrowth) }} this week</div>
                }
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
                <div class="text-sm text-gray-500 dark:text-gray-400">Videos</div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ channel()!.videoCount }}</div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
                <div class="text-sm text-gray-500 dark:text-gray-400">Total Likes</div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCount(channel()!.totalLikes) }}</div>
              </div>
            </div>

            <!-- Channel Info -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Channel Info</h3>
              <div class="flex items-center gap-4 mb-4">
                <img [src]="channel()!.avatarUrl || 'assets/default-avatar.png'" 
                  class="w-16 h-16 rounded-full object-cover">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-900 dark:text-white">{{ channel()!.displayName }}</span>
                    @if (channel()!.isVerified) {
                      <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                    }
                  </div>
                  <span class="text-sm text-gray-500 dark:text-gray-400">&#64;{{ channel()!.handle }}</span>
                </div>
              </div>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">{{ channel()!.bio || 'No description' }}</p>
              <button (click)="showEditChannel.set(true)" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Edit Channel
              </button>
            </div>

            <!-- Recent Videos -->
            <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-900 dark:text-white">Your Videos</h3>
                <a [routerLink]="['/videos/channel', channel()!.handle]" class="text-blue-600 hover:underline text-sm">View All</a>
              </div>
              
              @if (videos().length) {
                <div class="space-y-3">
                  @for (video of videos().slice(0, 5); track video.id) {
                    <div class="flex gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                      <img [src]="video.thumbnailUrl || 'assets/video-placeholder.png'" 
                        class="w-32 aspect-video rounded object-cover flex-shrink-0">
                      <div class="flex-1 min-w-0">
                        <h4 class="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">{{ video.title }}</h4>
                        <div class="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span [class]="video.status === 'Published' ? 'text-green-500' : 'text-yellow-500'">
                            {{ video.status }}
                          </span>
                          <span>·</span>
                          <span>{{ formatCount(video.viewCount) }} views</span>
                          <span>·</span>
                          <span>{{ formatCount(video.likeCount) }} likes</span>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <a [routerLink]="['/videos/watch', video.id]" class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </a>
                        <button (click)="deleteVideo(video)" class="p-2 text-gray-500 hover:text-red-500">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="text-center py-8">
                  <p class="text-gray-500 dark:text-gray-400 mb-4">No videos yet</p>
                  <a routerLink="/videos/upload" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Upload Your First Video
                  </a>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Edit Channel Modal -->
      @if (showEditChannel() && channel()) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" (click)="showEditChannel.set(false)">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Channel</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                <input type="text" [(ngModel)]="editChannel.displayName"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <textarea [(ngModel)]="editChannel.bio" rows="3"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
                <input type="url" [(ngModel)]="editChannel.websiteUrl"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram</label>
                  <input type="url" [(ngModel)]="editChannel.instagramUrl"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter/X</label>
                  <input type="url" [(ngModel)]="editChannel.twitterUrl"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <button (click)="showEditChannel.set(false)" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                Cancel
              </button>
              <button (click)="updateChannel()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CreatorStudioComponent implements OnInit {
  private channelService = inject(ChannelService);
  private videoService = inject(VideoService);

  channel = signal<Channel | null>(null);
  stats = signal<ChannelStats | null>(null);
  videos = signal<Video[]>([]);
  showEditChannel = signal(false);

  newChannel = { handle: '', displayName: '', bio: '' };
  editChannel = { displayName: '', bio: '', websiteUrl: '', instagramUrl: '', twitterUrl: '' };

  ngOnInit() {
    this.loadChannel();
  }

  loadChannel() {
    this.channelService.getMyChannel().subscribe({
      next: (channel) => {
        this.channel.set(channel);
        this.editChannel = {
          displayName: channel.displayName,
          bio: channel.bio || '',
          websiteUrl: channel.websiteUrl || '',
          instagramUrl: channel.instagramUrl || '',
          twitterUrl: channel.twitterUrl || ''
        };
        this.loadStats();
        this.loadVideos(channel.id);
      },
      error: () => this.channel.set(null)
    });
  }

  loadStats() {
    this.channelService.getMyStats().subscribe(stats => this.stats.set(stats));
  }

  loadVideos(channelId: string) {
    this.channelService.getChannelVideos(channelId, 1, 10).subscribe(result => this.videos.set(result.items));
  }

  createChannel() {
    if (!this.newChannel.handle || !this.newChannel.displayName) return;
    this.channelService.createChannel(this.newChannel).subscribe(channel => {
      this.channel.set(channel);
      this.loadStats();
    });
  }

  updateChannel() {
    this.channelService.updateChannel(this.editChannel).subscribe(channel => {
      this.channel.set(channel);
      this.showEditChannel.set(false);
    });
  }

  deleteVideo(video: Video) {
    if (confirm('Are you sure you want to delete this video?')) {
      this.videoService.deleteVideo(video.id).subscribe(() => {
        this.videos.update(v => v.filter(x => x.id !== video.id));
      });
    }
  }

  formatCount(count: number): string {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  }
}
