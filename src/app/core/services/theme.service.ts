import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);

  isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  initTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      this.isDarkModeSubject.next(true);
    }
  }

  toggleTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    this.isDarkModeSubject.next(isDark);
  }

  isDarkMode(): boolean {
    return this.isDarkModeSubject.getValue();
  }
}
