import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PodcastListItem, PodcastService } from '../../../../core/services/podcast.service';
import { BadgeComponent, ButtonComponent, CardComponent } from '../../../../shared/ui';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-podcast-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, BadgeComponent, ButtonComponent, TranslatePipe],
  template: `
    <!-- Compact Mode -->
    <div *ngIf="compact" class="flex-shrink-0 w-48">
      <ui-card variant="elevated" [hover]="true" [clickable]="true" class="h-full">
        <div class="flex flex-col">
          <!-- Compact Cover -->
          <div class="relative aspect-square mb-3 overflow-hidden rounded-lg">
            <img 
              [src]="podcast.coverImageUrl || '/assets/images/podcast-placeholder.jpg'" 
              [alt]="podcast.title"
              class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy">
            
            <!-- Play Button Overlay -->
            <div class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button 
                class="bg-white/90 hover:bg-white text-primary rounded-full p-2 transform hover:scale-110 transition-all duration-200"
                (click)="onPlay($event)">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Compact Content -->
          <div class="flex-1">
            <!-- Title -->
            <h4 class="font-semibold text-sm text-secondary-900 dark:text-white mb-1 line-clamp-2 hover:text-primary transition-colors">
              <a [routerLink]="['/podcasts', podcast.id]" class="block">
                {{ podcast.title }}
              </a>
            </h4>

            <!-- Host -->
            <p class="text-xs text-secondary-600 dark:text-secondary-400 mb-2">
              {{ podcast.ownerName }}
            </p>

            <!-- Compact Stats -->
            <div class="flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400 mb-3">
              <span>{{ podcast.episodeCount }} {{ podcast.episodeCount === 1 ? ('podcasts.episode' | translate) : ('podcasts.episodes' | translate) }}</span>
              <div class="flex items-center space-x-1">
                <svg class="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>{{ podcast.averageRating | number:'1.1-1' }}</span>
              </div>
            </div>

            <!-- Compact Action -->
            <ui-button 
              variant="primary" 
              size="sm" 
              [fullWidth]="true"
              (clicked)="onSubscribe($event)">
              {{ isSubscribed ? ('podcasts.subscribed' | translate) : ('podcasts.subscribe' | translate) }}
            </ui-button>
          </div>
        </div>
      </ui-card>
    </div>

    <!-- Full Mode -->
    <ui-card *ngIf="!compact" variant="elevated" [hover]="true" [clickable]="true" class="h-full">
      <div class="flex flex-col h-full">
        <!-- Podcast Cover -->
        <div class="relative aspect-square mb-4 overflow-hidden rounded-lg">
          <img 
            [src]="podcast.coverImageUrl || '/assets/images/podcast-placeholder.jpg'" 
            [alt]="podcast.title"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy">
          
          <!-- Play Button Overlay -->
          <div class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              class="bg-white/90 hover:bg-white text-primary rounded-full p-3 transform hover:scale-110 transition-all duration-200"
              (click)="onPlay($event)">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
          
          <!-- Episode Count Badge -->
          <div class="absolute top-2 right-2">
            <ui-badge variant="primary" size="sm">
              {{ podcast.episodeCount }} {{ podcast.episodeCount === 1 ? ('podcasts.episode' | translate) : ('podcasts.episodes' | translate) }}
            </ui-badge>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 flex flex-col">
          <!-- Title -->
          <h3 class="font-semibold text-secondary-900 dark:text-white mb-2 line-clamp-2 hover:text-primary transition-colors">
            <a [routerLink]="['/podcasts', podcast.id]" class="block">
              {{ podcast.title }}
            </a>
          </h3>

          <!-- Host -->
          <p class="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
            {{ 'podcasts.hostedBy' | translate }} {{ podcast.ownerName }}
          </p>

          <!-- Description -->
          <p class="text-sm text-secondary-700 dark:text-secondary-300 mb-4 line-clamp-3 flex-1">
            {{ podcast.description }}
          </p>

          <!-- Stats -->
          <div class="flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400 mb-4">
            <div class="flex items-center space-x-4">
              <!-- Rating -->
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>{{ podcast.averageRating | number:'1.1-1' }}</span>
              </div>
              
              <!-- Subscribers -->
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span>{{ formatNumber(podcast.subscriberCount) }}</span>
              </div>
            </div>

            <!-- Published Date -->
            <span>{{ formatDate(podcast.publishedAt) }}</span>
          </div>

          <!-- Category -->
          <div class="flex flex-wrap gap-1 mb-4">
            <ui-badge 
              variant="secondary" 
              size="sm">
              {{ getCategoryName(podcast.category) }}
            </ui-badge>
          </div>

          <!-- Actions -->
          <div class="flex space-x-2">
            <ui-button 
              variant="primary" 
              size="sm" 
              [fullWidth]="true"
              (clicked)="onSubscribe($event)">
              {{ isSubscribed ? ('podcasts.subscribed' | translate) : ('podcasts.subscribe' | translate) }}
            </ui-button>
            
            <ui-button 
              variant="ghost" 
              size="sm"
              (clicked)="onShare($event)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
              </svg>
            </ui-button>
          </div>
        </div>
      </div>
    </ui-card>
  `
})
export class PodcastCardComponent implements OnInit {
  @Input() podcast!: PodcastListItem;
  @Input() compact = false;
  
  private podcastService = inject(PodcastService);
  isSubscribed = false;

  ngOnInit() {
    // Check subscription status
    this.checkSubscriptionStatus();
  }

  onPlay(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    // Implement play functionality
    console.log('Play podcast:', this.podcast.title);
  }

  onSubscribe(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.isSubscribed) {
      this.podcastService.unsubscribe(this.podcast.id).subscribe({
        next: () => {
          this.isSubscribed = false;
        },
        error: (error) => console.error('Failed to unsubscribe:', error)
      });
    } else {
      this.podcastService.subscribe(this.podcast.id).subscribe({
        next: () => {
          this.isSubscribed = true;
        },
        error: (error) => console.error('Failed to subscribe:', error)
      });
    }
  }

  private checkSubscriptionStatus() {
    this.podcastService.isSubscribed(this.podcast.id).subscribe({
      next: (result) => {
        this.isSubscribed = result.isSubscribed;
      },
      error: () => {
        this.isSubscribed = false;
      }
    });
  }

  onShare(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    // Implement share functionality
    console.log('Share podcast:', this.podcast.title);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '';
    
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  }

  getCategoryName(category: number): string {
    return this.podcastService.getCategoryName(category);
  }
}