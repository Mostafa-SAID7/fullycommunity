import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Microsoft Fluent Design 404 Page -->
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <!-- Error Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
          <!-- Lottie Animation Placeholder -->
          <div class="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center">
            <div class="text-8xl animate-bounce">🔍</div>
          </div>
          
          <!-- Error Code -->
          <h1 class="text-7xl font-bold text-primary-600 dark:text-primary-400 mb-2">404</h1>
          
          <!-- Error Title -->
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Page Not Found</h2>
          
          <!-- Error Description -->
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved to a different location.
          </p>
          
          <!-- Search Suggestion -->
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-8">
            <div class="flex items-center justify-center text-blue-700 dark:text-blue-300">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <span class="text-sm">Try searching for what you need</span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a routerLink="/" 
               class="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Go Home
            </a>
            <button (click)="goBack()" 
                    class="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Go Back
            </button>
          </div>
        </div>
        
        <!-- Popular Pages -->
        <div class="mt-6">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">Popular Pages</h3>
          <div class="grid grid-cols-2 gap-2">
            <a routerLink="/community" class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
              <div class="text-2xl mb-1">👥</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Community</div>
            </a>
            <a routerLink="/marketplace" class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
              <div class="text-2xl mb-1">🛒</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Marketplace</div>
            </a>
            <a routerLink="/videos" class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
              <div class="text-2xl mb-1">📹</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Videos</div>
            </a>
            <a routerLink="/services" class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
              <div class="text-2xl mb-1">🔧</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">Services</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {
  goBack() {
    window.history.back();
  }
}