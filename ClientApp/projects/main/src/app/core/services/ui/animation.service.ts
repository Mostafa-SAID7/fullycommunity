import { Injectable, signal, computed } from '@angular/core';

export type AnimationType = 'fade' | 'slide' | 'scale' | 'bounce' | 'none';
export type AnimationDirection = 'left' | 'right' | 'up' | 'down';

export interface AnimationConfig {
  type: AnimationType;
  direction?: AnimationDirection;
  duration?: number;
  easing?: string;
  disabled?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AnimationService {
  private _config = signal<AnimationConfig>({
    type: 'fade',
    direction: 'right',
    duration: 400,
    easing: 'ease-in-out',
    disabled: false
  });

  private _isRtl = signal(false);
  private _reducedMotion = signal(false);

  config = this._config.asReadonly();
  isRtl = this._isRtl.asReadonly();
  reducedMotion = this._reducedMotion.asReadonly();

  // Computed animation class based on config and RTL
  animationClass = computed(() => {
    const config = this._config();
    const isRtl = this._isRtl();
    const reducedMotion = this._reducedMotion();

    if (config.disabled || reducedMotion) {
      return 'no-animation';
    }

    let className = `animate-${config.type}`;
    
    if (config.direction) {
      // Adjust direction for RTL
      let direction = config.direction;
      if (isRtl && (direction === 'left' || direction === 'right')) {
        direction = direction === 'left' ? 'right' : 'left';
      }
      className += `-${direction}`;
    }

    return className;
  });

  constructor() {
    this.detectReducedMotion();
    this.detectRtl();
  }

  setAnimationType(type: AnimationType): void {
    this._config.update(config => ({ ...config, type }));
  }

  setAnimationDirection(direction: AnimationDirection): void {
    this._config.update(config => ({ ...config, direction }));
  }

  setAnimationDuration(duration: number): void {
    this._config.update(config => ({ ...config, duration }));
  }

  setAnimationConfig(config: Partial<AnimationConfig>): void {
    this._config.update(current => ({ ...current, ...config }));
  }

  disableAnimations(): void {
    this._config.update(config => ({ ...config, disabled: true }));
  }

  enableAnimations(): void {
    this._config.update(config => ({ ...config, disabled: false }));
  }

  setRtl(isRtl: boolean): void {
    this._isRtl.set(isRtl);
    this.updateCssVariables();
  }

  private detectReducedMotion(): void {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this._reducedMotion.set(mediaQuery.matches);
      
      mediaQuery.addEventListener('change', (e) => {
        this._reducedMotion.set(e.matches);
      });
    }
  }

  private detectRtl(): void {
    if (typeof document !== 'undefined') {
      const observer = new MutationObserver(() => {
        const isRtl = document.documentElement.dir === 'rtl';
        this._isRtl.set(isRtl);
        this.updateCssVariables();
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['dir']
      });

      // Initial check
      const isRtl = document.documentElement.dir === 'rtl';
      this._isRtl.set(isRtl);
      this.updateCssVariables();
    }
  }

  private updateCssVariables(): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const isRtl = this._isRtl();
      
      // Set CSS custom properties for RTL-aware animations
      root.style.setProperty('--slide-direction', isRtl ? '-100%' : '100%');
      root.style.setProperty('--slide-direction-reverse', isRtl ? '100%' : '-100%');
      root.style.setProperty('--animation-duration', `${this._config().duration}ms`);
      root.style.setProperty('--animation-easing', this._config().easing || 'ease-in-out');
    }
  }

  // Utility methods for common animation patterns
  getSlideDirection(forward: boolean = true): AnimationDirection {
    const isRtl = this._isRtl();
    
    if (forward) {
      return isRtl ? 'left' : 'right';
    } else {
      return isRtl ? 'right' : 'left';
    }
  }

  // Animation presets
  setFadeAnimation(): void {
    this.setAnimationConfig({ type: 'fade', duration: 300 });
  }

  setSlideAnimation(direction?: AnimationDirection): void {
    this.setAnimationConfig({ 
      type: 'slide', 
      direction: direction || this.getSlideDirection(),
      duration: 400 
    });
  }

  setScaleAnimation(): void {
    this.setAnimationConfig({ type: 'scale', duration: 350 });
  }

  setBounceAnimation(): void {
    this.setAnimationConfig({ type: 'bounce', duration: 600 });
  }
}