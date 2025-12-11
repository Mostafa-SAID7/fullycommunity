import { Component, signal, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from '../../../shared/components/admin-header/admin-header.component';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { ToastContainerComponent } from '../../../shared/components/toast-container/toast-container.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminHeaderComponent, AdminSidebarComponent, ToastContainerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();
  
  sidebarOpen = signal(true);
  isMobileScreen = signal(false);

  ngOnInit() {
    // Check initial screen size
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 960; // Breakpoints.Handset/TabletPortrait threshold
      this.isMobileScreen.set(isMobile);
      // On mobile, start with sidebar closed (hidden)
      if (isMobile) {
        this.sidebarOpen.set(false);
      }
    }
    
    // Monitor screen size changes
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        const wasMobile = this.isMobileScreen();
        this.isMobileScreen.set(result.matches);
        
        // When switching to mobile, close sidebar (it will slide in when toggled)
        if (result.matches && !wasMobile) {
          this.sidebarOpen.set(false);
        }
        // When switching to desktop, open sidebar
        if (!result.matches && wasMobile) {
          this.sidebarOpen.set(true);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
    
    // On mobile, provide haptic feedback if available
    if (this.isMobileScreen() && 'vibrate' in navigator) {
      navigator.vibrate(50); // Short vibration for feedback
    }
  }

  getSidebarClasses(): string {
    return '';
  }

  isMobile(): boolean {
    return this.isMobileScreen();
  }
}
