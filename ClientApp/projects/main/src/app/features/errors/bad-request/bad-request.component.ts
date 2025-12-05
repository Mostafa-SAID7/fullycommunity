import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bad-request',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Microsoft Fluent Design Bad Request Error Page -->
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <!-- Error Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
          <!-- Lottie Animation Placeholder -->
          <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-full flex items-center justify-center">
            <div class="text-6xl animate-bounce">⚠️</div>
          </div>
          
          <!-- Error Code -->
          <h1 class="text-6xl font-bold text-orange-600 dark:text-orange-400 mb-2">400</h1>
          
          <!-- Error Title -->
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Bad Request</h2>
          
          <!-- Error Description -->
          <p class="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            The request could not be understood by the server. Please check your input and try again.
          </p>
          
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
        
        <!-- Additional Help -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Need help? <a href="/support" class="text-primary-600 dark:text-primary-400 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class BadRequestComponent {
  goBack() {
    window.history.back();
  }
}