import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Profile Header -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 animate-fade-in">
          <div class="bg-gradient-to-r from-primary to-primary-hover h-32 relative">
            <div class="absolute -bottom-12 left-8">
              <div class="w-24 h-24 bg-gradient-to-br from-accent to-accent-hover rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-white">
                {{ authService.currentUser()?.firstName?.[0] || 'U' }}
              </div>
            </div>
          </div>
          <div class="pt-16 pb-6 px-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">My Profile</h2>
            <p class="text-gray-600">Manage your personal information</p>
          </div>
        </div>

        <!-- Profile Form -->
        @if (authService.currentUser(); as user) {
          <form (ngSubmit)="onSubmit()" class="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-slide-up">
            <!-- First Name -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                First Name
              </label>
              <input 
                type="text" 
                [(ngModel)]="firstName" 
                name="firstName"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 hover:border-gray-300"
                placeholder="Enter your first name">
            </div>

            <!-- Last Name -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Last Name
              </label>
              <input 
                type="text" 
                [(ngModel)]="lastName" 
                name="lastName"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 hover:border-gray-300"
                placeholder="Enter your last name">
            </div>

            <!-- Email (Disabled) -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Email
                <span class="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Read-only</span>
              </label>
              <input 
                type="email" 
                [value]="user.email" 
                disabled
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed">
            </div>

            <!-- Phone -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                Phone Number
              </label>
              <input 
                type="tel" 
                [(ngModel)]="phone" 
                name="phone"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 hover:border-gray-300"
                placeholder="Enter your phone number">
            </div>

            <!-- Submit Button -->
            <div class="pt-4">
              <button 
                type="submit" 
                [disabled]="saving()"
                class="w-full bg-gradient-to-r from-primary to-primary-hover text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                @if (saving()) {
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving Changes...</span>
                } @else {
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Save Changes</span>
                }
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  firstName = '';
  lastName = '';
  phone = '';
  saving = signal(false);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.phone = user.phoneNumber || '';
    }
  }

  onSubmit() {
    this.saving.set(true);
    this.authService.updateProfile({ firstName: this.firstName, lastName: this.lastName, phoneNumber: this.phone })
      .subscribe({
        next: () => this.saving.set(false),
        error: () => this.saving.set(false)
      });
  }
}
