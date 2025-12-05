import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketplaceService, Product, Seller, MarketplaceCategory, Auction } from '../../../core/services/commerce/marketplace.service';
import { AuctionService } from '../../../core/services/commerce/auction.service';
import { ProductCardComponent } from '../shared/product-card.component';

@Component({
  selector: 'app-marketplace-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent],
  templateUrl: './marketplace-home.component.html'

})
export class MarketplaceHomeComponent implements OnInit {
  private marketplaceService = inject(MarketplaceService);
  private auctionService = inject(AuctionService);

  featuredProducts = signal<Product[]>([]);
  recentProducts = signal<Product[]>([]);
  endingSoonAuctions = signal<Auction[]>([]);
  topSellers = signal<Seller[]>([]);
  
  loadingFeatured = signal(true);
  loadingRecent = signal(true);
  loadingAuctions = signal(true);
  
  searchQuery = '';

  categories = [
    { id: 'PartsServicing', name: 'Parts & Servicing', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'AccessoriesAutomobilia', name: 'Accessories', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    { id: 'TyresWheels', name: 'Tyres & Wheels', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'CarCareProducts', name: 'Car Care', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { id: 'Tools', name: 'Tools', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
    { id: 'Auctions', name: 'Auctions', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  ngOnInit() {
    this.loadFeatured();
    this.loadRecent();
    this.loadAuctions();
    this.loadTopSellers();
  }

  loadFeatured() {
    this.marketplaceService.getFeaturedProducts(10).subscribe({
      next: (products) => {
        this.featuredProducts.set(products);
        this.loadingFeatured.set(false);
      },
      error: () => this.loadingFeatured.set(false)
    });
  }

  loadRecent() {
    this.marketplaceService.getRecentProducts(10).subscribe({
      next: (products) => {
        this.recentProducts.set(products);
        this.loadingRecent.set(false);
      },
      error: () => this.loadingRecent.set(false)
    });
  }

  loadAuctions() {
    this.auctionService.getEndingSoon(6).subscribe({
      next: (auctions) => {
        this.endingSoonAuctions.set(auctions);
        this.loadingAuctions.set(false);
      },
      error: () => this.loadingAuctions.set(false)
    });
  }

  loadTopSellers() {
    this.marketplaceService.getTopSellers(6).subscribe(sellers => this.topSellers.set(sellers));
  }

  search() {
    if (this.searchQuery.trim()) {
      window.location.href = `/marketplace/search?query=${encodeURIComponent(this.searchQuery)}`;
    }
  }

  onCartAdded(product: Product) {
    // Show toast notification
    console.log('Added to cart:', product.title);
  }

  getTimeRemaining(endTime: string): string {
    const end = new Date(endTime).getTime();
    const now = Date.now();
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }
}
