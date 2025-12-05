import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MapsService, MapLocation, LocationReview } from '../../../core/services/ui/maps.service';

@Component({
  selector: 'app-location-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-6">
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      } @else if (location()) {
        <a routerLink="/community/maps" class="text-blue-600 hover:underline mb-4 inline-block">← Back to Maps</a>
        
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
          <div class="h-48 bg-gradient-to-br from-green-500 to-blue-600 relative flex items-center justify-center">
            <span class="text-6xl">{{ getTypeIcon(location()!.type) }}</span>
            @if (location()!.isVerified) {
              <span class="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full">✓ Verified</span>
            }
          </div>
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <span class="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{{ getTypeLabel(location()!.type) }}</span>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-2">{{ location()!.name }}</h1>
              </div>
              <div class="text-right">
                <div class="flex items-center gap-1 text-xl">
                  <span class="text-yellow-400">★</span>
                  <span class="font-bold">{{ location()!.averageRating.toFixed(1) }}</span>
                </div>
                <p class="text-sm text-gray-500">{{ location()!.reviewCount }} reviews</p>
              </div>
            </div>

            <!-- Address & Contact -->
            <div class="space-y-2 mb-6">
              <p class="text-gray-600 dark:text-gray-400">
                📍 {{ location()!.address }}, {{ location()!.city }}, {{ location()!.state }} {{ location()!.postalCode }}
              </p>
              @if (location()!.phone) {
                <p class="text-gray-600 dark:text-gray-400">📞 {{ location()!.phone }}</p>
              }
              @if (location()!.website) {
                <p><a [href]="location()!.website" target="_blank" class="text-blue-600 hover:underline">🌐 Visit Website</a></p>
              }
              @if (location()!.isOpen24Hours) {
                <p class="text-green-600">🕐 Open 24 Hours</p>
              }
            </div>

            @if (location()!.description) {
              <p class="text-gray-700 dark:text-gray-300 mb-6">{{ location()!.description }}</p>
            }

            <!-- Features -->
            @if (location()!.features.length > 0) {
              <div class="mb-6">
                <h3 class="font-semibold mb-2 text-gray-900 dark:text-white">Features</h3>
                <div class="flex flex-wrap gap-2">
                  @for (feature of location()!.features; track feature) {
                    <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      {{ feature }}
                    </span>
                  }
                </div>
              </div>
            }

            <!-- Actions -->
            <div class="flex flex-wrap gap-3">
              <button (click)="toggleSave()" class="px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700">
                {{ location()!.isSaved ? '🔖 Saved' : '📑 Save' }}
              </button>
              <button (click)="checkIn()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                📍 Check In
              </button>
              <a [href]="'https://maps.google.com/?q=' + location()!.latitude + ',' + location()!.longitude" 
                 target="_blank" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                🗺️ Directions
              </a>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ location()!.reviewCount }}</p>
            <p class="text-sm text-gray-500">Reviews</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ location()!.checkInCount }}</p>
            <p class="text-sm text-gray-500">Check-ins</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ location()!.saveCount }}</p>
            <p class="text-sm text-gray-500">Saves</p>
          </div>
        </div>

        <!-- Reviews -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Reviews</h2>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Write Review</button>
          </div>
          @if (reviews().length > 0) {
            <div class="space-y-4">
              @for (review of reviews(); track review.id) {
                <div class="border-b dark:border-gray-700 pb-4 last:border-0">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                        {{ review.user.firstName[0] }}{{ review.user.lastName[0] }}
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{{ review.user.firstName }}</p>
                        <p class="text-xs text-gray-500">{{ review.createdAt | date:'MMM d, yyyy' }}</p>
                      </div>
                    </div>
                    <div class="flex text-yellow-400">
                      @for (star of [1,2,3,4,5]; track star) {
                        <span class="text-sm">{{ star <= review.rating ? '★' : '☆' }}</span>
                      }
                    </div>
                  </div>
                  @if (review.title) {
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ review.title }}</h4>
                  }
                  <p class="text-gray-600 dark:text-gray-400 text-sm">{{ review.content }}</p>
                  @if (review.ownerResponse) {
                    <div class="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p class="text-xs text-gray-500 mb-1">Owner Response:</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ review.ownerResponse }}</p>
                    </div>
                  }
                </div>
              }
            </div>
          } @else {
            <p class="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
          }
        </div>
      } @else {
        <div class="text-center py-12">
          <p class="text-4xl mb-4">📍</p>
          <p class="text-gray-500">Location not found</p>
          <a routerLink="/community/maps" class="text-blue-600 hover:underline mt-4 inline-block">Browse all locations</a>
        </div>
      }
    </div>
  `
})
export class LocationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private mapsService = inject(MapsService);

  location = signal<MapLocation | null>(null);
  reviews = signal<LocationReview[]>([]);
  loading = signal(true);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.mapsService.getLocationBySlug(slug).subscribe({
        next: (location) => {
          this.location.set(location);
          this.loading.set(false);
          this.loadReviews(location.id);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  loadReviews(locationId: string) {
    this.mapsService.getLocationReviews(locationId).subscribe({
      next: (result) => this.reviews.set(result.items)
    });
  }

  toggleSave() {
    const loc = this.location();
    if (!loc) return;
    (loc.isSaved ? this.mapsService.unsaveLocation(loc.id) : this.mapsService.saveLocation(loc.id)).subscribe();
  }

  checkIn() {
    const loc = this.location();
    if (loc) this.mapsService.checkIn(loc.id).subscribe();
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'GasStation': '⛽', 'ChargingStation': '🔌', 'CarWash': '🚿', 'Garage': '🔧',
      'Dealership': '🏪', 'PartsStore': '🛒', 'ScenicRoute': '🏔️', 'MeetupSpot': '🚗'
    };
    return icons[type] || '📍';
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'GasStation': 'Gas Station', 'ChargingStation': 'EV Charging', 'CarWash': 'Car Wash',
      'Garage': 'Garage', 'Dealership': 'Dealership', 'PartsStore': 'Parts Store'
    };
    return labels[type] || type;
  }
}
