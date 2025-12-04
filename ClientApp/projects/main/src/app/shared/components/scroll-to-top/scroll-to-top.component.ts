import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      <button 
        class="scroll-to-top-btn"
        (click)="scrollToTop()"
        title="Scroll to top"
        aria-label="Scroll to top">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
      </button>
    }
  `,
  styles: [`
    .scroll-to-top-btn {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #FF6900;
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(255, 105, 0, 0.3);
      transition: all 0.3s ease;
      z-index: 1000;
      animation: fadeInUp 0.3s ease;

      svg {
        width: 24px;
        height: 24px;
      }

      &:hover {
        background: #E85F00;
        transform: translateY(-4px);
        box-shadow: 0 6px 16px rgba(255, 105, 0, 0.4);
      }

      &:active {
        transform: translateY(-2px);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .scroll-to-top-btn {
        bottom: 1rem;
        right: 1rem;
        width: 40px;
        height: 40px;

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }

    @media (prefers-color-scheme: dark) {
      .scroll-to-top-btn {
        box-shadow: 0 4px 12px rgba(255, 105, 0, 0.5);

        &:hover {
          box-shadow: 0 6px 16px rgba(255, 105, 0, 0.6);
        }
      }
    }
  `]
})
export class ScrollToTopComponent {
  isVisible = signal(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isVisible.set(scrollPosition > 300);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
