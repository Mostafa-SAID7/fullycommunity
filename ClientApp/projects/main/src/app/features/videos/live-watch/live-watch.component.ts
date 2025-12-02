import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LiveStreamService } from '../../../core/services/livestream.service';
import { ChannelService } from '../../../core/services/channel.service';
import { LiveStream, ChatMessage, GiftType } from '../../../core/services/video.service';

@Component({
  selector: 'app-live-watch',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="h-screen bg-gray-900 flex">
      @if (loading()) {
        <div class="flex-1 flex items-center justify-center">
          <div class="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"></div>
        </div>
      } @else if (stream()) {
        <!-- Video Section -->
        <div class="flex-1 flex flex-col">
          <!-- Video Player -->
          <div class="flex-1 relative bg-black">
            @if (stream()!.streamUrl) {
              <video [src]="stream()!.streamUrl" class="w-full h-full object-contain" autoplay controls></video>
            } @else {
              <div class="absolute inset-0 flex items-center justify-center">
                <img [src]="stream()!.thumbnailUrl || 'assets/live-placeholder.png'" class="w-full h-full object-cover opacity-50">
                <div class="absolute text-center">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600 flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <p class="text-white text-lg">Stream starting soon...</p>
                </div>
              </div>
            }
            
            <!-- Live Badge & Viewers -->
            <div class="absolute top-4 left-4 flex items-center gap-3">
              <div class="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded flex items-center gap-2">
                <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                LIVE
              </div>
              <div class="px-3 py-1 bg-black/70 text-white text-sm rounded flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                </svg>
                {{ formatCount(viewerCount()) }} watching
              </div>
            </div>
          </div>

          <!-- Stream Info -->
          <div class="p-4 bg-gray-800">
            <h1 class="text-xl font-bold text-white">{{ stream()!.title }}</h1>
            <div class="flex items-center justify-between mt-3">
              <a [routerLink]="['/videos/channel', stream()!.channel.handle]" class="flex items-center gap-3">
                <img [src]="stream()!.channel.avatarUrl || 'assets/default-avatar.png'" 
                  class="w-10 h-10 rounded-full object-cover">
                <div>
                  <div class="flex items-center gap-1">
                    <span class="font-medium text-white">{{ stream()!.channel.displayName }}</span>
                    @if (stream()!.channel.isVerified) {
                      <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                    }
                  </div>
                  <span class="text-sm text-gray-400">{{ formatCount(stream()!.channel.subscriberCount) }} subscribers</span>
                </div>
              </a>
              
              <div class="flex items-center gap-3">
                <button (click)="toggleSubscribe()" 
                  [class]="isSubscribed() 
                    ? 'px-4 py-2 bg-gray-700 text-gray-300 rounded-full font-medium hover:bg-gray-600' 
                    : 'px-4 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700'">
                  {{ isSubscribed() ? 'Subscribed' : 'Subscribe' }}
                </button>
                <button (click)="share()" class="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Section -->
        <div class="w-96 flex flex-col bg-gray-800 border-l border-gray-700">
          <!-- Chat Header -->
          <div class="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 class="font-semibold text-white">Live Chat</h3>
            <button (click)="showGifts.set(!showGifts())" class="text-gray-400 hover:text-white">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clip-rule="evenodd"/>
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z"/>
              </svg>
            </button>
          </div>

          <!-- Gift Panel -->
          @if (showGifts()) {
            <div class="p-4 border-b border-gray-700 bg-gray-750">
              <h4 class="text-sm font-medium text-gray-300 mb-3">Send a Gift</h4>
              <div class="grid grid-cols-4 gap-2">
                @for (gift of giftTypes(); track gift.id) {
                  <button (click)="sendGift(gift)" 
                    class="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex flex-col items-center">
                    <img [src]="gift.iconUrl" [alt]="gift.name" class="w-8 h-8">
                    <span class="text-xs text-gray-300 mt-1">{{ gift.coinCost }}</span>
                  </button>
                }
              </div>
            </div>
          }

          <!-- Chat Messages -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            @for (msg of chatMessages(); track msg.id) {
              <div class="flex gap-2" [class.bg-yellow-500/10]="msg.type === 'Gift'" [class.p-2]="msg.type === 'Gift'" [class.rounded-lg]="msg.type === 'Gift'">
                <img [src]="msg.userAvatar || 'assets/default-avatar.png'" class="w-6 h-6 rounded-full flex-shrink-0">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium" [class]="msg.type === 'Gift' ? 'text-yellow-400' : 'text-blue-400'">
                      {{ msg.userName }}
                    </span>
                    @if (msg.type === 'Gift') {
                      <span class="text-xs text-yellow-400">sent a gift!</span>
                    }
                  </div>
                  <p class="text-sm text-gray-300 break-words">{{ msg.content }}</p>
                </div>
              </div>
            }
          </div>

          <!-- Chat Input -->
          @if (stream()!.chatEnabled) {
            <div class="p-4 border-t border-gray-700">
              <div class="flex gap-2">
                <input type="text" [(ngModel)]="newMessage" (keyup.enter)="sendMessage()"
                  placeholder="Send a message..."
                  class="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <button (click)="sendMessage()" [disabled]="!newMessage.trim()"
                  class="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                </button>
              </div>
            </div>
          } @else {
            <div class="p-4 border-t border-gray-700 text-center text-gray-400 text-sm">
              Chat is disabled for this stream
            </div>
          }
        </div>
      }
    </div>
  `
})
export class LiveWatchComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private liveStreamService = inject(LiveStreamService);
  private channelService = inject(ChannelService);

  stream = signal<LiveStream | null>(null);
  chatMessages = signal<ChatMessage[]>([]);
  giftTypes = signal<GiftType[]>([]);
  viewerCount = signal(0);
  
  loading = signal(true);
  isSubscribed = signal(false);
  showGifts = signal(false);
  newMessage = '';

  private pollInterval?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadStream(params['id']);
    });
    this.loadGiftTypes();
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    if (this.stream()) {
      this.liveStreamService.leaveStream(this.stream()!.id).subscribe();
    }
  }

  loadStream(id: string) {
    this.loading.set(true);
    this.liveStreamService.getLiveStream(id).subscribe({
      next: (stream) => {
        this.stream.set(stream);
        this.viewerCount.set(stream.viewerCount);
        this.loading.set(false);
        this.joinStream(id);
        this.loadChat(id);
        this.startPolling(id);
        this.checkSubscription(stream.channelId);
      },
      error: () => this.loading.set(false)
    });
  }

  joinStream(id: string) {
    this.liveStreamService.joinStream(id).subscribe();
  }

  loadChat(streamId: string) {
    this.liveStreamService.getChatMessages(streamId, 1, 50).subscribe(result => {
      this.chatMessages.set(result.items.reverse());
    });
  }

  loadGiftTypes() {
    this.liveStreamService.getGiftTypes().subscribe(gifts => this.giftTypes.set(gifts));
  }

  checkSubscription(channelId: string) {
    this.channelService.isSubscribed(channelId).subscribe(result => this.isSubscribed.set(result.isSubscribed));
  }

  startPolling(streamId: string) {
    this.pollInterval = setInterval(() => {
      this.liveStreamService.getViewerCount(streamId).subscribe(result => this.viewerCount.set(result.viewerCount));
      this.loadChat(streamId);
    }, 5000);
  }

  toggleSubscribe() {
    if (!this.stream()) return;
    const channelId = this.stream()!.channelId;
    if (this.isSubscribed()) {
      this.channelService.unsubscribe(channelId).subscribe(() => this.isSubscribed.set(false));
    } else {
      this.channelService.subscribe(channelId).subscribe(() => this.isSubscribed.set(true));
    }
  }

  sendMessage() {
    if (!this.stream() || !this.newMessage.trim()) return;
    this.liveStreamService.sendChatMessage(this.stream()!.id, { content: this.newMessage }).subscribe(msg => {
      this.chatMessages.update(m => [...m, msg]);
      this.newMessage = '';
    });
  }

  sendGift(gift: GiftType) {
    if (!this.stream()) return;
    this.liveStreamService.sendGift(this.stream()!.id, { giftTypeId: gift.id }).subscribe(() => {
      this.showGifts.set(false);
    });
  }

  share() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: this.stream()!.title, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  }

  formatCount(count: number): string {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  }
}
