import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ButtonComponent, 
  CardComponent, 
  InputComponent, 
  BadgeComponent, 
  AvatarComponent, 
  ModalComponent, 
  ToastComponent, 
  LoadingComponent,
  SearchInputComponent,
  SelectComponent,
  DropdownComponent,
  ChipComponent,
  SpinnerComponent,
  SkeletonComponent
} from '../../shared/ui';
import type { DropdownItem } from '../../shared/ui';
import { ToastService } from '../../core/services/ui/toast.service';
import { AnimationShowcaseComponent } from '../../shared/components/animation-showcase/animation-showcase.component';

@Component({
  selector: 'app-ui-showcase',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    InputComponent,
    BadgeComponent,
    AvatarComponent,
    ModalComponent,
    ToastComponent,
    LoadingComponent,
    SearchInputComponent,
    SelectComponent,
    DropdownComponent,
    ChipComponent,
    SpinnerComponent,
    SkeletonComponent,
    AnimationShowcaseComponent
  ],
  templateUrl: './ui-showcase.component.html'
})
export class UiShowcaseComponent {
  private toastService = inject(ToastService);
  
  showModal = false;
  showToast = false;
  inputValue = '';

  // Select options
  selectOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    { label: 'Disabled Option', value: 'disabled', disabled: true },
  ];

  // Dropdown items
  dropdownItems: DropdownItem[] = [
    { label: 'Dashboard', value: 'dashboard', icon: '📊' },
    { label: 'Users', value: 'users', icon: '👥' },
    { label: 'Settings', value: 'settings', icon: '⚙️' },
    { label: 'Divider', value: '', divider: true },
    { label: 'Help', value: 'help', icon: '❓' },
    { label: 'Logout', value: 'logout', icon: '🚪' },
  ];

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  showToastMessage() {
    this.toastService.success('This is a success toast notification!', 'Success');
  }

  showErrorToast() {
    this.toastService.error('This is an error toast notification!', 'Error');
  }

  showWarningToast() {
    this.toastService.warning('This is a warning toast notification!', 'Warning');
  }

  showInfoToast() {
    this.toastService.info('This is an info toast notification!', 'Information');
  }

  hideToast() {
    this.showToast = false;
  }
}