import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MapsService, MapLocationListItem, LocationType } from '../../../core/services/ui/maps.service';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Car Locations</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Find gas stations, charging points, garages, and more</p>
        </div>
        <button class="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Add Location
        </button>
      </div>

      <!-- Location Type Filters -->
      <div class="flex gap-2 overflow-x-auto pb-4 mb-6">
        <button (click)="selectedType = ''; loadLocations()"
                [class]="!selectedType ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'"
                class="px-4 py-2 rounded-full whitespace-nowrap transition flex items-center gap-2">
          📍 All
        </button>
        @for (type of locationTypes; track type.value) {
          <button (click)="selectedType = type.value; loadLocations()"
                  [class]="selectedType === type.value ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'"
                  class="px-4 py-2 rounded-full whitespace-nowrap transition flex items-center gap-2">
            {{ type.icon }} {{ type.label }}
          </button>
        }
      </div>

      <!-- Search & Filters -->
      <div class="flex flex-wrap gap-4 mb-6">
        <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="loadLocations()" placeholder="Search locations..."
               class="px-4 py-2 border rounded-lg flex-1 min-w-[200px] dark:bg-gray-800 dark:border-gray-700">
        <input type="text" [(ngModel)]="city" placeholder="City"
               class="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
        <select [(ngModel)]="sortBy" (change)="loadLocations()" 
                class="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <option value="rating">Highest Rated</option>
          <option value="reviews">Most Reviews</option>
          <option value="newest">Newest</option>
        </select>
        <button (click)="loadLocations()" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300">
          Search
        </button>
        <button (click)="getNearbyLocations()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          📍 Near Me
        </button>
      </div>

      <!-- Map Placeholder -->
      <div class="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 mb-6 flex items-center justify-center">
        <div class="text-center text-gray-500 dark:text-gray-400">
          <p class="text-4xl mb-2">🗺️</p>
          <p>Interactive map coming soon</p>
          <p class="text-sm">Showing {{ locations().length }} locations</p>
        </div>
      </div>

      <!-- Locations Grid -->
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (location of locations(); track location.id) {
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
                 [routerLink]="['/community/maps', location.slug]">
              <div class="h-32 bg-gradient-to-br from-green-500 to-blue-600 relative flex items-center justify-center">
                <span class="text-4xl">{{ getTypeIcon(location.type) }}</span>
                @if (location.isVerified) {
                  <span class="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    ✓ Verified
                  </span>
                }
              </div>
              <div class="p-4">
                <div class="flex items-start justify-between mb-2">
                  <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {{ getTypeLabel(location.type) }}
                  </span>
                  @if (location.isOpen24Hours) {
                    <span class="text-xs text-green-600">Open 24h</span>
                  }
                </div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ location.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ location.address }}, {{ location.city }}
                </p>
                <div class="flex items-center justify-between mt-3">
                  <div class="flex items-center gap-1">
                    <span class="text-yellow-400">★</span>
                    <span class="font-medium">{{ location.averageRating.toFixed(1) }}</span>
                    <span class="text-sm text-gray-500">({{ location.reviewCount }})</span>
                  </div>
                  @if (location.distance) {
                    <span class="text-sm text-gray-500">{{ location.distance.toFixed(1) }} km</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }

      @if (locations().length === 0 && !loading()) {
        <div class="text-center py-12 text-gray-500">
          <p class="text-4xl mb-4">📍</p>
          <p>No locations found. Try a different search or add a new location!</p>
        </div>
      }
    </div>
  `
})
export class MapsComponent implements OnInit {
  private mapsService = inject(MapsService);

  locations = signal<MapLocationListItem[]>([]);
  loading = signal(false);
  
  selectedType = '';
  searchTerm = '';
  city = '';
  sortBy = 'rating';

  locationTypes = [
    { value: 'GasStation', label: 'Gas Stations', icon: '⛽' },
    { value: 'ChargingStation', label: 'EV Charging', icon: '🔌' },
    { value: 'CarWash', label: 'Car Wash', icon: '🚿' },
    { value: 'Garage', label: 'Garages', icon: '🔧' },
    { value: 'Dealership', label: 'Dealerships', icon: '🏪' },
    { value: 'PartsStore', label: 'Parts Stores', icon: '🛒' },
    { value: 'ScenicRoute', label: 'Scenic Routes', icon: '🏔️' },
    { value: 'MeetupSpot', label: 'Meetup Spots', icon: '🚗' }
  ];

  ngOnInit() {
    this.loadLocations();
  }

  loadLocations() {
    this.loading.set(true);
    this.mapsService.getLocations({
      type: this.selectedType as LocationType || undefined,
      city: this.city || undefined,
      searchTerm: this.searchTerm || undefined,
      sortBy: this.sortBy
    }).subscribe({
      next: (result) => {
        this.locations.set(result.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getNearbyLocations() {
    if (navigator.geolocation) {
      this.loading.set(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.mapsService.getNearbyLocations({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            radiusKm: 10,
            type: this.selectedType as LocationType || undefined
          }).subscribe({
            next: (locations) => {
              this.locations.set(locations);
              this.loading.set(false);
            },
            error: () => this.loading.set(false)
          });
        },
        () => {
          alert('Unable to get your location. Please enable location services.');
          this.loading.set(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  getTypeIcon(type: LocationType): string {
    const icons: Record<string, string> = {
      'GasStation': '⛽', 'ChargingStation': '🔌', 'CarWash': '🚿', 'Garage': '🔧',
      'Dealership': '🏪', 'PartsStore': '🛒', 'ParkingLot': '🅿️', 'ScenicRoute': '🏔️',
      'MeetupSpot': '🚗', 'RaceTrack': '🏁', 'CarMuseum': '🏛️', 'DrivingSchool': '🎓',
      'InspectionCenter': '📋', 'Other': '📍'
    };
    return icons[type] || '📍';
  }

  getTypeLabel(type: LocationType): string {
    const labels: Record<string, string> = {
      'GasStation': 'Gas Station', 'ChargingStation': 'EV Charging', 'CarWash': 'Car Wash',
      'Garage': 'Garage', 'Dealership': 'Dealership', 'PartsStore': 'Parts Store',
      'ParkingLot': 'Parking', 'ScenicRoute': 'Scenic Route', 'MeetupSpot': 'Meetup Spot',
      'RaceTrack': 'Race Track', 'CarMuseum': 'Car Museum', 'DrivingSchool': 'Driving School',
      'InspectionCenter': 'Inspection', 'Other': 'Other'
    };
    return labels[type] || type;
  }
}
