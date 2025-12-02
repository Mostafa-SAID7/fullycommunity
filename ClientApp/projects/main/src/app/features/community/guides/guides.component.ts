import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GuidesService, GuideListItem, GuideDifficulty } from '../../../core/services/guides.service';

@Component({
  selector: 'app-guides',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Car Guides</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Step-by-step tutorials for car maintenance and repairs</p>
        </div>
        <button class="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Create Guide
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-6">
        <select [(ngModel)]="selectedDifficulty" (change)="loadGuides()" 
                class="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <option value="">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
        <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="loadGuides()" placeholder="Search guides..."
               class="px-4 py-2 border rounded-lg flex-1 min-w-[200px] dark:bg-gray-800 dark:border-gray-700">
        <select [(ngModel)]="sortBy" (change)="loadGuides()" 
                class="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <!-- Featured Guides -->
      @if (featuredGuides().length > 0) {
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Featured Guides</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (guide of featuredGuides(); track guide.id) {
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
                   [routerLink]="['/community/guides', guide.slug]">
                <div class="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span class="text-white text-4xl">📖</span>
                </div>
                <div class="p-4">
                  <span class="inline-block px-2 py-1 text-xs rounded-full mb-2"
                        [class]="getDifficultyClass(guide.difficulty)">
                    {{ guide.difficulty }}
                  </span>
                  <h3 class="font-semibold text-gray-900 dark:text-white line-clamp-2">{{ guide.title }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{{ guide.description }}</p>
                  <div class="flex items-center justify-between mt-3 text-sm text-gray-500">
                    <span>⏱️ {{ guide.estimatedMinutes }} min</span>
                    <span>⭐ {{ guide.averageRating.toFixed(1) }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- All Guides -->
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">All Guides</h2>
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (guide of guides(); track guide.id) {
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-md transition cursor-pointer"
                 [routerLink]="['/community/guides', guide.slug]">
              <div class="flex items-start justify-between mb-3">
                <span class="inline-block px-2 py-1 text-xs rounded-full"
                      [class]="getDifficultyClass(guide.difficulty)">
                  {{ guide.difficulty }}
                </span>
                <span class="text-sm text-gray-500">⏱️ {{ guide.estimatedMinutes }} min</span>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ guide.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{{ guide.description }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                    {{ guide.author.firstName[0] }}{{ guide.author.lastName[0] }}
                  </div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {{ guide.author.firstName }} {{ guide.author.lastName }}
                  </span>
                </div>
                <div class="flex items-center gap-3 text-sm text-gray-500">
                  <span>👁️ {{ guide.viewCount }}</span>
                  <span>⭐ {{ guide.averageRating.toFixed(1) }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      }

      @if (guides().length === 0 && !loading()) {
        <div class="text-center py-12 text-gray-500">
          <p class="text-4xl mb-4">📚</p>
          <p>No guides found. Be the first to create one!</p>
        </div>
      }
    </div>
  `
})
export class GuidesComponent implements OnInit {
  private guidesService = inject(GuidesService);

  guides = signal<GuideListItem[]>([]);
  featuredGuides = signal<GuideListItem[]>([]);
  loading = signal(false);
  
  selectedDifficulty = '';
  searchTerm = '';
  sortBy = 'newest';

  ngOnInit() {
    this.loadGuides();
    this.loadFeaturedGuides();
  }

  loadGuides() {
    this.loading.set(true);
    this.guidesService.getGuides({
      difficulty: this.selectedDifficulty as GuideDifficulty || undefined,
      searchTerm: this.searchTerm || undefined,
      sortBy: this.sortBy
    }).subscribe({
      next: (result) => {
        this.guides.set(result.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadFeaturedGuides() {
    this.guidesService.getFeaturedGuides(3).subscribe({
      next: (guides) => this.featuredGuides.set(guides)
    });
  }

  getDifficultyClass(difficulty: GuideDifficulty): string {
    const classes: Record<GuideDifficulty, string> = {
      'Beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Advanced': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Expert': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return classes[difficulty] || classes['Beginner'];
  }
}
