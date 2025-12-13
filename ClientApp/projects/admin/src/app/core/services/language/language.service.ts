import { Injectable, signal, inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Language = 'en' | 'ar';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private readonly LANG_KEY = 'admin-language';
    private platformId = inject(PLATFORM_ID);

    language = signal<Language>('en');

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            // Load saved language or default to 'en'
            const savedLang = (localStorage.getItem(this.LANG_KEY) as Language) || 'en';
            const validLang = ['en', 'ar'].includes(savedLang) ? savedLang : 'en';
            this.language.set(validLang);

            // Effect to update document attributes when language changes
            effect(() => {
                this.updateDocumentAttributes();
            });

            this.updateDocumentAttributes();
        }
    }

    setLanguage(lang: Language): void {
        if (isPlatformBrowser(this.platformId)) {
            this.language.set(lang);
            localStorage.setItem(this.LANG_KEY, lang);
        }
    }

    toggleLanguage(): void {
        const currentLang = this.language();
        this.setLanguage(currentLang === 'en' ? 'ar' : 'en');
    }

    private updateDocumentAttributes(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const lang = this.language();
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        const htmlElement = document.documentElement;

        htmlElement.setAttribute('lang', lang);
        htmlElement.setAttribute('dir', dir);
    }

    getLanguageLabel(): string {
        return this.language() === 'en' ? 'English' : 'Arabic';
    }

    getLanguageIcon(): string {
        return this.language() === 'en' ? 'En' : 'ع';
    }
}
