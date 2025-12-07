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
      background: rgba(209, 52, 56, 0.9);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(209, 52, 56, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
      animation: fadeInUp 0.3s ease;

      svg {
        width: 24px;
        height: 24px;
      }

      &:hover {
        background: rgb(209, 52, 56);
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(209, 52, 56, 0.4);
      }

      &:active {
        transform: scale(0.95);
        opacity: 0.95;
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
        bottom: 1.5rem;
        right: 1.5rem;
        width: 44px;
        height: 44px;

        svg {
          width: 22px;
          height: 22px;
        }
      }
    }

    @media (prefers-color-scheme: dark) {
      .scroll-to-top-btn {
        background: rgba(248, 113, 113, 0.9);
        box-shadow: 0 4px 12px rgba(248, 113, 113, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);

        &:hover {
          background: rgb(248, 113, 113);
          box-shadow: 0 8px 24px rgba(248, 113, 113, 0.4);
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
