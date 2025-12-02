import { Component, OnInit, OnDestroy, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideoService, Video, VideoComment, ReactionType } from '../../../core/services/video.service';
import { ChannelService } from '../../../core/services/channel.service';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div class="max-w-[1800px] mx-auto px-4 py-4">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Main Video Section -->
          <div class="flex-1">
            @if (loading()) {
              <div class="aspect-video bg-gray-800 rounded-xl animate-pulse"></div>
            } @else if (video()) {
              <!-- Video Player -->
              <div class="relative bg-black rounded-xl overflow-hidden">
                <video #videoPlayer
                  [src]="video()!.videoUrl"
                  [poster]="video()!.thumbnailUrl"
                  class="w-full aspect-video"
                  controls
                  autoplay
                  (timeupdate)="onTimeUpdate()"
                  (ended)="onVideoEnded()">
                </video>
              </div>

              <!-- Video Info -->
              <div class="mt-4">
                <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ video()!.title }}</h1>
                
                <div class="flex flex-wrap items-center justify-between gap-4 mt-3">
                  <!-- Channel Info -->
                  <div class="flex items-center gap-4">
                    <a [routerLink]="['/videos/channel', video()!.channel.handle]" class="flex items-center gap-3">
                      <img [src]="video()!.channel.avatarUrl || 'assets/default-avatar.png'" 
                        class="w-10 h-10 rounded-full object-cover">
                      <div>
                        <div class="flex items-center gap-1">
                          <span class="font-medium text-gray-900 dark:text-white">{{ video()!.channel.displayName }}</span>
                          @if (video()!.channel.isVerified) {
                            <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            </svg>
                          }
                        </div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatCount(video()!.channel.subscriberCount) }} subscribers</span>
                      </div>
                    </a>
                    
                    <button (click)="toggleSubscribe()" 
                      [class]="isSubscribed() 
                        ? 'px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600' 
                        : 'px-4 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700'">
                      {{ isSubscribed() ? 'Subscribed' : 'Subscribe' }}
                    </button>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center gap-2">
                    <!-- Like/Dislike -->
                    <div class="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full">
                      <button (click)="react('Like')" 
                        [class]="video()!.userReaction === 'Like' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'"
                        class="flex items-center gap-2 px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-l-full">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                        </svg>
                        {{ formatCount(video()!.likeCount) }}
                      </button>
                      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                      <button (click)="react('Sad')" 
                        [class]="video()!.userReaction === 'Sad' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'"
                        class="px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-r-full">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"/>
                        </svg>
                      </button>
                    </div>

                    <!-- Share -->
                    <button (click)="share()" class="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                      </svg>
                      Share
                    </button>

                    <!-- Save -->
                    <button (click)="toggleSave()" 
                      [class]="video()!.isSaved ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'"
                      class="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                      <svg class="w-5 h-5" [attr.fill]="video()!.isSaved ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                      </svg>
                      Save
                    </button>

                    <!-- More -->
                    <button class="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Description -->
                <div class="mt-4 p-4 bg-gray-200 dark:bg-gray-800 rounded-xl">
                  <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span>{{ formatCount(video()!.viewCount) }} views</span>
                    <span>·</span>
                    <span>{{ formatDate(video()!.publishedAt || video()!.createdAt) }}</span>
                  </div>
                  <p class="text-gray-900 dark:text-white whitespace-pre-wrap" [class.line-clamp-3]="!showFullDescription()">
                    {{ video()!.description }}
                  </p>
                  @if (video()!.description && video()!.description!.length > 200) {
                    <button (click)="showFullDescription.set(!showFullDescription())" class="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                      {{ showFullDescription() ? 'Show less' : 'Show more' }}
                    </button>
                  }
                  
                  <!-- Hashtags -->
                  @if (video()!.hashtags.length) {
                    <div class="flex flex-wrap gap-2 mt-3">
                      @for (tag of video()!.hashtags; track tag) {
                        <a [routerLink]="['/videos']" [queryParams]="{hashtag: tag}" class="text-blue-600 dark:text-blue-400 hover:underline">
                          #{{ tag }}
                        </a>
                      }
                    </div>
                  }
                </div>

                <!-- Comments Section -->
                <div class="mt-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {{ formatCount(video()!.commentCount) }} Comments
                  </h3>
                  
                  <!-- Add Comment -->
                  <div class="flex gap-3 mb-6">
                    <img src="assets/default-avatar.png" class="w-10 h-10 rounded-full">
                    <div class="flex-1">
                      <input type="text" [(ngModel)]="newComment" placeholder="Add a comment..."
                        class="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-0 focus:border-blue-500">
                      @if (newComment) {
                        <div class="flex justify-end gap-2 mt-2">
                          <button (click)="newComment = ''" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                            Cancel
                          </button>
                          <button (click)="submitComment()" class="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                            Comment
                          </button>
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Comments List -->
                  <div class="space-y-4">
                    @for (comment of comments(); track comment.id) {
                      <div class="flex gap-3">
                        <img [src]="comment.userAvatar || 'assets/default-avatar.png'" class="w-10 h-10 rounded-full">
                        <div class="flex-1">
                          <div class="flex items-center gap-2">
                            <span class="font-medium text-gray-900 dark:text-white">{{ comment.userName }}</span>
                            @if (comment.isCreatorReply) {
                              <span class="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">Creator</span>
                            }
                            <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(comment.createdAt) }}</span>
                          </div>
                          <p class="text-gray-900 dark:text-white mt-1">{{ comment.content }}</p>
                          <div class="flex items-center gap-4 mt-2">
                            <button (click)="likeComment(comment)" 
                              [class]="comment.isLiked ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'"
                              class="flex items-center gap-1 text-sm hover:text-gray-700 dark:hover:text-gray-300">
                              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                              </svg>
                              {{ comment.likeCount }}
                            </button>
                            <button class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                  </div>

                  @if (hasMoreComments()) {
                    <button (click)="loadMoreComments()" class="mt-4 text-blue-600 dark:text-blue-400 font-medium">
                      Load more comments
                    </button>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Sidebar - Related Videos -->
          <div class="lg:w-96">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Related Videos</h3>
            <div class="space-y-3">
              @for (related of relatedVideos(); track related.id) {
                <a [routerLink]="['/videos/watch', related.id]" class="flex gap-2 group">
                  <div class="relative w-40 flex-shrink-0">
                    <img [src]="related.thumbnailUrl || 'assets/video-placeholder.png'" 
                      class="w-full aspect-video rounded-lg object-cover">
                    <div class="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 text-white text-xs rounded">
                      {{ formatDuration(related.duration) }}
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600">
                      {{ related.title }}
                    </h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ related.channel.displayName }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatCount(related.viewCount) }} views</p>
                  </div>
                </a>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
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
