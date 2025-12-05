import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EpisodeListItem, PodcastService } from '../../../../core/services/media/podcast.service';

@Component({
  selector: 'app-episode-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="episode-card" [class.compact]="compact">
      <a [routerLink]="['/podcasts/episode', episode.podcastShowId, episode.id]" class="episode-link">
        <div class="thumbnail">
          <img [src]="episode.thumbnailUrl || episode.podcastCoverImageUrl || '/assets/podcast-default.png'" [alt]="episode.title" loading="lazy" />
          <span class="duration">{{ formatDuration(episode.duration) }}</span>
          @if (showProgress && progress > 0) {
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="progress"></div>
            </div>
          }
          <button class="play-overlay" (click)="onPlayClick($event)" title="Play">
            <span>▶</span>
          </button>
        </div>
        <div class="info">
          <h4 class="title">{{ episode.title }}</h4>
          <p class="podcast">{{ episode.podcastTitle }}</p>
          <div class="meta">
            <span class="episode-info">
              @if (episode.seasonNumber) {
                S{{ episode.seasonNumber }} · 
              }
              E{{ episode.episodeNumber }}
            </span>
            <span class="date">{{ episode.publishedAt | date:'mediumDate' }}</span>
          </div>
          <div class="stats">
            <span title="Plays">▶️ {{ formatNumber(episode.playCount) }}</span>
            <span title="Likes">❤️ {{ formatNumber(episode.likeCount) }}</span>
            <span title="Comments">💬 {{ episode.commentCount }}</span>
          </div>
          @if (episode.description && !compact) {
            <p class="description">{{ episode.description }}</p>
          }
        </div>
      </a>
      @if (!compact) {
        <div class="actions">
          <button (click)="onPlay.emit(episode)" class="btn-action btn-play" title="Play Now">
            ▶️
          </button>
          <button (click)="handleAddToQueue()" class="btn-action" title="Add to Queue">
            📋
          </button>
          <button (click)="handleSave()" class="btn-action" [class.saved]="isSaved" title="Save">
            {{ isSaved ? '🔖' : '📑' }}
          </button>
          <button (click)="handleShare()" class="btn-action" title="Share">
            📤
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .episode-card {
      display: flex; align-items: flex-start; gap: 1rem;
      background: white; border-radius: 12px; padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: box-shadow 0.2s;
    }
    .episode-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .episode-card.compact { padding: 0.75rem; }
    .episode-link { display: flex; gap: 1rem; flex: 1; text-decoration: none; color: inherit; }
    .thumbnail { 
      position: relative; width: 120px; height: 120px; flex-shrink: 0; 
      border-radius: 8px; overflow: hidden; background: #f0f0f0;
    }
    .compact .thumbnail { width: 80px; height: 80px; }
    .thumbnail img { width: 100%; height: 100%; object-fit: cover; }
    .duration {
      position: absolute; bottom: 6px; right: 6px;
      background: rgba(0,0,0,0.85); color: white; padding: 2px 6px;
      border-radius: 4px; font-size: 0.75rem; font-weight: 500;
    }
    .progress-bar { 
      position: absolute; bottom: 0; left: 0; right: 0; 
      height: 4px; background: rgba(255,255,255,0.3); 
    }
    .progress-fill { height: 100%; background: #6366f1; transition: width 0.3s; }
    .play-overlay {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.2s;
      border: none; cursor: pointer;
    }
    .play-overlay span {
      width: 40px; height: 40px; background: #6366f1; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 1rem;
    }
    .thumbnail:hover .play-overlay { opacity: 1; }
    .info { flex: 1; min-width: 0; }
    .title { 
      font-size: 1rem; font-weight: 600; margin: 0 0 0.25rem; line-height: 1.3;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .compact .title { font-size: 0.9rem; -webkit-line-clamp: 1; }
    .podcast { font-size: 0.85rem; color: #6366f1; margin: 0 0 0.5rem; font-weight: 500; }
    .meta { display: flex; gap: 1rem; font-size: 0.8rem; color: #888; margin-bottom: 0.5rem; }
    .episode-info { color: #666; font-weight: 500; }
    .stats { display: flex; gap: 1rem; font-size: 0.8rem; color: #666; margin-bottom: 0.5rem; }
    .description {
      font-size: 0.85rem; color: #666; margin: 0;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .actions { display: flex; flex-direction: column; gap: 0.5rem; }
    .btn-action {
      width: 36px; height: 36px; border-radius: 50%; border: 1px solid #e5e5e5;
      background: white; cursor: pointer; font-size: 1rem; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center;
    }
    .btn-action:hover { background: #f5f5f5; transform: scale(1.1); }
    .btn-play { background: #6366f1 !important; border-color: #6366f1 !important; }
    .btn-action.saved { background: #fef3c7; border-color: #f59e0b; }
  `]
})
export class EpisodeCardComponent {
  @Input() episode!: EpisodeListItem;
  @Input() showProgress = false;
  @Input() progress = 0;
  @Input() compact = false;

  @Output() onPlay = new EventEmitter<EpisodeListItem>();
  @Output() onAddToQueue = new EventEmitter<EpisodeListItem>();
  @Output() onSave = new EventEmitter<EpisodeListItem>();
  @Output() onShare = new EventEmitter<EpisodeListItem>();

  private podcastService = inject(PodcastService);
  isSaved = false;

  onPlayClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.onPlay.emit(this.episode);
  }

  handleAddToQueue() {
    this.podcastService.addToQueue(this.episode.id).subscribe({
      next: () => this.onAddToQueue.emit(this.episode),
      error: () => console.error('Failed to add to queue')
    });
  }

  handleSave() {
    if (this.isSaved) {
      this.podcastService.unsaveEpisode(this.episode.id).subscribe({
        next: () => {
          this.isSaved = false;
          this.onSave.emit(this.episode);
        }
      });
    } else {
      this.podcastService.saveEpisode(this.episode.id).subscribe({
        next: () => {
          this.isSaved = true;
          this.onSave.emit(this.episode);
        }
      });
    }
  }

  handleShare() {
    if (navigator.share) {
      navigator.share({
        title: this.episode.title,
        text: `Listen to ${this.episode.title} from ${this.episode.podcastTitle}`,
        url: `${window.location.origin}/podcasts/episode/${this.episode.podcastShowId}/${this.episode.id}`
      });
    }
    this.onShare.emit(this.episode);
  }

  formatDuration(duration: string): string {
    return this.podcastService.formatDuration(duration);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  }
}
