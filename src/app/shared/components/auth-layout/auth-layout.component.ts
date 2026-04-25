import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslateService } from '../../../core/services/translate.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [TranslatePipe, ToastComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  currentLanguage: 'en' | 'ar' = 'en';

  private themeSubscription?: Subscription;
  private languageSubscription?: Subscription;

  constructor(
    private readonly themeService: ThemeService,
    private readonly translateService: TranslateService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(value => {
      this.isDarkMode = value;
    });
    this.languageSubscription = this.translateService.language$.subscribe(value => {
      this.currentLanguage = value;
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    this.languageSubscription?.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    const nextLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.translateService.setLanguage(nextLanguage);
  }

  themeLabel(): string {
    return this.isDarkMode ? 'theme_toggle_light' : 'theme_toggle_dark';
  }

  languageLabel(): string {
    return this.currentLanguage === 'en' ? 'lang_switch_arabic' : 'lang_switch_english';
  }
}
