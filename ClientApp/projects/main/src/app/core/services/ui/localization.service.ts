import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { DOCUMENT } from '@angular/common';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  isRtl: boolean;
  isActive: boolean;
}

export interface Translations {
  [key: string]: string | Translations;
}

@Injectable({ providedIn: 'root' })
export class LocalizationService {
  private http = inject(HttpClient);
  private document = inject(DOCUMENT);
  private baseUrl = `${environment.apiUrl}/api/localization`;

  private _currentLang = signal<string>(this.getStoredLanguage());
  private _translations = signal<Translations>({});
  private _isLoading = signal(false);

  currentLang = this._currentLang.asReadonly();
  translations = this._translations.asReadonly();
  isLoading = this._isLoading.asReadonly();

  isRtl = computed(() => this._currentLang() === 'ar');

  languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', isRtl: false, isActive: true },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRtl: true, isActive: true }
  ];

  constructor() {
    this.loadTranslations(this._currentLang());
  }

  private getStoredLanguage(): string {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  }

  private _transitionTimeout: any;

  async setLanguage(langCode: string): Promise<void> {
    if (langCode === this._currentLang()) return;

    this._isLoading.set(true);

    // Clear any existing transition timeout
    if (this._transitionTimeout) {
      clearTimeout(this._transitionTimeout);
      this._transitionTimeout = null;
    }

    // Add transition class for smooth RTL/LTR switch
    const html = this.document.documentElement;
    html.classList.add('switching-direction');

    // Small delay for transition class to take effect
    await new Promise(resolve => setTimeout(resolve, 100));

    this._currentLang.set(langCode);
    localStorage.setItem('language', langCode);

    await this.loadTranslations(langCode);
    this.applyDirection(langCode);

    // Remove transition class after animation completes (match CSS duration of 800ms)
    this._transitionTimeout = setTimeout(() => {
      html.classList.remove('switching-direction');
      this._isLoading.set(false);
      this._transitionTimeout = null;
    }, 850);
  }

  private async loadTranslations(langCode: string): Promise<void> {
    this._isLoading.set(true);
    try {
      const translations = await this.http
        .get<Translations>(`${this.baseUrl}/translations/${langCode}`)
        .toPromise();
      this._translations.set(translations || {});
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Load fallback from local
      this.loadLocalTranslations(langCode);
    } finally {
      this._isLoading.set(false);
    }
  }

  private async loadLocalTranslations(langCode: string): Promise<void> {
    try {
      // Try to load from local assets first
      const localTranslations = await this.http
        .get<Translations>(`/assets/i18n/${langCode}.json`)
        .toPromise();
      this._translations.set(localTranslations || {});
    } catch {
      // Ultimate fallback translations
      const fallback: Record<string, Translations> = {
        en: {
          common: {
            home: 'Home', search: 'Search', login: 'Login', logout: 'Logout',
            settings: 'Settings', profile: 'Profile', loading: 'Loading...',
            save: 'Save', cancel: 'Cancel', edit: 'Edit', delete: 'Delete',
            create: 'Create', update: 'Update', back: 'Back', next: 'Next'
          },
          navigation: {
            community: 'Community', videos: 'Videos', marketplace: 'Marketplace',
            podcasts: 'Podcasts', services: 'Services', news: 'News', events: 'Events'
          },
          podcasts: {
            title: 'Podcasts', browse: 'Browse Podcasts', search: 'Search podcasts...',
            categories: 'Categories', allCategories: 'All Categories', episodes: 'episodes',
            subscribe: 'Subscribe', subscribed: 'Subscribed', play: 'Play', pause: 'Pause',
            noPodcasts: 'No podcasts found', tryDifferentFilters: 'Try different filters or search terms.',
            clearFilters: 'Clear Filters', loadMore: 'Load More', mostPopular: 'Most Popular',
            highestRated: 'Highest Rated', mostSubscribers: 'Most Subscribers', newest: 'Newest'
          }
        },
        ar: {
          common: {
            home: 'الرئيسية', search: 'بحث', login: 'تسجيل الدخول', logout: 'تسجيل الخروج',
            settings: 'الإعدادات', profile: 'الملف الشخصي', loading: 'جاري التحميل...',
            save: 'حفظ', cancel: 'إلغاء', edit: 'تعديل', delete: 'حذف',
            create: 'إنشاء', update: 'تحديث', back: 'رجوع', next: 'التالي'
          },
          navigation: {
            community: 'المجتمع', videos: 'الفيديوهات', marketplace: 'السوق',
            podcasts: 'البودكاست', services: 'الخدمات', news: 'الأخبار', events: 'الفعاليات'
          },
          podcasts: {
            title: 'البودكاست', browse: 'تصفح البودكاست', search: 'البحث في البودكاست...',
            categories: 'الفئات', allCategories: 'جميع الفئات', episodes: 'حلقات',
            subscribe: 'اشتراك', subscribed: 'مشترك', play: 'تشغيل', pause: 'إيقاف',
            noPodcasts: 'لم يتم العثور على بودكاست', tryDifferentFilters: 'جرب مرشحات أو مصطلحات بحث مختلفة.',
            clearFilters: 'مسح المرشحات', loadMore: 'تحميل المزيد', mostPopular: 'الأكثر شعبية',
            highestRated: 'الأعلى تقييماً', mostSubscribers: 'الأكثر اشتراكاً', newest: 'الأحدث'
          }
        }
      };
      this._translations.set(fallback[langCode] || fallback['en']);
    }
  }

  private applyDirection(langCode: string): void {
    const isRtl = langCode === 'ar';
    const html = this.document.documentElement;

    html.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    html.setAttribute('lang', langCode);

    if (isRtl) {
      html.classList.add('rtl');
      html.classList.remove('ltr');
    } else {
      html.classList.add('ltr');
      html.classList.remove('rtl');
    }
  }

  t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: any = this._translations();

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== 'string') return key;

    // Replace parameters
    if (params) {
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(new RegExp(`{${k}}`, 'g'), String(v)),
        value
      );
    }

    return value;
  }

  init(): void {
    this.applyDirection(this._currentLang());
  }
}
