import { Component, OnInit, inject, signal, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoService, Video, ReactionType } from '../../../core/services/video.service';
import { ChannelService } from '../../../core/services/channel.service';

@Component({
  selector: 'app-video-shorts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="h-screen bg-black overflow-hidden">
      <div #container class="h-full snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
        @for (video of videos(); track video.id; let i = $index) {
          <div class="h-screen snap-start relative flex items-center justify-center">
            <!-- Video -->
            <video #videoEl
              [src]="video.videoUrl"
              [poster]="video.thumbnailUrl"
              class="h-full max-w-full object-contain"
              loop
              playsinline
              [muted]="isMuted()"
              (click)="togglePlay(i)"
              (loadeddata)="onVideoLoaded(i)">
            </video>

            <!-- Overlay Controls -->
            <div class="absolute inset-0 pointer-events-none">
              <!-- Top Bar -->
              <div class="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-auto">
                <div class="flex items-center justify-between">
                  <a routerLink="/videos" class="text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                  </a>
                  <span class="text-white font-semibold">Shorts</span>
                  <button (click)="toggleMute()" class="text-white">
                    @if (isMuted()) {
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
                      </svg>
                    } @else {
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                      </svg>
                    }
                  </button>
                </div>
              </div>

              <!-- Right Side Actions -->
              <div class="absolute right-4 bottom-24 flex flex-col items-center gap-6 pointer-events-auto">
                <!-- Like -->
                <button (click)="react(video, 'Like')" class="flex flex-col items-center">
                  <div [class]="video.userReaction === 'Like' ? 'text-red-500' : 'text-white'" class="p-2 rounded-full bg-gray-800/50">
                    <svg class="w-7 h-7" [attr.fill]="video.userReaction === 'Like' ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </div>
                  <span class="text-white text-xs mt-1">{{ formatCount(video.likeCount) }}</span>
                </button>

                <!-- Comment -->
                <button (click)="openComments(video)" class="flex flex-col items-center">
                  <div class="p-2 rounded-full bg-gray-800/50 text-white">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                  <span class="text-white text-xs mt-1">{{ formatCount(video.commentCount) }}</span>
                </button>

                <!-- Share -->
                <button (click)="share(video)" class="flex flex-col items-center">
                  <div class="p-2 rounded-full bg-gray-800/50 text-white">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                    </svg>
                  </div>
                  <span class="text-white text-xs mt-1">Share</span>
                </button>

                <!-- Save -->
                <button (click)="toggleSave(video)" class="flex flex-col items-center">
                  <div [class]="video.isSaved ? 'text-yellow-500' : 'text-white'" class="p-2 rounded-full bg-gray-800/50">
                    <svg class="w-7 h-7" [attr.fill]="video.isSaved ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                    </svg>
                  </div>
                  <span class="text-white text-xs mt-1">Save</span>
                </button>

                <!-- Channel Avatar -->
                <a [routerLink]="['/videos/channel', video.channel.handle]" class="relative">
                  <img [src]="video.channel.avatarUrl || 'assets/default-avatar.png'" 
                    class="w-12 h-12 rounded-full border-2 border-white object-cover">
                  <button (click)="subscribe(video, $event)" 
                    class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </button>
                </a>
              </div>

              <!-- Bottom Info -->
              <div class="absolute left-4 right-20 bottom-8 pointer-events-auto">
                <a [routerLink]="['/videos/channel', video.channel.handle]" class="flex items-center gap-2 mb-2">
                  <span class="text-white font-semibold">&#64;{{ video.channel.handle }}</span>
                  @if (video.channel.isVerified) {
                    <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  }
                </a>
                <p class="text-white text-sm line-clamp-2">{{ video.title }}</p>
                @if (video.hashtags.length) {
                  <div class="flex flex-wrap gap-1 mt-2">
                    @for (tag of video.hashtags.slice(0, 3); track tag) {
                      <span class="text-white/80 text-sm">#{{ tag }}</span>
                    }
                  </div>
                }
                
                <!-- Sound -->
                @if (video.sound) {
                  <div class="flex items-center gap-2 mt-3">
                    <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center animate-spin-slow">
                      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                      </svg>
                    </div>
                    <span class="text-white text-sm truncate">{{ video.sound.title }} - {{ video.sound.artistName }}</span>
                  </div>
                }
              </div>

              <!-- Play/Pause Indicator -->
              @if (showPlayIndicator() && currentIndex() === i) {
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center">
                    @if (isPlaying()) {
                      <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                    } @else {
                      <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                      </svg>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    .animate-spin-slow { animation: spin 3s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `]
})
export class VideoShortsComponent implements OnInit {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  
  private videoService = inject(VideoService);
  private channelService = inject(ChannelService);

  videos = signal<Video[]>([]);
  currentIndex = signal(0);
  isPlaying = signal(true);
  isMuted = signal(false);
  showPlayIndicator = signal(false);
  loading = signal(true);

  private videoElements: HTMLVideoElement[] = [];
  private page = 1;

  ngOnInit() {
    this.loadShorts();
  }

  loadShorts() {
    this.videoService.searchVideos({ type: 'Short', page: this.page, pageSize: 10 }).subscribe({
      next: (result) => {
        this.videos.set(result.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onVideoLoaded(index: number) {
    const videos = document.querySelectorAll('video');
    this.videoElements = Array.from(videos);
    if (index === 0) {
      this.playVideo(0);
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll() {
    if (!this.container?.nativeElement) return;
    const scrollTop = this.container.nativeElement.scrollTop;
    const height = window.innerHeight;
    const newIndex = Math.round(scrollTop / height);
    
    if (newIndex !== this.currentIndex()) {
      this.pauseVideo(this.currentIndex());
      this.currentIndex.set(newIndex);
      this.playVideo(newIndex);
      this.recordView(this.videos()[newIndex]);
    }
  }

  togglePlay(index: number) {
    if (this.videoElements[index]) {
      if (this.videoElements[index].paused) {
        this.videoElements[index].play();
        this.isPlaying.set(true);
      } else {
        this.videoElements[index].pause();
        this.isPlaying.set(false);
      }
      this.showPlayIndicator.set(true);
      setTimeout(() => this.showPlayIndicator.set(false), 500);
    }
  }

  toggleMute() {
    this.isMuted.update(m => !m);
  }

  private playVideo(index: number) {
    if (this.videoElements[index]) {
      this.videoElements[index].currentTime = 0;
      this.videoElements[index].play();
      this.isPlaying.set(true);
    }
  }

  private pauseVideo(index: number) {
    if (this.videoElements[index]) {
      this.videoElements[index].pause();
    }
  }

  private recordView(video: Video) {
    this.videoService.recordView(video.id).subscribe();
  }

  react(video: Video, type: ReactionType) {
    if (video.userReaction === type) {
      this.videoService.removeReaction(video.id).subscribe(() => {
        this.videos.update(v => v.map(x => x.id === video.id ? { ...x, userReaction: undefined, likeCount: x.likeCount - 1 } : x));
      });
    } else {
      this.videoService.react(video.id, type).subscribe(() => {
        this.videos.update(v => v.map(x => x.id === video.id ? { ...x, userReaction: type, likeCount: x.likeCount + 1 } : x));
      });
    }
  }

  toggleSave(video: Video) {
    if (video.isSaved) {
      this.videoService.unsaveVideo(video.id).subscribe(() => {
        this.videos.update(v => v.map(x => x.id === video.id ? { ...x, isSaved: false } : x));
      });
    } else {
      this.videoService.saveVideo(video.id).subscribe(() => {
        this.videos.update(v => v.map(x => x.id === video.id ? { ...x, isSaved: true } : x));
      });
    }
  }

  share(video: Video) {
    const url = `${window.location.origin}/videos/watch/${video.id}`;
    if (navigator.share) {
      navigator.share({ title: video.title, url });
    } else {
      navigator.clipboard.writeText(url);
    }
    this.videoService.recordShare(video.id, 'copy').subscribe();
  }

  subscribe(video: Video, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.channelService.subscribe(video.channelId).subscribe();
  }

  openComments(video: Video) {
    // Could open a bottom sheet with comments
    console.log('Open comments for', video.id);
  }

  formatCount(count: number): string {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  }
}
