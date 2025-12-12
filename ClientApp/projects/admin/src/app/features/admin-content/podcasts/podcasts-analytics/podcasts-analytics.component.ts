import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-podcasts-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Podcast Analytics</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Track performance metrics for your podcasts
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Listens</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">{{ stats().totalListens | number }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-600 dark:text-green-400 font-medium">+12.5%</span>
            <span class="text-gray-600 dark:text-gray-400 ml-2">vs last month</span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Shows</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">{{ stats().activeShows }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-600 dark:text-green-400 font-medium">+3</span>
            <span class="text-gray-600 dark:text-gray-400 ml-2">new this month</span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Episodes</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">{{ stats().totalEpisodes }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-600 dark:text-green-400 font-medium">+15</span>
            <span class="text-gray-600 dark:text-gray-400 ml-2">this month</span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Listen Time</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">{{ stats().avgListenTime }}m</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-600 dark:text-green-400 font-medium">+8.2%</span>
            <span class="text-gray-600 dark:text-gray-400 ml-2">vs last month</span>
          </div>
        </div>
      </div>

      <!-- Charts Placeholder -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Listens Over Time</h3>
          <div class="h-64 flex items-center justify-center text-gray-400">
            <p>Chart visualization coming soon</p>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Episodes</h3>
          <div class="h-64 flex items-center justify-center text-gray-400">
            <p>Chart visualization coming soon</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PodcastsAnalyticsComponent implements OnInit {
  stats = signal({
    totalListens: 125430,
    activeShows: 24,
    totalEpisodes: 342,
    avgListenTime: 28
  });

  ngOnInit() {
    // Load analytics data
  }
}
