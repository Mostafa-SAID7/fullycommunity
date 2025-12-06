import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoService, Video } from '../../../core/services/media/video.service';

@Component({
  selector: 'app-watch-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="history-container">
      <div class="header">
        <h1>Watch History</h1>
        <button class="clear-btn" (click)="clearHistory()">Clear all history</button>
      </div>
      
      @if (loading()) {
        <div class="loading">Loading...</div>
      } @else {
        <div class="history-list">
          @for (video of history(); track video.id) {
            <div class="history-item">
              <a [routerLink]="['/videos/watch', video.id]" class="video-link">
                <div class="thumbnail" [style.background-image]="'url(' + (video.thumbnailUrl || 'assets/video-placeholder.jpg') + ')'">
                  <span class="duration">{{ video.duration }}</span>
                </div>
                <div class="video-info">
                  <h3>{{ video.title }}</h3>
                  <span class="channel">{{ video.channel.displayName }}</span>
                  <span class="meta">{{ video.viewCount | number }} views</span>
                </div>
              </a>
              <button class="remove-btn" (click)="removeFromHistory(video.id)">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
          }
        </div>
        
        @if (history().length === 0) {
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/></svg>
            <h2>No watch history</h2>
            <p>Videos you watch will appear here</p>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .history-container { padding: 1rem; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .header h1 { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .clear-btn { padding: 0.5rem 1rem; background: transparent; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; color: #65676b; }
    .clear-btn:hover { background: #f0f2f5; }
    .loading { text-align: center; padding: 2rem; color: #65676b; }
    .history-list { display: flex; flex-direction: column; gap: 1rem; }
    .history-item { display: flex; align-items: flex-start; gap: 1rem; padding: 0.5rem; border-radius: 8px; }
    .history-item:hover { background: #f0f2f5; }
    .video-link { display: flex; gap: 1rem; text-decoration: none; color: inherit; flex: 1; }
    .thumbnail { width: 160px; aspect-ratio: 16/9; background-size: cover; background-position: center; border-radius: 8px; position: relative; flex-shrink: 0; background-color: #e4e6eb; }
    .duration { position: absolute; bottom: 4px; right: 4px; background: rgba(0,0,0,0.8); color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; }
    .video-info h3 { font-size: 1rem; font-weight: 500; margin: 0 0 0.5rem; }
    .channel { display: block; font-size: 0.875rem; color: #65676b; margin-bottom: 0.25rem; }
    .meta { font-size: 0.8rem; color: #65676b; }
    .remove-btn { width: 32px; height: 32px; border: none; background: transparent; cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .remove-btn:hover { background: #e4e6eb; }
    .remove-btn svg { width: 20px; height: 20px; color: #65676b; }
    .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-state svg { width: 64px; height: 64px; color: #ccc; margin-bottom: 1rem; }
    .empty-state h2 { font-size: 1.25rem; margin: 0 0 0.5rem; }
    .empty-state p { color: #65676b; margin: 0; }
  `]
})
export class WatchHistoryComponent implements OnInit {
  private videoService = inject(VideoService);
  
  history = signal<Video[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.loading.set(true);
    // Mock: use trending videos as history for now
    this.videoService.getTrendingVideos(20).subscribe({
      next: (videos) => {
        this.history.set(videos);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  removeFromHistory(videoId: string) {
    this.history.update(h => h.filter(v => v.id !== videoId));
  }

  clearHistory() {
    this.history.set([]);
  }
}
