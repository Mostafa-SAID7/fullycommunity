import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <span class="text-3xl">🚗</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Create Admin Account</h1>
            <p class="text-gray-600 text-sm">Register for admin access</p>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Error Message -->
            @if (errorMessage()) {
              <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {{ errorMessage() }}
              </div>
            }

            <!-- First Name -->
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                [(ngModel)]="firstName"
                name="firstName"
                placeholder="John"
                required
                [disabled]="loading()"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                [(ngModel)]="lastName"
                name="lastName"
                placeholder="Doe"
                required
                [disabled]="loading()"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                [(ngModel)]="email"
                name="email"
                placeholder="admin@example.com"
                required
                [disabled]="loading()"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100"
              />
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Enter your password"
                required
                [disabled]="loading()"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100"
              />
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              [disabled]="loading()"
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center mt-6"
            >
              @if (!loading()) {
                <span>Create Account</span>
              } @else {
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              }
            </button>
          </form>

          <!-- Footer -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Already have an account? 
              <a routerLink="/login" class="text-blue-600 hover:text-blue-700 font-medium ml-1">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  loading = signal(false);
  errorMessage = signal('');

  onSubmit() {
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.register({ 
      email: this.email, 
      password: this.password, 
      firstName: this.firstName, 
      lastName: this.lastName 
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Registration failed. Please try again.');
      }
    });
  }
}
