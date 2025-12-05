import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PodcastService, Episode, EpisodeChapter, EpisodeComment } from '../../../core/services/media/podcast.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PodcastLayoutComponent } from '../podcast-layout/podcast-layout.component';

@Component({
  selector: 'app-episode-player',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PodcastLayoutComponent],
  templateUrl: './episode-player.component.html'
})
export class EpisodePlayerComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer') audioRef!: ElementRef<HTMLAudioElement>;
  
  private route = inject(ActivatedRoute);
  private podcastService = inject(PodcastService);
  private authService = inject(AuthService);

  episode: Episode | null = null;
  chapters: EpisodeChapter[] = [];
  comments: EpisodeComment[] = [];
  currentChapter: EpisodeChapter | null = null;

  loading = true;
  isLoggedIn = false;
  isPlaying = false;
  isSaved = false;
  progress = 0;
  currentTime = '0:00';
  duration = '0:00';
  playbackSpeed = 1;
  volume = 100;
  userReaction: string | null = null;
  newComment = '';
  includeTimestamp = false;

  private progressInterval: any;
  private podcastId = '';
  private episodeId = '';

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.route.params.subscribe(params => {
      this.podcastId = params['podcastId'];
      this.episodeId = params['episodeId'];
      this.loadEpisode();
    });
  }

  ngOnDestroy() {
    if (this.progressInterval) clearInterval(this.progressInterval);
    this.saveProgress();
  }

  loadEpisode() {
    this.loading = true;
    this.podcastService.getEpisode(this.podcastId, this.episodeId).subscribe({
      next: ep => {
        this.episode = ep;
        this.chapters = ep.chapters || [];
        this.podcastService.recordPlay(this.episodeId).subscribe();
        this.loadComments();
        this.loading = false;
      },
      error: () => { this.episode = null; this.loading = false; }
    });
  }

  loadComments() {
    this.podcastService.getComments(this.episodeId, 1, 50).subscribe({
      next: result => this.comments = result.items,
      error: () => {}
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
      this.updateCurrentChapter(audio.currentTime);
    }
  }

  onEnded() {
    this.isPlaying = false;
    this.saveProgress();
  }

  updateCurrentChapter(time: number) {
    for (let i = this.chapters.length - 1; i >= 0; i--) {
      const chapterTime = this.parseTime(this.chapters[i].startTime);
      if (time >= chapterTime) {
        this.currentChapter = this.chapters[i];
        return;
      }
    }
    this.currentChapter = null;
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

  seekToChapter(chapter: EpisodeChapter) {
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
    if (audio && audio.currentTime > 0) {
      this.podcastService.updateProgress(this.podcastId, this.episodeId, audio.currentTime, this.progress).subscribe();
    }
  }

  react(type: string) {
    if (this.userReaction === type) {
      this.podcastService.removeReaction(this.episodeId).subscribe(() => this.userReaction = null);
    } else {
      this.podcastService.reactToEpisode(this.episodeId, type).subscribe(() => this.userReaction = type);
    }
  }

  addToQueue() {
    this.podcastService.addToQueue(this.episodeId).subscribe();
  }

  save() {
    if (this.isSaved) {
      this.podcastService.unsaveEpisode(this.episodeId).subscribe(() => this.isSaved = false);
    } else {
      this.podcastService.saveEpisode(this.episodeId).subscribe(() => this.isSaved = true);
    }
  }

  share() {
    if (navigator.share) {
      navigator.share({ title: this.episode?.title, url: window.location.href });
    }
  }

  download() {
    if (this.episode) window.open(this.episode.audioUrl, '_blank');
  }

  postComment() {
    if (!this.newComment.trim()) return;
    const timestamp = this.includeTimestamp ? this.currentTime : undefined;
    this.podcastService.addComment(this.episodeId, this.newComment, timestamp).subscribe({
      next: comment => {
        this.comments.unshift(comment);
        this.newComment = '';
        this.includeTimestamp = false;
      }
    });
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + secs.toString().padStart(2, '0');
  }

  formatDuration(duration: string): string {
    return this.podcastService.formatDuration(duration);
  }

  formatChapterTime(time: string): string {
    return time || '0:00';
  }

  parseTime(time: string): number {
    if (!time) return 0;
    const parts = time.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
  }
}
