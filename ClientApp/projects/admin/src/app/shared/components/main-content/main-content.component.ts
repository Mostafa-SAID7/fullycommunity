import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() showBreadcrumb = true;
  @Input() breadcrumbItems: { label: string; route?: string }[] = [];
  @Input() actions?: any[];
  @Input() loading = false;
  @Input() error?: string;
}