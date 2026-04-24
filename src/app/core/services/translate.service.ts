import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import enTranslations from '../../i18n/en.json';
import arTranslations from '../../i18n/ar.json';

type TranslationKey = keyof typeof enTranslations;
type SupportedLanguage = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private activeLanguage = new BehaviorSubject<SupportedLanguage>('en');
  private translations: Record<string, string> = enTranslations;

  language$ = this.activeLanguage.asObservable();

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  initLanguage(): void {
    const storedLanguage = isPlatformBrowser(this.platformId)
      ? (localStorage.getItem('lang') as SupportedLanguage | null)
      : null;
    this.setLanguage(storedLanguage ?? 'en');
  }

  setLanguage(language: SupportedLanguage): void {
    this.translations = language === 'ar' ? arTranslations : enTranslations;
    this.activeLanguage.next(language);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', language);
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }

  translate(key: string): string {
    return (this.translations as Record<string, string>)[key] ?? key;
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.activeLanguage.getValue();
  }
}
