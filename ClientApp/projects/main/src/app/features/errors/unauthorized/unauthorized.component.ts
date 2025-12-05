import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Microsoft Fluent Design Unauthorized Page -->
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <!-- Error Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
          <!-- Lottie Animation Placeholder -->
          <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
            <div class="text-6xl animate-pulse">🔐</div>
          </div>
          
          <!-- Error Code -->
          <h1 class="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">401</h1>
          
          <!-- Error Title -->
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Authentication Required</h2>
          
          <!-- Error Description -->
          <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            You need to sign in to access this page. Please log in with your account credentials.
          </p>
          
          <!-- Auth Status -->
          <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-8">
            <div class="flex items-center justify-center text-indigo-700 dark:text-indigo-300">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span class="font-medium">Authentication Status: Not Signed In</span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a routerLink="/auth/login" 
               class="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              Sign In
            </a>
            <a routerLink="/" 
               class="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Go Home
            </a>
          </div>
        </div>
        
        <!-- Sign Up Option -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account? <a routerLink="/auth/register" class="text-primary-600 dark:text-primary-400 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {}