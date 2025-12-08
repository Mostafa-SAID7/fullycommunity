import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  attendeeCount: number;
  organizerName: string;
}

@Component({
  selector: 'app-events-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Events Management</h1>
        <p class="text-gray-600">Manage community events, approve submissions, and monitor attendance</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
            placeholder="Search events..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            [(ngModel)]="selectedStatus"
            (change)="onStatusChange($any($event.target).value)"
            class="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            (click)="onSearch()"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (!loading() && events().length > 0) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          @for (event of events(); track event.id) {
            <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ event.title }}</h3>
                <span [class]="'px-2 py-1 text-xs rounded-full ' + getStatusBadgeClass(event.status)">
                  {{ event.status }}
                </span>
              </div>
              
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ event.description }}</p>
              
              <div class="space-y-2 text-sm text-gray-600 mb-4">
                <div class="flex items-center gap-2">
                  <span>📍</span>
                  <span>{{ event.location }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span>📅</span>
                  <span>{{ formatDate(event.startDate) }} - {{ formatDate(event.endDate) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span>👥</span>
                  <span>{{ event.attendeeCount }} attendees</span>
                </div>
                <div class="flex items-center gap-2">
                  <span>👤</span>
                  <span>Organized by {{ event.organizerName }}</span>
                </div>
              </div>

              <div class="flex gap-2">
                @if (event.status === 'upcoming') {
                  <button
                    (click)="cancelEvent(event)"
                    class="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                  >
                    Cancel Event
                  </button>
                }
                <button
                  (click)="deleteEvent(event)"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Page {{ currentPage() }} of {{ totalPages() }} ({{ totalCount() }} total)
          </div>
          <div class="flex gap-2">
            <button
              (click)="goToPage(currentPage() - 1)"
              [disabled]="currentPage() === 1"
              class="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              (click)="goToPage(currentPage() + 1)"
              [disabled]="currentPage() === totalPages()"
              class="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      }

      @if (!loading() && events().length === 0) {
        <div class="bg-white rounded-lg shadow-sm p-12 text-center">
          <div class="text-gray-400 text-6xl mb-4">📅</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No events found</h3>
        </div>
      }
    </div>
  `
})
export class EventsManagementComponent implements OnInit {
  private http = inject(HttpClient);
  
  events = signal<Event[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  pageSize = 12;
  totalPages = signal(1);
  totalCount = signal(0);
  searchQuery = signal('');
  selectedStatus = signal('');

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading.set(true);
    
    let params = new HttpParams()
      .set('page', this.currentPage().toString())
      .set('pageSize', this.pageSize.toString());
    
    if (this.searchQuery()) params = params.set('search', this.searchQuery());
    if (this.selectedStatus()) params = params.set('status', this.selectedStatus());

    this.http.get<any>(`${environment.apiUrl}/admin/dashboard/community/events`, { params }).subscribe({
      next: (response) => {
        if (response.items) {
          this.events.set(response.items);
          this.totalCount.set(response.totalCount);
          this.totalPages.set(Math.ceil(response.totalCount / this.pageSize));
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadEvents();
  }

  onStatusChange(status: string) {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
    this.loadEvents();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadEvents();
  }

  cancelEvent(event: Event) {
    if (!confirm(`Cancel event "${event.title}"?`)) return;

    this.http.post(`${environment.apiUrl}/admin/dashboard/community/events/${event.id}/cancel`, {}).subscribe({
      next: () => this.loadEvents(),
      error: (error) => console.error('Error cancelling event:', error)
    });
  }

  deleteEvent(event: Event) {
    if (!confirm(`Delete event "${event.title}"? This action cannot be undone.`)) return;

    this.http.delete(`${environment.apiUrl}/admin/dashboard/community/events/${event.id}`).subscribe({
      next: () => this.loadEvents(),
      error: (error) => console.error('Error deleting event:', error)
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
