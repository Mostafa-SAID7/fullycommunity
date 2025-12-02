import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Video } from '../../../core/services/video.service';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a [routerLink]="['/videos/watch', video.id]" class="block group">
      <!-- Thumbnail -->
      <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img [src]="video.thumbnailUrl || 'assets/video-placeholder.png'" [alt]="video.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        
        <!-- Duration Badge -->
        <div class="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded">
          {{ formatDuration(video.duration) }}
        </div>
        
        <!-- Live Badge -->
        @if (video.type === 'Live') {
          <div class="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-xs font-medium rounded">
            LIVE
          </div>
        }
        
        <!-- Preview on Hover -->
        @if (video.previewGifUrl) {
          <img [src]="video.previewGifUrl" [alt]="video.title"
            class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity">
        }
      </div>
      
      <!-- Info -->
      <div class="flex gap-3 mt-3">
        <a [routerLink]="['/videos/channel', video.channel.handle]" (click)="$event.stopPropagation()"
          class="flex-shrink-0">
          <img [src]="video.channel.avatarUrl || 'assets/default-avatar.png'" [alt]="video.channel.displayName"
            class="w-9 h-9 rounded-full object-cover">
        </a>
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {{ video.title }}
          </h3>
          <a [routerLink]="['/videos/channel', video.channel.handle]" (click)="$event.stopPropagation()"
            class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mt-1">
            <span>{{ video.channel.displayName }}</span>
            @if (video.channel.isVerified) {
              <svg class="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            }
          </a>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ formatViews(video.viewCount) }} views · {{ formatDate(video.publishedAt || video.createdAt) }}
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
