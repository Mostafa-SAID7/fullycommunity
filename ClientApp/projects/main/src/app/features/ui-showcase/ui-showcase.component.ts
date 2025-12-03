import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ButtonComponent, 
  CardComponent, 
  InputComponent, 
  BadgeComponent, 
  AvatarComponent, 
  ModalComponent, 
  ToastComponent, 
  LoadingComponent 
} from '../../shared/ui';

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
    LoadingComponent
  ],
  templateUrl: './ui-showcase.component.html'
})
export class UiShowcaseComponent {
  showModal = false;
  showToast = false;
  inputValue = '';

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  showToastMessage() {
    this.showToast = true;
  }

  hideToast() {
    this.showToast = false;
  }
}