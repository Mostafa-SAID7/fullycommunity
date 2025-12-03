import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface SavedSearch {
  id: string;
  query: string;
  filters: Record<string, any>;
  newResults: number;
  createdAt: string;
}

@Component({
  selector: 'app-saved-searches',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="saved-searches-container">
      <h1>Saved Searches</h1>
      <p class="subtitle">Get notified when new items match your searches</p>

      @if (searches().length > 0) {
        <div class="searches-list">
          @for (search of searches(); track search.id) {
            <div class="search-card">
              <div class="search-info">
                <h3>{{ search.query }}</h3>
                <p class="filters">
                  @for (key of getFilterKeys(search.filters); track key) {
                    <span class="filter-tag">{{ key }}: {{ search.filters[key] }}</span>
                  }
                </p>
                <p class="meta">Saved {{ search.createdAt | date:'mediumDate' }}</p>
              </div>
              @if (search.newResults > 0) {
                <span class="new-badge">{{ search.newResults }} new</span>
              }
              <div class="search-actions">
                <a [routerLink]="['/marketplace/search']" [queryParams]="search.filters" class="btn-view">View Results</a>
                <button class="btn-delete" (click)="deleteSearch(search.id)">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <h2>No saved searches</h2>
          <p>Save your searches to get notified when new items are listed</p>
          <a routerLink="/marketplace/search" class="btn-primary">Start Searching</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .saved-searches-container { padding: 1rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.25rem; }
    .subtitle { color: #65676b; margin: 0 0 1.5rem; }
    .searches-list { display: flex; flex-direction: column; gap: 1rem; }
    .search-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .search-info { flex: 1; }
    .search-info h3 { font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem; }
    .filters { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0 0 0.25rem; }
    .filter-tag { background: #e4e6eb; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; }
    .meta { font-size: 0.8rem; color: #65676b; margin: 0; }
    .new-badge { background: #e41e3f; color: #fff; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .search-actions { display: flex; gap: 0.5rem; }
    .btn-view { padding: 0.5rem 1rem; background: #1877f2; color: #fff; border: none; border-radius: 6px; text-decoration: none; font-size: 0.875rem; }
    .btn-delete { width: 36px; height: 36px; border: none; background: #f0f2f5; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .btn-delete svg { width: 18px; height: 18px; color: #65676b; }
    .btn-delete:hover { background: #e4e6eb; }
    .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-state svg { width: 64px; height: 64px; color: #ccc; margin-bottom: 1rem; }
    .empty-state h2 { font-size: 1.25rem; margin: 0 0 0.5rem; }
    .empty-state p { color: #65676b; margin: 0 0 1.5rem; }
    .btn-primary { padding: 0.625rem 1.25rem; background: #1877f2; color: #fff; border: none; border-radius: 8px; text-decoration: none; font-weight: 500; }
  `]
})
export class SavedSearchesComponent {
  searches = signal<SavedSearch[]>([
    { id: '1', query: 'Classic Mustang Parts', filters: { category: 'Parts', make: 'Ford' }, newResults: 5, createdAt: '2024-01-15' },
    { id: '2', query: 'Performance Exhaust', filters: { category: 'Performance', priceMax: '500' }, newResults: 0, createdAt: '2024-01-10' }
  ]);

  getFilterKeys(filters: Record<string, any>): string[] {
    return Object.keys(filters);
  }

  deleteSearch(id: string) {
    this.searches.update(s => s.filter(search => search.id !== id));
  }
}
