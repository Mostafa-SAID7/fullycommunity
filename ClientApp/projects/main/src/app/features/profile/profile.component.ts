import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="profile">
      <h2>My Profile</h2>
      @if (authService.currentUser(); as user) {
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>First Name</label>
            <input type="text" [(ngModel)]="firstName" name="firstName">
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input type="text" [(ngModel)]="lastName" name="lastName">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [value]="user.email" disabled>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" [(ngModel)]="phone" name="phone">
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="saving()">
            {{ saving() ? 'Saving...' : 'Save Changes' }}
          </button>
        </form>
      }
    </div>
  `,
  styles: [`
    .profile { max-width: 500px; margin: 0 auto; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-group input { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
    .form-group input:disabled { background: #f5f5f5; }
  `]
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
