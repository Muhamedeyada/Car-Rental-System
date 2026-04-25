import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { AuthLayoutComponent } from '../../../shared/components/auth-layout/auth-layout.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { mapApiValidationErrorsToForm } from '../../../shared/utils/form-error-mapper';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthLayoutComponent, TranslatePipe],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  submitErrorKey: string | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  submitLogin(): void {
    if (this.loginForm.invalid || this.isSubmitting) return;
    this.isSubmitting = true;
    this.submitErrorKey = null;

    this.authService.customerLogin(this.loginForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl('/cars');
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        if (mapApiValidationErrorsToForm(this.loginForm, error)) return;
        this.submitErrorKey = error.status === 401 ? 'auth_invalid_credentials' : 'error_server';
      },
    });
  }
}
