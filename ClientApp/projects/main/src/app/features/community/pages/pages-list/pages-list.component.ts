import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PagesService, PageListItem, PageCategory, PageFilter } from '../../../../core/services';

@Component({
  selector: 'app-pages-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Community Pages</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Discover automotive businesses, services, and communities
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Pages
            </label>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="onFilterChange()"
              placeholder="Search by name or description..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              [(ngModel)]="selectedCategory"
              (change)="onFilterChange()"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="CarDealer">Car Dealers</option>
              <option value="AutoRepair">Auto Repair</option>
              <option value="CarWash">Car Wash</option>
              <option value="AutoParts">Auto Parts</option>
              <option value="RacingTeam">Racing Teams</option>
              <option value="CarClub">Car Clubs</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Verified Only
            </label>
            <label class="flex items-center">
              <input
                type="checkbox"
                [(ngModel)]="verifiedOnly"
                (change)="onFilterChange()"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Show verified pages only</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Pages Grid -->
      <div *ngIf="!loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let page of pages()"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Page Header -->
          <div class="p-6">
            <div class="flex items-start space-x-4">
              <img
                [src]="page.profileImageUrl || '/assets/images/default-page.png'"
                [alt]="page.name"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {{ page.name }}
                  </h3>
                  <svg
                    *ngIf="page.isVerified"
                    class="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ '@' + page.username }}</p>
                <span class="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full mt-2">
                  {{ getCategoryLabel(page.category) }}
                </span>
              </div>
            </div>

            <p *ngIf="page.description" class="mt-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {{ page.description }}
            </p>

            <!-- Stats -->
            <div class="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center space-x-4">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ page.followerCount | number }} followers
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  {{ page.averageRating | number:'1.1-1' }}
                </span>
              </div>
              
              <button
                (click)="toggleFollow(page)"
                [class]="page.isFollowing 
                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'"
                class="px-3 py-1 rounded-md text-xs font-medium transition-colors"
              >
                {{ page.isFollowing ? 'Following' : 'Follow' }}
              </button>
            </div>
          </div>

          <!-- View Page Button -->
          <div class="px-6 pb-6">
            <a
              [routerLink]="['/community/pages', page.id]"
              class="block w-full text-center px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              View Page
            </a>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading() && pages().length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pages found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your search criteria or browse all categories.
        </p>
      </div>
    </div>
  `
})
export class PagesListComponent implements OnInit {
  private pagesService = inject(PagesService);

  pages = signal<PageListItem[]>([]);
  loading = signal(false);
  
  searchTerm = '';
  selectedCategory = '';
  verifiedOnly = false;

  ngOnInit() {
    this.loadPages();
  }

  onFilterChange() {
    this.loadPages();
  }

  private loadPages() {
    this.loading.set(true);
    
    const filter: PageFilter = {
      searchTerm: this.searchTerm || undefined,
      category: this.selectedCategory as PageCategory || undefined,
      isVerified: this.verifiedOnly || undefined
    };

    this.pagesService.getPages(filter).subscribe({
      next: (result) => {
        this.pages.set(result.items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  toggleFollow(page: PageListItem) {
    if (page.isFollowing) {
      this.pagesService.unfollowPage(page.id).subscribe(() => {
        page.isFollowing = false;
        page.followerCount--;
      });
    } else {
      this.pagesService.followPage(page.id).subscribe(() => {
        page.isFollowing = true;
        page.followerCount++;
      });
    }
  }

  getCategoryLabel(category: PageCategory): string {
    const labels: Record<PageCategory, string> = {
      [PageCategory.Automotive]: 'Automotive',
      [PageCategory.CarDealer]: 'Car Dealer',
      [PageCategory.AutoRepair]: 'Auto Repair',
      [PageCategory.CarWash]: 'Car Wash',
      [PageCategory.GasStation]: 'Gas Station',
      [PageCategory.CarRental]: 'Car Rental',
      [PageCategory.AutoParts]: 'Auto Parts',
      [PageCategory.Insurance]: 'Insurance',
      [PageCategory.Financing]: 'Financing',
      [PageCategory.CarClub]: 'Car Club',
      [PageCategory.RacingTeam]: 'Racing Team',
      [PageCategory.Blogger]: 'Blogger',
      [PageCategory.Influencer]: 'Influencer',
      [PageCategory.Media]: 'Media',
      [PageCategory.Other]: 'Other'
    };
    return labels[category] || category;
  }
}