import { Component, signal, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from '../../../shared/components/admin-header/admin-header.component';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { ToastContainerComponent } from '../../../shared/components/toast-container/toast-container.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminHeaderComponent, AdminSidebarComponent, ToastContainerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  
  sidebarOpen = signal(true);
  isMobileScreen = signal(false);

  ngOnInit() {
    // Check if screen is mobile for overlay behavior only
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .subscribe(result => {
        this.isMobileScreen.set(result.matches);
        // Note: We no longer auto-close/open sidebar based on screen size
        // The sidebar behaves the same on all screen sizes (icon-only when closed, full when open)
      });
  }

  ngOnDestroy() {
    // Cleanup handled by breakpointObserver automatically
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
