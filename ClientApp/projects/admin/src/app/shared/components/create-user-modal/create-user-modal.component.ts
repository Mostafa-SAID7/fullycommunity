import { Component, input, output, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface NewUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleType: string;
}

@Component({
  selector: 'app-create-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user-modal.component.html'
})
export class CreateUserModalComponent {
  show = input.required<boolean>();
  creating = input<boolean>(false);
  createSuccess = input<boolean>(false);
  createError = input<string>('');
  createStep = input<'select-type' | 'form'>('select-type');
  selectedUserType = input<'user' | 'admin'>('user');
  
  newUser = model.required<NewUser>();
  
  close = output<void>();
  selectType = output<'user' | 'admin'>();
  backToTypeSelection = output<void>();
  submit = output<NewUser>();

  getUserRoles(): string[] {
    return ['User', 'Expert', 'Reviewer', 'Vendor'];
  }

  getAdminRoles(): string[] {
    return ['SuperAdmin', 'UserAdmin', 'ContentAdmin', 'Moderator'];
  }

  getCurrentRoles(): string[] {
    return this.selectedUserType() === 'admin' ? this.getAdminRoles() : this.getUserRoles();
  }
}
