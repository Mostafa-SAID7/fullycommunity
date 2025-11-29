import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  description?: string;
  pricePerDay: number;
  imageUrl?: string;
  isAvailable: boolean;
  location: string;
  ownerId: string;
}

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly apiUrl = `${environment.apiUrl}/cars`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Car[]>(this.apiUrl);
  }

  getById(id: string) {
    return this.http.get<Car>(`${this.apiUrl}/${id}`);
  }

  search(location?: string, startDate?: string, endDate?: string) {
    const params: Record<string, string> = {};
    if (location) params['location'] = location;
    if (startDate) params['startDate'] = startDate;
    if (endDate) params['endDate'] = endDate;
    return this.http.get<Car[]>(`${this.apiUrl}/search`, { params });
  }

  create(car: Partial<Car>) {
    return this.http.post<Car>(this.apiUrl, car);
  }

  update(id: string, car: Partial<Car>) {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, car);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
