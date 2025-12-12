import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-link',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-link.component.html',
  styleUrl: './nav-link.component.scss'
})
export class NavLinkComponent {
  @Input() href?: string;
  @Input() routerLink?: string | string[];
  @Input() label!: string;
  @Input() icon?: string;
  @Input() active = false;
  @Input() disabled = false;
  @Input() external = false;
  @Input() target?: '_blank' | '_self' | '_parent' | '_top';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'primary' | 'secondary' | 'ghost' = 'default';
  @Input() badge?: string | number;
  @Input() showArrow = false;

  getClasses(): string {
    const classes = ['nav-link'];
    
    classes.push(`nav-link-${this.size}`);
    classes.push(`nav-link-${this.variant}`);
    
    if (this.active) classes.push('nav-link-active');
    if (this.disabled) classes.push('nav-link-disabled');
    if (this.icon) classes.push('nav-link-with-icon');
    if (this.badge) classes.push('nav-link-with-badge');
    
    return classes.join(' ');
  }

  isExternalLink(): boolean {
    return this.external || (this.href?.startsWith('http') ?? false);
  }
}