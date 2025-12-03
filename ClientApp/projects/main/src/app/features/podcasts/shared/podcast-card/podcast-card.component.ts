import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PodcastListItem, PodcastService, PodcastCategory } from '../../../../core/services/podcast.service';

@Component({
  selector: 'app-podcast-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a [routerLink]="['/podcasts/show', podcast.slug || podcast.id]" class="podcast-card" [class.compact]="compact">
      <div class="cover">
        <img [src]="podcast.coverImageUrl || '/assets/podcast-default.png'" [alt]="podcast.title" loading="lazy" />
        @if (podcast.episodeCount > 0) {
          <span class="episode-count">{{ podcast.episodeCount }} episodes</span>
        }
        <span class="category-badge">{{ getCategoryName(podcast.category) }}</span>
      </div>
      <div class="info">
        <h3 class="title">{{ podcast.title }}</h3>
        <p class="owner">{{ podcast.ownerName }}</p>
        @if (!compact) {
          <div class="meta">
            <span class="rating" [title]="'Rating: ' + (podcast.averageRating | number:'1.1-1')">
              ⭐ {{ podcast.averageRating | number:'1.1-1' }}
            </span>
            <span class="subscribers">{{ formatNumber(podcast.subscriberCount) }} subscribers</span>
          </div>
          @if (podcast.description) {
            <p class="description">{{ podcast.description }}</p>
          }
        }
      </div>
    </a>
  `,
  styles: [`
    .podcast-card {
      display: block; text-decoration: none; color: inherit;
      background: white; border-radius: 12px; overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s;
    }
    .podcast-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .podcast-card.compact { min-width: 160px; max-width: 160px; }
    .cover { position: relative; aspect-ratio: 1; overflow: hidden; background: #f0f0f0; }
    .cover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
    .podcast-card:hover .cover img { transform: scale(1.05); }
    .episode-count {
      position: absolute; bottom: 8px; right: 8px;
      background: rgba(0,0,0,0.75); color: white; padding: 4px 8px;
      border-radius: 4px; font-size: 0.75rem; font-weight: 500;
    }
    .category-badge {
      position: absolute; top: 8px; left: 8px;
      background: #6366f1; color: white; padding: 4px 8px;
      border-radius: 4px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
    }
    .info { padding: 1rem; }
    .title { 
      font-size: 1rem; font-weight: 600; margin: 0 0 0.25rem; line-height: 1.3;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .owner { font-size: 0.85rem; color: #666; margin: 0 0 0.5rem; }
    .meta { display: flex; gap: 1rem; font-size: 0.8rem; color: #888; margin-bottom: 0.5rem; }
    .rating { color: #f59e0b; }
    .description {
      font-size: 0.8rem; color: #666; margin: 0;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .compact .info { padding: 0.75rem; }
    .compact .title { font-size: 0.9rem; -webkit-line-clamp: 1; }
    .compact .owner { font-size: 0.8rem; margin: 0; }
    .compact .category-badge { display: none; }
  `]
})
export class PodcastCardComponent {
  @Input() podcast!: PodcastListItem;
  @Input() compact = false;

  private podcastService = inject(PodcastService);

  getCategoryName(category: PodcastCategory): string {
    return this.podcastService.getCategoryName(category);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}
