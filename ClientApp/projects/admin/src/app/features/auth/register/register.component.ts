import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-form">
      <h2>Register</h2>
      <form (ngSubmit)="onSubmit()">
        <input type="text" [(ngModel)]="firstName" name="firstName" placeholder="First Name" required>
        <input type="text" [(ngModel)]="lastName" name="lastName" placeholder="Last Name" required>
        <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required>
        <input type="password" [(ngModel)]="password" name="password" placeholder="Password" required>
        <button type="submit" class="btn btn-primary">Register</button>
      </form>
      <p>Already have an account? <a routerLink="/login">Login</a></p>
    </div>
  `,
  styles: [`
    .auth-form { max-width: 400px; margin: 2rem auto; }
    form { display: flex; flex-direction: column; gap: 1rem; }
    input { padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  firstName = '';
  lastName = '';
  email = '';
  password = '';

  onSubmit() {
    this.authService.register({ email: this.email, password: this.password, firstName: this.firstName, lastName: this.lastName })
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => alert('Registration failed: ' + err.message)
      });
  }
}
