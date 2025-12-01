import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Podcast } from '../../../../core/services/podcast.service';

@Component({
  selector: 'app-podcast-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a [routerLink]="['/podcasts/show', podcast.slug || podcast.id]" class="podcast-card" [class.compact]="compact">
      <div class="cover">
        <img [src]="podcast.coverImageUrl || '/assets/podcast-default.png'" [alt]="podcast.title" />
        @if (podcast.episodeCount > 0) {
          <span class="episode-count">{{ podcast.episodeCount }} episodes</span>
        }
      </div>
      <div class="info">
        <h3 class="title">{{ podcast.title }}</h3>
        <p class="channel">{{ podcast.channelName }}</p>
        @if (!compact) {
          <div class="meta">
            <span class="rating">⭐ {{ podcast.averageRating | number:'1.1-1' }}</span>
            <span class="subscribers">{{ podcast.subscriberCount | number }} subscribers</span>
          </div>
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
    .cover { position: relative; aspect-ratio: 1; overflow: hidden; }
    .cover img { width: 100%; height: 100%; object-fit: cover; }
    .episode-count {
      position: absolute; bottom: 8px; right: 8px;
      background: rgba(0,0,0,0.7); color: white; padding: 4px 8px;
      border-radius: 4px; font-size: 0.75rem;
    }
    .info { padding: 1rem; }
    .title { font-size: 1rem; font-weight: 600; margin: 0 0 0.25rem; line-height: 1.3;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .channel { font-size: 0.85rem; color: #666; margin: 0 0 0.5rem; }
    .meta { display: flex; gap: 1rem; font-size: 0.8rem; color: #888; }
    .compact .info { padding: 0.75rem; }
    .compact .title { font-size: 0.9rem; -webkit-line-clamp: 1; }
    .compact .channel { font-size: 0.8rem; margin: 0; }
  `]
})
export class PodcastCardComponent {
  @Input() podcast!: Podcast;
  @Input() compact = false;
}
