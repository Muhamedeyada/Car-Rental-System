import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthLayoutComponent } from '../../../../shared/components/auth-layout/auth-layout.component';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { mapApiValidationErrorsToForm } from '../../../../shared/utils/form-error-mapper';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthLayoutComponent, TranslatePipe],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent {
  adminLoginForm: FormGroup;
  isSubmitting = false;
  submitErrorKey: string | null = null;
  showPassword = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.adminLoginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get emailControl() {
    return this.adminLoginForm.get('email');
  }

  get passwordControl() {
    return this.adminLoginForm.get('password');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submitAdminLogin(): void {
    if (this.adminLoginForm.invalid || this.isSubmitting) return;
    this.isSubmitting = true;
    this.submitErrorKey = null;

    this.authService.adminLogin(this.adminLoginForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl('/admin/users');
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        if (mapApiValidationErrorsToForm(this.adminLoginForm, error)) return;
        this.submitErrorKey = error.status === 401 ? 'auth_invalid_credentials' : 'error_server';
      },
    });
  }
}
