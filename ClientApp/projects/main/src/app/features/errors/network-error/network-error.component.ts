import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-network-error',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Microsoft Fluent Design Network Error Page -->
    <div class="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-red-900 flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <!-- Error Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
          <!-- Lottie Animation Placeholder -->
          <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center">
            <div class="text-6xl animate-pulse">📡</div>
          </div>
          
          <!-- Error Title -->
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Connection Problem</h1>
          
          <!-- Error Description -->
          <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            We're having trouble connecting to our servers. Please check your internet connection and try again.
          </p>
          
          <!-- Connection Status -->
          <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-8">
            <div class="flex items-center justify-center text-red-700 dark:text-red-300">
              <div class="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
              <span class="font-medium">Connection Status: Offline</span>
            </div>
          </div>
          
          <!-- Troubleshooting Tips -->
          <div class="text-left mb-8">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Try these steps:</h3>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li class="flex items-start">
                <svg class="w-4 h-4 mt-0.5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Check your internet connection
              </li>
              <li class="flex items-start">
                <svg class="w-4 h-4 mt-0.5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Refresh the page
              </li>
              <li class="flex items-start">
                <svg class="w-4 h-4 mt-0.5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Try again in a few minutes
              </li>
            </ul>
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
        
        <!-- Additional Help -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Still having issues? <a href="/support" class="text-primary-600 dark:text-primary-400 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class NetworkErrorComponent {
  retry() {
    window.location.reload();
  }
}