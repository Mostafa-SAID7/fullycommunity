import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PodcastService, Episode } from '../../../core/services/podcast.service';
import { AuthService } from '../../../core/services/auth.service';
import { PodcastLayoutComponent } from '../shared/podcast-layout/podcast-layout.component';

@Component({
  selector: 'app-episode-player',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PodcastLayoutComponent],
  template: `
    <app-podcast-layout>
      @if (episode) {
        <div class="player-page">
          <div class="player-main">
            <!-- Cover & Info -->
            <div class="episode-info">
              <img [src]="episode.thumbnailUrl || episode.podcastCoverImageUrl" [alt]="episode.title" class="cover" />
              <div class="details">
                <a [routerLink]="['/podcasts/show', episode.podcastId]" class="podcast-link">{{ episode.podcastTitle }}</a>
                <h1>{{ episode.title }}</h1>
                <div class="meta">
                  <span>S{{ episode.seasonNumber || 1 }} E{{ episode.episodeNumber }}</span>
                  <span>{{ episode.publishedAt | date:'mediumDate' }}</span>
                  <span>{{ formatDuration(episode.duration) }}</span>
                </div>
              </div>
            </div>

            <!-- Audio Player -->
            <div class="audio-player">
              <audio #audioPlayer [src]="episode.audioUrl" (timeupdate)="onTimeUpdate()" (loadedmetadata)="onLoaded()"></audio>
              
              <div class="progress-container">
                <input type="range" [value]="progress" (input)="seek($event)" min="0" max="100" class="progress-bar" />
                <div class="time-display">
                  <span>{{ currentTime }}</span>
                  <span>{{ duration }}</span>
                </div>
              </div>

              <div class="controls">
                <button (click)="skipBack()" class="control-btn">
                  <span>-15</span>
                </button>
                <button (click)="togglePlay()" class="play-btn">
                  {{ isPlaying ? '⏸️' : '▶️' }}
                </button>
                <button (click)="skipForward()" class="control-btn">
                  <span>+30</span>
                </button>
                <div class="speed-control">
                  <select [(ngModel)]="playbackSpeed" (change)="setSpeed()">
                    <option [value]="0.5">0.5x</option>
                    <option [value]="0.75">0.75x</option>
                    <option [value]="1">1x</option>
                    <option [value]="1.25">1.25x</option>
                    <option [value]="1.5">1.5x</option>
                    <option [value]="2">2x</option>
                  </select>
                </div>
                <div class="volume-control">
                  <span>🔊</span>
                  <input type="range" [(ngModel)]="volume" (input)="setVolume()" min="0" max="100" />
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="actions">
              <button (click)="react('like')" [class.active]="userReaction === 'like'">❤️ {{ episode.likeCount }}</button>
              <button (click)="addToQueue()">📋 Queue</button>
              <button (click)="save()">🔖 Save</button>
              <button (click)="share()">📤 Share</button>
              <button (click)="download()">⬇️ Download</button>
            </div>

            <!-- Description -->
            <div class="description">
              <h3>About this episode</h3>
              <p>{{ episode.description }}</p>
            </div>

            <!-- Chapters -->
            @if (chapters.length > 0) {
              <div class="chapters">
                <h3>Chapters</h3>
                @for (chapter of chapters; track chapter.id) {
                  <button (click)="seekToChapter(chapter)" class="chapter-item" [class.active]="currentChapter?.id === chapter.id">
                    <span class="chapter-time">{{ formatTime(chapter.startTime) }}</span>
                    <span class="chapter-title">{{ chapter.title }}</span>
                  </button>
                }
              </div>
            }
          </div>

          <!-- Comments -->
          <div class="comments-section">
            <h3>Comments ({{ episode.commentCount }})</h3>
            @if (isLoggedIn) {
              <div class="comment-form">
                <textarea [(ngModel)]="newComment" placeholder="Add a comment..."></textarea>
                <button (click)="postComment()">Post</button>
              </div>
            }
            <div class="comments-list">
              @for (comment of comments; track comment.id) {
                <div class="comment">
                  <img [src]="comment.userAvatarUrl || '/assets/avatar-default.png'" class="avatar" />
                  <div class="comment-content">
                    <div class="comment-header">
                      <span class="username">{{ comment.userName }}</span>
                      @if (comment.timestamp) {
                        <button (click)="seekToTime(comment.timestamp)" class="timestamp">{{ formatTime(comment.timestamp) }}</button>
                      }
                      <span class="date">{{ comment.createdAt | date:'short' }}</span>
                    </div>
                    <p>{{ comment.content }}</p>
                    <div class="comment-actions">
                      <button (click)="likeComment(comment)">❤️ {{ comment.likeCount }}</button>
                      <button (click)="replyTo(comment)">Reply</button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </app-podcast-layout>
  `,
  styles: [`
    .player-page { max-width: 900px; margin: 0 auto; }
    .episode-info { display: flex; gap: 2rem; margin-bottom: 2rem; }
    .cover { width: 200px; height: 200px; border-radius: 12px; object-fit: cover; }
    .details { flex: 1; }
    .podcast-link { color: #6366f1; text-decoration: none; font-size: 0.9rem; }
    .details h1 { font-size: 1.75rem; margin: 0.5rem 0; }
    .meta { display: flex; gap: 1rem; color: #666; font-size: 0.9rem; }

    .audio-player { background: #f8f9fa; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .progress-container { margin-bottom: 1rem; }
    .progress-bar { width: 100%; height: 8px; cursor: pointer; }
    .time-display { display: flex; justify-content: space-between; font-size: 0.85rem; color: #666; margin-top: 0.5rem; }
    .controls { display: flex; align-items: center; justify-content: center; gap: 1rem; }
    .control-btn { width: 48px; height: 48px; border-radius: 50%; border: 1px solid #ddd; background: white; cursor: pointer; }
    .play-btn { width: 64px; height: 64px; border-radius: 50%; border: none; background: #6366f1; color: white; font-size: 1.5rem; cursor: pointer; }
    .speed-control select, .volume-control input { cursor: pointer; }
    .volume-control { display: flex; align-items: center; gap: 0.5rem; }

    .actions { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .actions button { padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; }
    .actions button.active { background: #fef2f2; border-color: #ef4444; }

    .description, .chapters, .comments-section { margin-bottom: 2rem; }
    .description h3, .chapters h3, .comments-section h3 { margin-bottom: 1rem; }
    .description p { color: #444; line-height: 1.6; }

    .chapter-item { display: flex; gap: 1rem; width: 100%; padding: 0.75rem; border: none; background: none; cursor: pointer; text-align: left; border-radius: 8px; }
    .chapter-item:hover, .chapter-item.active { background: #f0f4ff; }
    .chapter-time { color: #6366f1; font-weight: 500; min-width: 60px; }

    .comment-form { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .comment-form textarea { flex: 1; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; resize: none; }
    .comment-form button { padding: 0.75rem 1.5rem; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; }
    .comment { display: flex; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #eee; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; }
    .comment-content { flex: 1; }
    .comment-header { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.25rem; }
    .username { font-weight: 600; }
    .timestamp { color: #6366f1; background: none; border: none; cursor: pointer; font-size: 0.85rem; }
    .date { color: #999; font-size: 0.85rem; }
    .comment-actions { display: flex; gap: 1rem; margin-top: 0.5rem; }
    .comment-actions button { background: none; border: none; color: #666; cursor: pointer; font-size: 0.85rem; }
  `]
})
export class EpisodePlayerComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer') audioRef!: ElementRef<HTMLAudioElement>;

  private route = inject(ActivatedRoute);
  private podcastService = inject(PodcastService);
  private authService = inject(AuthService);

  episode: Episode | null = null;
  chapters: any[] = [];
  comments: any[] = [];
  currentChapter: any = null;

  isLoggedIn = false;
  isPlaying = false;
  progress = 0;
  currentTime = '0:00';
  duration = '0:00';
  playbackSpeed = 1;
  volume = 100;
  userReaction: string | null = null;
  newComment = '';

  private progressInterval: any;

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.route.params.subscribe(params => {
      this.loadEpisode(params['podcastId'], params['episodeId']);
    });
  }

  ngOnDestroy() {
    if (this.progressInterval) clearInterval(this.progressInterval);
    this.saveProgress();
  }

  loadEpisode(podcastId: string, episodeId: string) {
    this.podcastService.getEpisode(podcastId, episodeId).subscribe(ep => {
      this.episode = ep;
      this.podcastService.recordPlay(episodeId).subscribe();
      // Load chapters and comments
    });
  }

  onLoaded() {
    const audio = this.audioRef?.nativeElement;
    if (audio) this.duration = this.formatTime(audio.duration);
  }

  onTimeUpdate() {
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      this.progress = (audio.currentTime / audio.duration) * 100;
      this.currentTime = this.formatTime(audio.currentTime);
    }
  }

  togglePlay() {
    const audio = this.audioRef?.nativeElement;
    if (!audio) return;
    if (this.isPlaying) { audio.pause(); } else { audio.play(); }
    this.isPlaying = !this.isPlaying;
  }

  seek(event: any) {
    const audio = this.audioRef?.nativeElement;
    if (audio) audio.currentTime = (event.target.value / 100) * audio.duration;
  }

  skipBack() {
    const audio = this.audioRef?.nativeElement;
    if (audio) audio.currentTime = Math.max(0, audio.currentTime - 15);
  }

  skipForward() {
    const audio = this.audioRef?.nativeElement;
    if (audio) audio.currentTime = Math.min(audio.duration, audio.currentTime + 30);
  }

  setSpeed() {
    const audio = this.audioRef?.nativeElement;
    if (audio) audio.playbackRate = this.playbackSpeed;
  }

  setVolume() {
    const audio = this.audioRef?.nativeElement;
    if (audio) audio.volume = this.volume / 100;
  }

  seekToChapter(chapter: any) {
    const audio = this.audioRef?.nativeElement;
    if (audio) audio.currentTime = this.parseTime(chapter.startTime);
  }

  seekToTime(time: string) {
    const audio = this.audioRef?.nativeElement;
    if (audio) audio.currentTime = this.parseTime(time);
  }

  saveProgress() {
    if (!this.episode) return;
    const audio = this.audioRef?.nativeElement;
    if (audio) {
      this.podcastService.updateProgress(this.episode.podcastId, this.episode.id, audio.currentTime, this.progress).subscribe();
    }
  }

  react(type: string) { this.userReaction = this.userReaction === type ? null : type; }
  addToQueue() { if (this.episode) this.podcastService.addToQueue(this.episode.id).subscribe(); }
  save() { if (this.episode) this.podcastService.saveEpisode(this.episode.id).subscribe(); }
  share() { navigator.share?.({ title: this.episode?.title, url: window.location.href }); }
  download() { if (this.episode) window.open(this.episode.audioUrl, '_blank'); }
  postComment() { console.log('Post comment:', this.newComment); this.newComment = ''; }
  likeComment(comment: any) { comment.likeCount++; }
  replyTo(comment: any) { this.newComment = `@${comment.userName} `; }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  formatDuration(duration: string): string {
    return duration || '0:00';
  }

  parseTime(time: string): number {
    const parts = time.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
  }
}
