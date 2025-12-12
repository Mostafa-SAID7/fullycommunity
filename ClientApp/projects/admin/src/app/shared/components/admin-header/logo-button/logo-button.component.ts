import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo-button.component.html',
  styleUrl: './logo-button.component.scss'
})
export class LogoButtonComponent {
  @Input() text: string = 'CC';
  @Input() size: number = 96;
  @Input() fontSize: number = 48;
  @Input() containerClasses: string = '';
  @Input() textClasses: string = '';
}
