import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarService, type Car } from '../../../core/services/car.service';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Available Cars</h2>
    <div class="car-grid">
      @for (car of cars(); track car.id) {
        <div class="car-card">
          <h3>{{ car.make }} {{ car.model }}</h3>
          <p>{{ car.year }} • {{ car.location }}</p>
          <p class="price">\${{ car.pricePerDay }}/day</p>
          <a [routerLink]="['/cars', car.id]" class="btn btn-primary">View Details</a>
        </div>
      }
    </div>
  `,
  styles: [`
    h2 { margin-bottom: 2rem; }
    .car-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .car-card { border: 1px solid #ddd; border-radius: 8px; padding: 1.5rem; }
    .price { font-size: 1.25rem; font-weight: bold; color: #007bff; margin: 1rem 0; }
  `]
})
export class CarListComponent implements OnInit {
  private carService = inject(CarService);
  cars = signal<Car[]>([]);

  ngOnInit() {
    this.carService.getAll().subscribe(cars => this.cars.set(cars));
  }
}
