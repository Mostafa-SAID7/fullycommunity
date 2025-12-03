import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarketplaceService, Product } from '../../../core/services/marketplace.service';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="listings-container">
      <div class="header">
        <h1>Your Listings</h1>
        <a routerLink="/marketplace/sell/new" class="btn-primary">+ New Listing</a>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat">
          <span class="value">{{ activeCount() }}</span>
          <span class="label">Active</span>
        </div>
        <div class="stat">
          <span class="value">{{ soldCount() }}</span>
          <span class="label">Sold</span>
        </div>
        <div class="stat">
          <span class="value">{{ draftCount() }}</span>
          <span class="label">Drafts</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button [class.active]="activeTab() === 'active'" (click)="setTab('active')">Active</button>
        <button [class.active]="activeTab() === 'sold'" (click)="setTab('sold')">Sold</button>
        <button [class.active]="activeTab() === 'draft'" (click)="setTab('draft')">Drafts</button>
      </div>

      <!-- Listings -->
      @if (loading()) {
        <div class="loading">Loading...</div>
      } @else {
        <div class="listings-grid">
          @for (product of filteredListings(); track product.id) {
            <div class="listing-card">
              <div class="listing-image" [style.background-image]="product.images?.length ? 'url(' + product.images[0].url + ')' : ''"></div>
              <div class="listing-info">
                <h3>{{ product.title }}</h3>
                <p class="price">\${{ product.price | number:'1.2-2' }}</p>
                <p class="meta">{{ product.viewCount }} views · {{ product.favoriteCount }} saves</p>
              </div>
              <div class="listing-actions">
                <a [routerLink]="['/marketplace/sell/edit', product.id]" class="btn-edit">Edit</a>
                <button class="btn-delete" (click)="deleteListing(product.id)">Delete</button>
              </div>
            </div>
          }
        </div>

        @if (filteredListings().length === 0) {
          <div class="empty-state">
            <p>No {{ activeTab() }} listings</p>
            <a routerLink="/marketplace/sell/new" class="btn-primary">Create your first listing</a>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .listings-container { padding: 1rem; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .header h1 { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .btn-primary { padding: 0.625rem 1.25rem; background: #1877f2; color: #fff; border: none; border-radius: 8px; text-decoration: none; font-weight: 500; }
    .stats-row { display: flex; gap: 2rem; margin-bottom: 1.5rem; padding: 1rem; background: #f0f2f5; border-radius: 12px; }
    .stat { text-align: center; }
    .stat .value { display: block; font-size: 1.5rem; font-weight: 700; }
    .stat .label { font-size: 0.875rem; color: #65676b; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid #e4e6eb; padding-bottom: 0.5rem; }
    .tabs button { padding: 0.5rem 1rem; background: transparent; border: none; cursor: pointer; font-weight: 500; color: #65676b; border-radius: 6px; }
    .tabs button.active { background: #e7f3ff; color: #1877f2; }
    .loading { text-align: center; padding: 2rem; color: #65676b; }
    .listings-grid { display: flex; flex-direction: column; gap: 1rem; }
    .listing-card { display: flex; gap: 1rem; padding: 1rem; background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .listing-image { width: 120px; height: 120px; background: #e4e6eb; border-radius: 8px; background-size: cover; background-position: center; flex-shrink: 0; }
    .listing-info { flex: 1; }
    .listing-info h3 { font-size: 1rem; font-weight: 500; margin: 0 0 0.5rem; }
    .price { font-size: 1.125rem; font-weight: 700; color: #1877f2; margin: 0 0 0.25rem; }
    .meta { font-size: 0.8rem; color: #65676b; margin: 0; }
    .listing-actions { display: flex; flex-direction: column; gap: 0.5rem; }
    .btn-edit { padding: 0.5rem 1rem; background: #e4e6eb; color: #050505; border: none; border-radius: 6px; text-decoration: none; text-align: center; font-size: 0.875rem; }
    .btn-delete { padding: 0.5rem 1rem; background: transparent; color: #e41e3f; border: 1px solid #e41e3f; border-radius: 6px; cursor: pointer; font-size: 0.875rem; }
    .empty-state { text-align: center; padding: 3rem; background: #f0f2f5; border-radius: 12px; }
    .empty-state p { margin: 0 0 1rem; color: #65676b; }
  `]
})
export class MyListingsComponent implements OnInit {
  private marketplaceService = inject(MarketplaceService);
  
  listings = signal<Product[]>([]);
  activeTab = signal<'active' | 'sold' | 'draft'>('active');
  loading = signal(true);

  activeCount = signal(0);
  soldCount = signal(0);
  draftCount = signal(0);

  ngOnInit() {
    this.loadListings();
  }

  loadListings() {
    this.loading.set(true);
    this.marketplaceService.getMyListings().subscribe({
      next: (result) => {
        this.listings.set(result.items);
        this.activeCount.set(result.items.filter(p => p.status === 'Active').length);
        this.soldCount.set(result.items.filter(p => p.status === 'Sold').length);
        this.draftCount.set(result.items.filter(p => p.status === 'Draft').length);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  filteredListings() {
    const tab = this.activeTab();
    const statusMap = { active: 'Active', sold: 'Sold', draft: 'Draft' };
    return this.listings().filter(p => p.status === statusMap[tab]);
  }

  setTab(tab: 'active' | 'sold' | 'draft') {
    this.activeTab.set(tab);
  }

  deleteListing(id: string) {
    if (confirm('Are you sure you want to delete this listing?')) {
      this.marketplaceService.deleteProduct(id).subscribe(() => {
        this.listings.update(l => l.filter(p => p.id !== id));
      });
    }
  }
}
