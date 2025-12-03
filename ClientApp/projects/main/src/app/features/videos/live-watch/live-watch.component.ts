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
  templateUrl: './live-watch.component.html',
  styleUrls: ['./live-watch.component.scss']
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
    const s = this.stream();
    if (s) {
      this.liveStreamService.leaveStream(s.id).subscribe();
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
    const s = this.stream();
    if (!s) return;
    const channelId = s.channelId;
    if (this.isSubscribed()) {
      this.channelService.unsubscribe(channelId).subscribe(() => this.isSubscribed.set(false));
    } else {
      this.channelService.subscribe(channelId).subscribe(() => this.isSubscribed.set(true));
    }
  }

  sendMessage() {
    const s = this.stream();
    if (!s || !this.newMessage.trim()) return;
    this.liveStreamService.sendChatMessage(s.id, { content: this.newMessage }).subscribe(msg => {
      this.chatMessages.update(m => [...m, msg]);
      this.newMessage = '';
    });
  }

  sendGift(gift: GiftType) {
    const s = this.stream();
    if (!s) return;
    this.liveStreamService.sendGift(s.id, { giftTypeId: gift.id }).subscribe(() => {
      this.showGifts.set(false);
    });
  }

  share() {
    const s = this.stream();
    if (!s) return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: s.title, url });
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
