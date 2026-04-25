import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslateService } from '../../../core/services/translate.service';
import { ToastComponent } from '../toast/toast.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ToastComponent, TranslatePipe],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  currentLanguage: 'en' | 'ar' = 'en';
  private themeSubscription?: Subscription;
  private languageSubscription?: Subscription;

  constructor(
    private readonly themeService: ThemeService,
    private readonly translateService: TranslateService,
    private readonly authService: AuthService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(v => (this.isDarkMode = v));
    this.languageSubscription = this.translateService.language$.subscribe(v => (this.currentLanguage = v));
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    this.languageSubscription?.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    this.translateService.setLanguage(this.currentLanguage === 'en' ? 'ar' : 'en');
  }

  themeLabel(): string {
    return this.isDarkMode ? 'theme_toggle_light' : 'theme_toggle_dark';
  }

  languageLabel(): string {
    return this.currentLanguage === 'en' ? 'lang_switch_arabic' : 'lang_switch_english';
  }

  logout(): void {
    this.authService.adminLogout().subscribe({
      next: () => this.router.navigateByUrl('/admin/login'),
      error: () => {
        this.authService.clearAuth();
        this.router.navigateByUrl('/admin/login');
      },
    });
  }
}
