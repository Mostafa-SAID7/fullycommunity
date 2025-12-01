import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Episode } from '../../../../core/services/podcast.service';

@Component({
  selector: 'app-episode-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="episode-card">
      <a [routerLink]="['/podcasts/episode', episode.podcastId, episode.id]" class="episode-link">
        <div class="thumbnail">
          <img [src]="episode.thumbnailUrl || episode.podcastCoverImageUrl || '/assets/podcast-default.png'" [alt]="episode.title" />
          <span class="duration">{{ formatDuration(episode.duration) }}</span>
          @if (showProgress && progress > 0) {
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="progress"></div>
            </div>
          }
        </div>
        <div class="info">
          <h4 class="title">{{ episode.title }}</h4>
          <p class="podcast">{{ episode.podcastTitle }}</p>
          <div class="meta">
            <span class="date">{{ episode.publishedAt | date:'mediumDate' }}</span>
            <span class="stats">
              <span>▶️ {{ episode.playCount | number }}</span>
              <span>❤️ {{ episode.likeCount | number }}</span>
            </span>
          </div>
          @if (episode.description) {
            <p class="description">{{ episode.description }}</p>
          }
        </div>
      </a>
      <div class="actions">
        <button (click)="onPlay.emit(episode)" class="btn-play" title="Play">▶️</button>
        <button (click)="onAddToQueue.emit(episode)" title="Add to Queue">📋</button>
        <button (click)="onSave.emit(episode)" title="Save">🔖</button>
        <button (click)="onShare.emit(episode)" title="Share">📤</button>
      </div>
    </div>
  `,
  styles: [`
    .episode-card {
      display: flex; align-items: flex-start; gap: 1rem;
      background: white; border-radius: 12px; padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .episode-link { display: flex; gap: 1rem; flex: 1; text-decoration: none; color: inherit; }
    .thumbnail { position: relative; width: 120px; height: 120px; flex-shrink: 0; border-radius: 8px; overflow: hidden; }
    .thumbnail img { width: 100%; height: 100%; object-fit: cover; }
    .duration {
      position: absolute; bottom: 6px; right: 6px;
      background: rgba(0,0,0,0.8); color: white; padding: 2px 6px;
      border-radius: 4px; font-size: 0.75rem;
    }
    .progress-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: rgba(255,255,255,0.3); }
    .progress-fill { height: 100%; background: #6366f1; }
    .info { flex: 1; min-width: 0; }
    .title { font-size: 1rem; font-weight: 600; margin: 0 0 0.25rem; line-height: 1.3; }
    .podcast { font-size: 0.85rem; color: #6366f1; margin: 0 0 0.5rem; }
    .meta { display: flex; justify-content: space-between; font-size: 0.8rem; color: #888; margin-bottom: 0.5rem; }
    .stats { display: flex; gap: 0.75rem; }
    .description {
      font-size: 0.85rem; color: #666; margin: 0;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .actions { display: flex; flex-direction: column; gap: 0.5rem; }
    .actions button {
      width: 36px; height: 36px; border-radius: 50%; border: 1px solid #e5e5e5;
      background: white; cursor: pointer; font-size: 1rem;
    }
    .actions button:hover { background: #f5f5f5; }
    .btn-play { background: #6366f1 !important; border-color: #6366f1 !important; }
  `]
})
export class EpisodeCardComponent {
  @Input() episode!: Episode;
  @Input() showProgress = false;
  @Input() progress = 0;

  @Output() onPlay = new EventEmitter<Episode>();
  @Output() onAddToQueue = new EventEmitter<Episode>();
  @Output() onSave = new EventEmitter<Episode>();
  @Output() onShare = new EventEmitter<Episode>();

  formatDuration(duration: string): string {
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
}
