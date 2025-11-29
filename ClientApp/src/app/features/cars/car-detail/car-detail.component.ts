import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService, type Car } from '../../../core/services/car.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  template: `
    @if (car()) {
      <div class="car-detail">
        <h2>{{ car()!.make }} {{ car()!.model }}</h2>
        <p>Year: {{ car()!.year }}</p>
        <p>Location: {{ car()!.location }}</p>
        <p>{{ car()!.description }}</p>
        <p class="price">\${{ car()!.pricePerDay }}/day</p>
        @if (authService.isAuthenticated()) {
          <button class="btn btn-primary" (click)="book()">Book Now</button>
        } @else {
          <p>Please <a routerLink="/login">login</a> to book this car.</p>
        }
      </div>
    }
  `,
  styles: [`
    .car-detail { max-width: 600px; }
    .price { font-size: 1.5rem; font-weight: bold; color: #007bff; margin: 1rem 0; }
  `]
})
export class CarDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private carService = inject(CarService);
  authService = inject(AuthService);
  car = signal<Car | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.carService.getById(id).subscribe(car => this.car.set(car));
  }

  book() {
    this.router.navigate(['/bookings'], { queryParams: { carId: this.car()?.id } });
  }
}
