import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoService, Video, VideoCollection } from '../../../core/services/media/video.service';

@Component({
  selector: 'app-video-library',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="library-container">
      <h1 class="page-title">Your Library</h1>
      
      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/></svg>
          <div>
            <span class="stat-value">{{ watchHistory().length }}</span>
            <span class="stat-label">Watch History</span>
          </div>
        </div>
        <div class="stat-card">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
          <div>
            <span class="stat-value">{{ savedVideos().length }}</span>
            <span class="stat-label">Saved Videos</span>
          </div>
        </div>
        <div class="stat-card">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/></svg>
          <div>
            <span class="stat-value">{{ collections().length }}</span>
            <span class="stat-label">Collections</span>
          </div>
        </div>
      </div>

      <!-- Recent History -->
      <section class="library-section">
        <div class="section-header">
          <h2>Watch History</h2>
          <a routerLink="/videos/history" class="see-all">See all</a>
        </div>
        <div class="video-row">
          @for (video of watchHistory().slice(0, 6); track video.id) {
            <a [routerLink]="['/videos/watch', video.id]" class="video-card">
              <div class="thumbnail" [style.background-image]="'url(' + (video.thumbnailUrl || 'assets/video-placeholder.jpg') + ')'">
                <span class="duration">{{ video.duration }}</span>
              </div>
              <div class="video-info">
                <h3>{{ video.title }}</h3>
                <span class="channel">{{ video.channel?.displayName }}</span>
              </div>
            </a>
          }
        </div>
      </section>

      <!-- Saved Videos -->
      <section class="library-section">
        <div class="section-header">
          <h2>Saved Videos</h2>
          <a routerLink="/videos/saved" class="see-all">See all</a>
        </div>
        <div class="video-row">
          @for (video of savedVideos().slice(0, 6); track video.id) {
            <a [routerLink]="['/videos/watch', video.id]" class="video-card">
              <div class="thumbnail" [style.background-image]="'url(' + (video.thumbnailUrl || 'assets/video-placeholder.jpg') + ')'">
                <span class="duration">{{ video.duration }}</span>
              </div>
              <div class="video-info">
                <h3>{{ video.title }}</h3>
                <span class="channel">{{ video.channel?.displayName }}</span>
              </div>
            </a>
          }
        </div>
      </section>

      <!-- Collections -->
      <section class="library-section">
        <div class="section-header">
          <h2>Your Collections</h2>
          <button class="create-btn" (click)="createCollection()">+ New Collection</button>
        </div>
        <div class="collections-grid">
          @for (collection of collections(); track collection.id) {
            <a [routerLink]="['/videos/saved']" [queryParams]="{collection: collection.id}" class="collection-card">
              <div class="collection-thumb" [style.background-image]="collection.thumbnailUrl ? 'url(' + collection.thumbnailUrl + ')' : ''">
                <span class="video-count">{{ collection.videoCount }} videos</span>
              </div>
              <div class="collection-info">
                <h3>{{ collection.name }}</h3>
                <span>{{ collection.isPrivate ? 'Private' : 'Public' }}</span>
              </div>
            </a>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .library-container { padding: 1rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat-card svg { width: 40px; height: 40px; color: #1877f2; }
    .stat-value { display: block; font-size: 1.5rem; font-weight: 700; }
    .stat-label { font-size: 0.875rem; color: #65676b; }
    .library-section { margin-bottom: 2rem; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .section-header h2 { font-size: 1.25rem; font-weight: 600; margin: 0; }
    .see-all { color: #1877f2; text-decoration: none; font-weight: 500; }
    .create-btn { padding: 0.5rem 1rem; background: #1877f2; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
    .video-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .video-card { text-decoration: none; color: inherit; }
    .thumbnail { aspect-ratio: 16/9; background-size: cover; background-position: center; border-radius: 8px; position: relative; background-color: #e4e6eb; }
    .duration { position: absolute; bottom: 4px; right: 4px; background: rgba(0,0,0,0.8); color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; }
    .video-info { padding: 0.5rem 0; }
    .video-info h3 { font-size: 0.9rem; font-weight: 500; margin: 0 0 0.25rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .channel { font-size: 0.8rem; color: #65676b; }
    .collections-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
    .collection-card { text-decoration: none; color: inherit; }
    .collection-thumb { aspect-ratio: 1; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 8px; position: relative; display: flex; align-items: flex-end; padding: 0.5rem; background-size: cover; }
    .video-count { background: rgba(0,0,0,0.7); color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }
    .collection-info { padding: 0.5rem 0; }
    .collection-info h3 { font-size: 0.9rem; font-weight: 500; margin: 0 0 0.25rem; }
    .collection-info span { font-size: 0.8rem; color: #65676b; }
  `]
})
export class VideoLibraryComponent implements OnInit {
  private videoService = inject(VideoService);
  
  watchHistory = signal<Video[]>([]);
  savedVideos = signal<Video[]>([]);
  collections = signal<VideoCollection[]>([]);

  ngOnInit() {
    this.loadLibrary();
  }

  loadLibrary() {
    // Load watch history (mock for now)
    this.videoService.getTrendingVideos(6).subscribe(videos => this.watchHistory.set(videos));
    
    // Load saved videos
    this.videoService.getSavedVideos().subscribe(result => {
      this.savedVideos.set(result.items.map(s => s.video));
    });
    
    // Load collections
    this.videoService.getCollections().subscribe(cols => this.collections.set(cols));
  }

  createCollection() {
    // TODO: Open create collection modal
  }
}
