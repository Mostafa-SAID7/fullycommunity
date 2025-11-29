import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  carId: string;
}

@Component({
  selector: 'app-booking-list',
  standalone: true,
  template: `
    <h2>My Bookings</h2>
    @if (bookings().length === 0) {
      <p>No bookings yet.</p>
    } @else {
      <div class="booking-list">
        @for (booking of bookings(); track booking.id) {
          <div class="booking-card">
            <p>{{ booking.startDate | date }} - {{ booking.endDate | date }}</p>
            <p>Status: {{ booking.status }}</p>
            <p class="price">\${{ booking.totalPrice }}</p>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .booking-list { display: flex; flex-direction: column; gap: 1rem; }
    .booking-card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; }
    .price { font-weight: bold; color: #007bff; }
  `]
})
export class BookingListComponent implements OnInit {
  private http = inject(HttpClient);
  bookings = signal<Booking[]>([]);

  ngOnInit() {
    this.http.get<Booking[]>(`${environment.apiUrl}/bookings`).subscribe(b => this.bookings.set(b));
  }
}
