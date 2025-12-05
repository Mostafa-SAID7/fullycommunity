import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface LottieAnimation {
  id: string;
  name: string;
  path: string;
  loop: boolean;
  autoplay: boolean;
  speed: number;
}

export interface LottiePlayer {
  loadAnimation(params: any): any;
  destroy(): void;
  play(): void;
  pause(): void;
  stop(): void;
  setSpeed(speed: number): void;
  setDirection(direction: 1 | -1): void;
  goToAndStop(frame: number): void;
  goToAndPlay(frame: number): void;
}

@Injectable({
  providedIn: 'root'
})
export class LottieService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private lottiePlayer?: any;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadedSubject = new BehaviorSubject<boolean>(false);

  // Signals for reactive state
  public readonly isLoading = signal<boolean>(false);
  public readonly isLoaded = signal<boolean>(false);

  // Observables
  public readonly loading$ = this.loadingSubject.asObservable();
  public readonly loaded$ = this.loadedSubject.asObservable();

  // Animation registry
  private animations = new Map<string, any>();
  private preloadedAnimations = new Map<string, any>();

  // Predefined animations for the car community app
  private readonly PREDEFINED_ANIMATIONS: LottieAnimation[] = [
    {
      id: 'loading-car',
      name: 'Loading Car',
      path: '/assets/animations/loading-car.json',
      loop: true,
      autoplay: true,
      speed: 1
    },
    {
      id: 'success-checkmark',
      name: 'Success Checkmark',
      path: '/assets/animations/success-checkmark.json',
      loop: false,
      autoplay: true,
      speed: 1
    },
    {
      id: 'error-cross',
      name: 'Error Cross',
      path: '/assets/animations/error-cross.json',
      loop: false,
      autoplay: true,
      speed: 1
    },
    {
      id: 'empty-state',
      name: 'Empty State',
      path: '/assets/animations/empty-state.json',
      loop: true,
      autoplay: true,
      speed: 0.8
    },
    {
      id: 'car-driving',
      name: 'Car Driving',
      path: '/assets/animations/car-driving.json',
      loop: true,
      autoplay: true,
      speed: 1
    },
    {
      id: 'garage-tools',
      name: 'Garage Tools',
      path: '/assets/animations/garage-tools.json',
      loop: true,
      autoplay: true,
      speed: 0.5
    },
    {
      id: 'fuel-pump',
      name: 'Fuel Pump',
      path: '/assets/animations/fuel-pump.json',
      loop: true,
      autoplay: true,
      speed: 1
    },
    {
      id: 'electric-car',
      name: 'Electric Car',
      path: '/assets/animations/electric-car.json',
      loop: true,
      autoplay: true,
      speed: 1
    },
    {
      id: 'marketplace-cart',
      name: 'Shopping Cart',
      path: '/assets/animations/marketplace-cart.json',
      loop: false,
      autoplay: false,
      speed: 1.2
    },
    {
      id: 'chat-typing',
      name: 'Chat Typing',
      path: '/assets/animations/chat-typing.json',
      loop: true,
      autoplay: true,
      speed: 1
    }
  ];

  constructor() {
    if (this.isBrowser) {
      this.loadLottiePlayer();
    }
  }

  private async loadLottiePlayer(): Promise<void> {
    if (this.lottiePlayer || !this.isBrowser) {
      return;
    }

    this.isLoading.set(true);
    this.loadingSubject.next(true);

    try {
      // Dynamically import lottie-web
      const lottie = await import('lottie-web');
      this.lottiePlayer = lottie.default;
      
      this.isLoaded.set(true);
      this.loadedSubject.next(true);
      
      console.log('Lottie player loaded successfully');
    } catch (error) {
      console.error('Failed to load Lottie player:', error);
    } finally {
      this.isLoading.set(false);
      this.loadingSubject.next(false);
    }
  }

  async createAnimation(config: {
    container: HTMLElement;
    animationId?: string;
    path?: string;
    animationData?: any;
    loop?: boolean;
    autoplay?: boolean;
    speed?: number;
    renderer?: 'svg' | 'canvas' | 'html';
  }): Promise<any> {
    await this.loadLottiePlayer();

    if (!this.lottiePlayer) {
      throw new Error('Lottie player not available');
    }

    const animationConfig = {
      container: config.container,
      renderer: config.renderer || 'svg',
      loop: config.loop ?? true,
      autoplay: config.autoplay ?? true,
      path: config.path,
      animationData: config.animationData
    };

    // Use predefined animation if animationId is provided
    if (config.animationId) {
      const predefined = this.PREDEFINED_ANIMATIONS.find(a => a.id === config.animationId);
      if (predefined) {
        animationConfig.path = predefined.path;
        animationConfig.loop = predefined.loop;
        animationConfig.autoplay = predefined.autoplay;
      }
    }

    const animation = this.lottiePlayer.loadAnimation(animationConfig);

    if (config.speed) {
      animation.setSpeed(config.speed);
    }

    // Store animation reference
    if (config.animationId) {
      this.animations.set(config.animationId, animation);
    }

    return animation;
  }

  async preloadAnimation(animationId: string): Promise<void> {
    const predefined = this.PREDEFINED_ANIMATIONS.find(a => a.id === animationId);
    if (!predefined) {
      throw new Error(`Animation ${animationId} not found`);
    }

    try {
      const response = await fetch(predefined.path);
      const animationData = await response.json();
      this.preloadedAnimations.set(animationId, animationData);
    } catch (error) {
      console.error(`Failed to preload animation ${animationId}:`, error);
      throw error;
    }
  }

  async preloadCommonAnimations(): Promise<void> {
    const commonAnimations = [
      'loading-car',
      'success-checkmark',
      'error-cross',
      'empty-state'
    ];

    const preloadPromises = commonAnimations.map(id => 
      this.preloadAnimation(id).catch(error => 
        console.warn(`Failed to preload ${id}:`, error)
      )
    );

    await Promise.allSettled(preloadPromises);
  }

  getAnimation(animationId: string): any {
    return this.animations.get(animationId);
  }

  destroyAnimation(animationId: string): void {
    const animation = this.animations.get(animationId);
    if (animation) {
      animation.destroy();
      this.animations.delete(animationId);
    }
  }

  destroyAllAnimations(): void {
    this.animations.forEach(animation => animation.destroy());
    this.animations.clear();
  }

  // Utility methods for common animations
  async createLoadingAnimation(container: HTMLElement): Promise<any> {
    return this.createAnimation({
      container,
      animationId: 'loading-car',
      loop: true,
      autoplay: true,
      speed: 1
    });
  }

  async createSuccessAnimation(container: HTMLElement): Promise<any> {
    return this.createAnimation({
      container,
      animationId: 'success-checkmark',
      loop: false,
      autoplay: true,
      speed: 1.2
    });
  }

  async createErrorAnimation(container: HTMLElement): Promise<any> {
    return this.createAnimation({
      container,
      animationId: 'error-cross',
      loop: false,
      autoplay: true,
      speed: 1
    });
  }

  async createEmptyStateAnimation(container: HTMLElement): Promise<any> {
    return this.createAnimation({
      container,
      animationId: 'empty-state',
      loop: true,
      autoplay: true,
      speed: 0.8
    });
  }

  // Animation control methods
  playAnimation(animationId: string): void {
    const animation = this.animations.get(animationId);
    if (animation) {
      animation.play();
    }
  }

  pauseAnimation(animationId: string): void {
    const animation = this.animations.get(animationId);
    if (animation) {
      animation.pause();
    }
  }

  stopAnimation(animationId: string): void {
    const animation = this.animations.get(animationId);
    if (animation) {
      animation.stop();
    }
  }

  setAnimationSpeed(animationId: string, speed: number): void {
    const animation = this.animations.get(animationId);
    if (animation) {
      animation.setSpeed(speed);
    }
  }

  setAnimationDirection(animationId: string, direction: 1 | -1): void {
    const animation = this.animations.get(animationId);
    if (animation) {
      animation.setDirection(direction);
    }
  }

  goToFrame(animationId: string, frame: number, play: boolean = false): void {
    const animation = this.animations.get(animationId);
    if (animation) {
      if (play) {
        animation.goToAndPlay(frame);
      } else {
        animation.goToAndStop(frame);
      }
    }
  }

  // Get available animations
  getAvailableAnimations(): LottieAnimation[] {
    return [...this.PREDEFINED_ANIMATIONS];
  }

  // Check if animation exists
  hasAnimation(animationId: string): boolean {
    return this.PREDEFINED_ANIMATIONS.some(a => a.id === animationId);
  }

  // Get animation info
  getAnimationInfo(animationId: string): LottieAnimation | undefined {
    return this.PREDEFINED_ANIMATIONS.find(a => a.id === animationId);
  }

  // Observable for checking if specific animation is loaded
  isAnimationLoaded(animationId: string): Observable<boolean> {
    return of(this.preloadedAnimations.has(animationId));
  }

  // Load animation data as observable
  loadAnimationData(path: string): Observable<any> {
    if (!this.isBrowser) {
      return of(null);
    }

    return from(fetch(path).then(response => response.json())).pipe(
      catchError(error => {
        console.error('Failed to load animation data:', error);
        return of(null);
      })
    );
  }
}