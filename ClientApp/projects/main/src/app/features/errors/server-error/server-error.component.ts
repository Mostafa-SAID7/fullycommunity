import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Microsoft Fluent Design Server Error Page -->
    <div class="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900 flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <!-- Error Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
          <!-- Lottie Animation Placeholder -->
          <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center">
            <div class="text-6xl animate-pulse">⚠️</div>
          </div>
          
          <!-- Error Code -->
          <h1 class="text-6xl font-bold text-error-600 dark:text-error-400 mb-2">500</h1>
          
          <!-- Error Title -->
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Internal Server Error</h2>
          
          <!-- Error Description -->
          <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Something went wrong on our end. Our team has been notified and is working to fix the issue.
          </p>
          
          <!-- Status Information -->
          <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-8">
            <div class="flex items-center justify-center text-red-700 dark:text-red-300 mb-2">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <span class="font-medium">Server Status: Error</span>
            </div>
            <p class="text-sm text-red-600 dark:text-red-400">
              Error ID: #{{ getErrorId() }}
            </p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button (click)="retry()" 
                    class="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Try Again
            </button>
            <a routerLink="/" 
               class="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Go Home
            </a>
          </div>
        </div>
        
        <!-- Additional Information -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            If the problem persists, please contact our support team with the error ID above.
          </p>
          <div class="flex justify-center space-x-4">
            <a href="/support" class="text-primary-600 dark:text-primary-400 hover:underline text-sm">Contact Support</a>
            <a href="https://status.communitycar.com" target="_blank" rel="noopener" class="text-primary-600 dark:text-primary-400 hover:underline text-sm">System Status</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ServerErrorComponent {
  retry() {
    window.location.reload();
  }
  
  getErrorId(): string {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  }
}