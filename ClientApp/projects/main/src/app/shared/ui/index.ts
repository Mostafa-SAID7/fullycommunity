// UI Components Library
export * from './button/button.component';
export * from './card/card.component';
export * from './input/input.component';
export * from './badge/badge.component';
export * from './avatar/avatar.component';
export * from './modal/modal.component';
export * from './toast/toast.component';
export * from './dropdown/dropdown.component';
export * from './select/select.component';
export * from './search-input/search-input.component';
export * from './chip/chip.component';
export * from './skeleton/skeleton.component';
export * from './spinner/spinner.component';
export * from './loading/loading.component';

// UI Component Array for easy importing
import { ButtonComponent } from './button/button.component';
import { CardComponent } from './card/card.component';
import { InputComponent } from './input/input.component';
import { BadgeComponent } from './badge/badge.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ModalComponent } from './modal/modal.component';
import { ToastComponent } from './toast/toast.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { SelectComponent } from './select/select.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { ChipComponent } from './chip/chip.component';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingComponent } from './loading/loading.component';

export const UI_COMPONENTS = [
  ButtonComponent,
  CardComponent,
  InputComponent,
  BadgeComponent,
  AvatarComponent,
  ModalComponent,
  ToastComponent,
  DropdownComponent,
  SelectComponent,
  SearchInputComponent,
  ChipComponent,
  SkeletonComponent,
  SpinnerComponent,
  LoadingComponent
] as const;