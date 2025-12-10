import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 text-center max-w-5xl mx-auto animate-fade-in">
        <!-- Logo/Icon -->
        <div class="mb-8 flex justify-center">
          <div class="w-24 h-24 bg-gradient-to-br from-primary to-primary-hover rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300 animate-bounce-in">
            <svg class="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
        </div>

        <!-- Main Heading -->
        <h1 class="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent animate-slide-up leading-tight">
          Welcome to<br/>Fully Community
        </h1>

        <!-- Subheading -->
        <p class="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto animate-slide-up leading-relaxed" style="animation-delay: 0.1s;">
          Connect, share, and grow with your community. Experience the power of collaboration and innovation.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style="animation-delay: 0.2s;">
          <a routerLink="/auth/login" 
             class="group bg-gradient-to-r from-primary to-primary-hover text-white font-bold py-4 px-10 rounded-xl shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3">
            <span>Get Started</span>
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </a>
          
          <a routerLink="/auth/login" 
             class="group bg-white text-primary font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-primary/20 hover:border-primary/40 flex items-center gap-3">
            <span>Sign In</span>
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
          </a>
        </div>

        <!-- Feature Highlights -->
        <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style="animation-delay: 0.3s;">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
            <div class="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Connect</h3>
            <p class="text-gray-600 text-sm">Build meaningful relationships with community members</p>
          </div>

          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
            <div class="w-12 h-12 bg-gradient-to-br from-accent to-accent-hover rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Share</h3>
            <p class="text-gray-600 text-sm">Exchange ideas, knowledge, and experiences</p>
          </div>

          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
            <div class="w-12 h-12 bg-gradient-to-br from-success to-success-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Grow</h3>
            <p class="text-gray-600 text-sm">Develop skills and achieve your goals together</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent {}
