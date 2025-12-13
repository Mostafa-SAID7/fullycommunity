import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuctionService } from '../../../core/services/commerce/auction.service';
import { Auction, Bid } from '../../../core/services/commerce/marketplace.service';

@Component({
  selector: 'app-auction-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      @if (loading()) {
        <div class="max-w-6xl mx-auto px-4 py-8">
          <div class="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div class="space-y-4">
              <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      } @else if (auction()) {
        <div class="max-w-6xl mx-auto px-4 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Image -->
            <div class="aspect-square bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
              <img [src]="auction()!.product.images.length > 0 ? auction()!.product.images[0].url : 'assets/product-placeholder.png'" 
                class="w-full h-full object-contain">
            </div>

            <!-- Info -->
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="px-3 py-1 rounded-full text-sm font-medium"
                  [class]="auction()!.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'">
                  {{ auction()!.status }}
                </span>
                @if (auction()!.status === 'Active') {
                  <span class="text-red-500 font-medium">{{ timeRemaining() }}</span>
                }
              </div>

              <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ auction()!.product.title }}</h1>

              <!-- Current Bid -->
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Current Bid</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">
                      USD {{ auction()!.currentBid || auction()!.startingPrice | number:'1.2-2' }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ auction()!.bidCount }} bids</p>
                  </div>
                  @if (auction()!.buyItNowPrice) {
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Buy It Now</p>
                      <p class="text-2xl font-bold text-blue-600">USD {{ auction()!.buyItNowPrice | number:'1.2-2' }}</p>
                    </div>
                  }
                </div>

                @if (auction()!.hasReserve) {
                  <p class="mt-2 text-sm" [class]="auction()!.reserveMet ? 'text-green-600' : 'text-orange-600'">
                    {{ auction()!.reserveMet ? 'Reserve met' : 'Reserve not met' }}
                  </p>
                }
              </div>

              <!-- Place Bid -->
              @if (auction()!.status === 'Active') {
                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-4">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Place Your Bid</h3>
                  <div class="flex gap-3">
                    <div class="flex-1">
                      <input type="number" [(ngModel)]="bidAmount" [min]="getMinBid()" step="0.01"
                        placeholder="Enter bid amount"
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum bid: USD {{ getMinBid() | number:'1.2-2' }}</p>
                    </div>
                    <button (click)="placeBid()" [disabled]="!bidAmount || bidAmount < getMinBid() || bidding()"
                      class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                      {{ bidding() ? 'Placing...' : 'Place Bid' }}
                    </button>
                  </div>

                  @if (auction()!.buyItNowPrice) {
                    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button (click)="buyNow()" class="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
                        Buy It Now - USD {{ auction()!.buyItNowPrice | number:'1.2-2' }}
                      </button>
                    </div>
                  }
                </div>
              }

              <!-- Seller -->
              <a [routerLink]="['/marketplace/seller', auction()!.seller.slug || auction()!.seller.id]" 
                class="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <img [src]="auction()!.seller.logoUrl || 'assets/store-placeholder.png'" class="w-12 h-12 rounded-full object-cover">
                <div class="flex-1">
                  <p class="font-medium text-gray-900 dark:text-white">{{ auction()!.seller.storeName }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ auction()!.seller.rating.toFixed(1) }} ★</p>
                </div>
              </a>
            </div>
          </div>

          <!-- Bid History -->
          <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6">
            <h2 class="font-semibold text-gray-900 dark:text-white mb-4">Bid History</h2>
            @if (bids().length) {
              <div class="space-y-3">
                @for (bid of bids(); track bid.id; let i = $index) {
                  <div class="flex items-center justify-between py-2" [class.border-b]="i < bids().length - 1" [class.border-gray-200]="i < bids().length - 1">
                    <div class="flex items-center gap-3">
                      <span class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm">
                        {{ i + 1 }}
                      </span>
                      <span class="text-gray-900 dark:text-white">{{ bid.bidderName }}</span>
                    </div>
                    <div class="text-right">
                      <p class="font-medium text-gray-900 dark:text-white">USD {{ bid.amount | number:'1.2-2' }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ bid.createdAt | date:'short' }}</p>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="text-gray-500 dark:text-gray-400 text-center py-4">No bids yet. Be the first to bid!</p>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class AuctionDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private auctionService = inject(AuctionService);

  auction = signal<Auction | null>(null);
  bids = signal<Bid[]>([]);
  timeRemaining = signal('');
  loading = signal(true);
  bidding = signal(false);
  bidAmount: number | null = null;

  private timerInterval?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadAuction(params['id']);
    });
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  loadAuction(id: string) {
    this.auctionService.getAuction(id).subscribe({
      next: (auction) => {
        this.auction.set(auction);
        this.loading.set(false);
        this.loadBids(id);
        this.startTimer();
      },
      error: () => this.loading.set(false)
    });
  }

  loadBids(auctionId: string) {
    this.auctionService.getBids(auctionId).subscribe(bids => this.bids.set(bids));
  }

  startTimer() {
    this.updateTimeRemaining();
    this.timerInterval = setInterval(() => this.updateTimeRemaining(), 1000);
  }

  updateTimeRemaining() {
    if (!this.auction()) return;
    const end = new Date(this.auction()!.endTime).getTime();
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) {
      this.timeRemaining.set('Ended');
      if (this.timerInterval) clearInterval(this.timerInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) {
      this.timeRemaining.set(`${days}d ${hours}h ${minutes}m`);
    } else if (hours > 0) {
      this.timeRemaining.set(`${hours}h ${minutes}m ${seconds}s`);
    } else {
      this.timeRemaining.set(`${minutes}m ${seconds}s`);
    }
  }

  getMinBid(): number {
    const current = this.auction()?.currentBid || this.auction()?.startingPrice || 0;
    return current + 1;
  }

  placeBid() {
    if (!this.auction() || !this.bidAmount || this.bidAmount < this.getMinBid()) return;

    this.bidding.set(true);
    this.auctionService.placeBid(this.auction()!.id, { amount: this.bidAmount }).subscribe({
      next: (bid) => {
        this.bids.update(b => [bid, ...b]);
        this.auction.update(a => a ? { ...a, currentBid: bid.amount, bidCount: a.bidCount + 1 } : null);
        this.bidAmount = null;
        this.bidding.set(false);
      },
      error: () => this.bidding.set(false)
    });
  }

  buyNow() {
    if (!this.auction()) return;
    this.auctionService.buyItNow(this.auction()!.id).subscribe(order => {
      window.location.href = `/marketplace/order/${order.id}`;
    });
  }
}
