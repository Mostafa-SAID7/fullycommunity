import { Component, OnInit, OnDestroy, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideoService, Video, VideoComment, ReactionType } from '../../../core/services/media/video.service';
import { ChannelService } from '../../../core/services/media/channel.service';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './video-player.component.html'

})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  
  private route = inject(ActivatedRoute);
  private videoService = inject(VideoService);
  private channelService = inject(ChannelService);

  video = signal<Video | null>(null);
  relatedVideos = signal<Video[]>([]);
  comments = signal<VideoComment[]>([]);
  
  loading = signal(true);
  isSubscribed = signal(false);
  showFullDescription = signal(false);
  hasMoreComments = signal(true);
  
  newComment = '';
  commentPage = 1;
  private viewRecorded = false;
  private watchStartTime = 0;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadVideo(params['id']);
    });
  }

  ngOnDestroy() {
    this.recordWatchProgress();
  }

  loadVideo(id: string) {
    this.loading.set(true);
    this.viewRecorded = false;
    this.watchStartTime = Date.now();
    
    this.videoService.getVideo(id).subscribe({
      next: (video) => {
        this.video.set(video);
        this.loading.set(false);
        this.loadRelatedVideos(id);
        this.loadComments(id);
        this.checkSubscription(video.channelId);
      },
      error: () => this.loading.set(false)
    });
  }

  loadRelatedVideos(videoId: string) {
    this.videoService.getRelatedVideos(videoId, 15).subscribe(videos => this.relatedVideos.set(videos));
  }

  loadComments(videoId: string) {
    this.commentPage = 1;
    this.videoService.getComments(videoId, 1, 20).subscribe(result => {
      this.comments.set(result.items);
      this.hasMoreComments.set(result.page < result.totalPages);
    });
  }

  loadMoreComments() {
    if (!this.video()) return;
    this.commentPage++;
    this.videoService.getComments(this.video()!.id, this.commentPage, 20).subscribe(result => {
      this.comments.update(c => [...c, ...result.items]);
      this.hasMoreComments.set(result.page < result.totalPages);
    });
  }

  checkSubscription(channelId: string) {
    this.channelService.isSubscribed(channelId).subscribe(result => this.isSubscribed.set(result.isSubscribed));
  }

  toggleSubscribe() {
    if (!this.video()) return;
    const channelId = this.video()!.channelId;
    if (this.isSubscribed()) {
      this.channelService.unsubscribe(channelId).subscribe(() => this.isSubscribed.set(false));
    } else {
      this.channelService.subscribe(channelId).subscribe(() => this.isSubscribed.set(true));
    }
  }

  react(type: ReactionType) {
    if (!this.video()) return;
    if (this.video()!.userReaction === type) {
      this.videoService.removeReaction(this.video()!.id).subscribe(() => {
        this.video.update(v => v ? { ...v, userReaction: undefined, likeCount: type === 'Like' ? v.likeCount - 1 : v.likeCount } : null);
      });
    } else {
      this.videoService.react(this.video()!.id, type).subscribe(() => {
        this.video.update(v => v ? { ...v, userReaction: type, likeCount: type === 'Like' ? v.likeCount + 1 : v.likeCount } : null);
      });
    }
  }

  toggleSave() {
    if (!this.video()) return;
    if (this.video()!.isSaved) {
      this.videoService.unsaveVideo(this.video()!.id).subscribe(() => {
        this.video.update(v => v ? { ...v, isSaved: false } : null);
      });
    } else {
      this.videoService.saveVideo(this.video()!.id).subscribe(() => {
        this.video.update(v => v ? { ...v, isSaved: true } : null);
      });
    }
  }

  share() {
    if (!this.video()) return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: this.video()!.title, url });
    } else {
      navigator.clipboard.writeText(url);
    }
    this.videoService.recordShare(this.video()!.id, 'copy').subscribe();
  }

  submitComment() {
    if (!this.video() || !this.newComment.trim()) return;
    this.videoService.createComment({ videoId: this.video()!.id, content: this.newComment }).subscribe(comment => {
      this.comments.update(c => [comment, ...c]);
      this.video.update(v => v ? { ...v, commentCount: v.commentCount + 1 } : null);
      this.newComment = '';
    });
  }

  likeComment(comment: VideoComment) {
    if (comment.isLiked) {
      this.videoService.unlikeComment(comment.id).subscribe(() => {
        this.comments.update(c => c.map(x => x.id === comment.id ? { ...x, isLiked: false, likeCount: x.likeCount - 1 } : x));
      });
    } else {
      this.videoService.likeComment(comment.id).subscribe(() => {
        this.comments.update(c => c.map(x => x.id === comment.id ? { ...x, isLiked: true, likeCount: x.likeCount + 1 } : x));
      });
    }
  }

  onTimeUpdate() {
    if (!this.viewRecorded && this.videoPlayer?.nativeElement) {
      const player = this.videoPlayer.nativeElement;
      if (player.currentTime > 3) {
        this.viewRecorded = true;
        this.videoService.recordView(this.video()!.id).subscribe();
      }
    }
  }

  onVideoEnded() {
    this.recordWatchProgress();
  }

  private recordWatchProgress() {
    if (!this.video() || !this.videoPlayer?.nativeElement) return;
    const player = this.videoPlayer.nativeElement;
    const watchDuration = (Date.now() - this.watchStartTime) / 1000;
    const watchPercent = player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0;
    this.videoService.updateWatchProgress(this.video()!.id, watchDuration, watchPercent).subscribe();
  }

  formatCount(count: number): string {
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
