import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Video } from '../../../core/services/media/video.service';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Microsoft Fluent Design Video Card -->
    <a [routerLink]="['/videos/watch', video.id]" class="block group">
      <!-- Thumbnail Container -->
      <div class="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200/50 dark:ring-gray-700/50">
        <img [src]="video.thumbnailUrl || 'assets/video-placeholder.png'" [alt]="video.title"
          class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200 ease-out">
        
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <!-- Duration Badge - Fluent Style -->
        <div class="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/75 backdrop-blur-sm text-white text-xs font-medium rounded">
          {{ formatDuration(video.duration) }}
        </div>
        
        <!-- Live Badge - Fluent Style -->
        @if (video.type === 'Live') {
          <div class="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded">
            <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            LIVE
          </div>
        }
        
        <!-- Play Button Overlay -->
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="w-12 h-12 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <svg class="w-5 h-5 text-gray-900 dark:text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        
        <!-- Preview on Hover -->
        @if (video.previewGifUrl) {
          <img [src]="video.previewGifUrl" [alt]="video.title"
            class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity">
        }
      </div>
      
      <!-- Video Info - Fluent Style -->
      <div class="flex gap-3 mt-3">
        <a [routerLink]="['/videos/channel', video.channel.handle]" (click)="$event.stopPropagation()"
          class="flex-shrink-0">
          <img [src]="video.channel.avatarUrl || 'assets/default-avatar.png'" [alt]="video.channel.displayName"
            class="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700 hover:ring-primary-200 dark:hover:ring-primary-800 transition-all">
        </a>
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {{ video.title }}
          </h3>
          <a [routerLink]="['/videos/channel', video.channel.handle]" (click)="$event.stopPropagation()"
            class="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mt-1 transition-colors">
            <span>{{ video.channel.displayName }}</span>
            @if (video.channel.isVerified) {
              <svg class="w-3.5 h-3.5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            }
          </a>
          <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{{ formatViews(video.viewCount) }} views</span>
            <span class="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500"></span>
            <span>{{ formatDate(video.publishedAt || video.createdAt) }}</span>
          </div>
        </div>
      </div>
    </a>
  `
})
export class VideoCardComponent {
  @Input({ required: true }) video!: Video;

  formatDuration(duration: string): string {
    // Parse ISO 8601 duration or time string
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
