import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PopularCategoriesService, PopularCategory } from '../../../../core/services/home/popular-categories.service';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-popular-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './popular-categories.component.html'
})
export class PopularCategoriesComponent implements OnInit {
  private popularCategoriesService = inject(PopularCategoriesService);

  categories = signal<PopularCategory[]>([]);
  loadingState = signal<LoadingState>({ isLoading: true, error: null });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loadingState.set({ isLoading: true, error: null });

    this.popularCategoriesService.getPopularCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loadingState.set({ isLoading: false, error: null });
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories.set([]);
        this.loadingState.set({ 
          isLoading: false, 
          error: 'Failed to load categories. Please try again.' 
        });
      }
    });
  }

  retryLoad(): void {
    this.loadCategories();
  }

  getCategoryIcon(category: PopularCategory): string {
    // Return the icon from the category or use default based on name
    if (category.icon) {
      return category.icon;
    }

    const iconMap: { [key: string]: string } = {
      'general': '💬',
      'maintenance': '🔧',
      'reviews': '⭐',
      'buying': '🛒',
      'selling': '💰',
      'events': '📅',
      'modifications': '⚙️',
      'insurance': '🛡️',
      'financing': '💳',
      'electric': '⚡',
      'classic': '🏛️',
      'racing': '🏁',
      'diy': '🔨',
      'safety': '🦺',
      'performance': '🏎️',
      'troubleshooting': '🔍',
      'off-road': '🏔️',
      'luxury': '💎'
    };

    const categoryName = category.name.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (categoryName.includes(key)) {
        return icon;
      }
    }
    
    return '📂';
  }

  getCategoryGradient(index: number): string {
    const gradients = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-yellow-400 to-orange-500',
      'from-indigo-400 to-indigo-600',
      'from-red-400 to-red-600',
      'from-teal-400 to-teal-600'
    ];
    return gradients[index % gradients.length];
  }
}