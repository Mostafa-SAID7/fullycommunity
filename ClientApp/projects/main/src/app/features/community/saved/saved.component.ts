import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SavedItem {
  id: string;
  type: 'post' | 'video' | 'link' | 'product';
  title: string;
  description?: string;
  imageUrl?: string;
  savedAt: string;
  source: string;
}

@Component({
  selector: 'app-saved',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="saved-page">
      <div class="page-header">
        <h1>Saved</h1>
      </div>

      <!-- Filter -->
      <div class="filter-row">
        <button class="filter-btn" [class.active]="activeFilter() === 'all'" (click)="activeFilter.set('all')">All</button>
        <button class="filter-btn" [class.active]="activeFilter() === 'post'" (click)="activeFilter.set('post')">Posts</button>
        <button class="filter-btn" [class.active]="activeFilter() === 'video'" (click)="activeFilter.set('video')">Videos</button>
        <button class="filter-btn" [class.active]="activeFilter() === 'link'" (click)="activeFilter.set('link')">Links</button>
        <button class="filter-btn" [class.active]="activeFilter() === 'product'" (click)="activeFilter.set('product')">Products</button>
      </div>

      <!-- Saved Items -->
      <div class="saved-list">
        @for (item of filteredItems(); track item.id) {
          <div class="saved-card">
            <div class="saved-image" [style.background-image]="item.imageUrl ? 'url(' + item.imageUrl + ')' : ''">
              @if (!item.imageUrl) {
                <svg viewBox="0 0 24 24" fill="currentColor">
                  @switch (item.type) {
                    @case ('post') { <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/> }
                    @case ('video') { <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/> }
                    @case ('link') { <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/> }
                    @case ('product') { <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/> }
                  }
                </svg>
              }
            </div>
            <div class="saved-info">
              <span class="saved-type">{{ item.type | titlecase }}</span>
              <h3>{{ item.title }}</h3>
              @if (item.description) {
                <p class="saved-desc">{{ item.description }}</p>
              }
              <span class="saved-meta">Saved from {{ item.source }} · {{ item.savedAt }}</span>
            </div>
            <div class="saved-actions">
              <button class="action-btn" title="More options">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </div>
        }

        @if (filteredItems().length === 0) {
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
            <h3>No saved items</h3>
            <p>Items you save will appear here</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .saved-page { padding: 1rem 0; }
    
    .page-header {
      margin-bottom: 1.5rem;
      h1 { margin: 0; font-size: 1.5rem; }
    }
    
    .filter-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    
    .filter-btn {
      padding: 0.5rem 1rem;
      border: none;
      background: #e4e6eb;
      border-radius: 20px;
      font-weight: 500;
      cursor: pointer;
      
      &.active { background: #e7f3ff; color: #1877f2; }
      &:hover:not(.active) { background: #d8dadf; }
    }
    
    .saved-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .saved-card {
      display: flex;
      gap: 1rem;
      background: #fff;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: background 0.2s;
      
      &:hover { background: #f7f8fa; }
    }
    
    .saved-image {
      width: 120px;
      height: 90px;
      border-radius: 8px;
      background: #e4e6eb;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      svg { width: 32px; height: 32px; color: #65676b; }
    }
    
    .saved-info {
      flex: 1;
      min-width: 0;
      
      .saved-type {
        font-size: 0.75rem;
        font-weight: 600;
        color: #65676b;
        text-transform: uppercase;
      }
      
      h3 {
        margin: 0.25rem 0;
        font-size: 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .saved-desc {
        margin: 0 0 0.25rem;
        font-size: 0.9rem;
        color: #65676b;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .saved-meta {
        font-size: 0.8rem;
        color: #65676b;
      }
    }
    
    .saved-actions {
      .action-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        
        svg { width: 20px; height: 20px; color: #65676b; }
        &:hover { background: #e4e6eb; }
      }
    }
    
    .empty-state {
      text-align: center;
      padding: 3rem;
      background: #fff;
      border-radius: 8px;
      
      svg { width: 64px; height: 64px; color: #bcc0c4; margin-bottom: 1rem; }
      h3 { margin: 0 0 0.5rem; }
      p { margin: 0; color: #65676b; }
    }
  `]
})
export class SavedComponent {
  activeFilter = signal<string>('all');

  savedItems = signal<SavedItem[]>([
    { id: '1', type: 'post', title: 'Best Car Maintenance Tips for Winter', description: 'Essential tips to keep your car running smoothly during cold months', savedAt: '2 days ago', source: 'Car Enthusiasts' },
    { id: '2', type: 'video', title: 'How to Change Your Oil - Complete Guide', imageUrl: '', savedAt: '1 week ago', source: 'DIY Mechanics' },
    { id: '3', type: 'product', title: 'Premium Brake Pads Set', description: 'High-performance ceramic brake pads', savedAt: '2 weeks ago', source: 'Marketplace' },
    { id: '4', type: 'link', title: 'Electric Vehicle Charging Guide', description: 'Everything you need to know about EV charging', savedAt: '3 weeks ago', source: 'EV Club' }
  ]);

  filteredItems() {
    if (this.activeFilter() === 'all') return this.savedItems();
    return this.savedItems().filter(item => item.type === this.activeFilter());
  }
}
