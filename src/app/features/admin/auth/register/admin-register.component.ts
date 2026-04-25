import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthLayoutComponent } from '../../../../shared/components/auth-layout/auth-layout.component';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { mapApiValidationErrorsToForm } from '../../../../shared/utils/form-error-mapper';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthLayoutComponent, TranslatePipe],
  templateUrl: './admin-register.component.html',
})
export class AdminRegisterComponent {
  adminRegisterForm: FormGroup;
  isSubmitting = false;
  submitErrorKey: string | null = null;
  showPassword = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.adminRegisterForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        country: [''],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator('password', 'password_confirmation') },
    );
  }

  get nameControl() {
    return this.adminRegisterForm.get('name');
  }

  get emailControl() {
    return this.adminRegisterForm.get('email');
  }

  get phoneControl() {
    return this.adminRegisterForm.get('phone');
  }

  get countryControl() {
    return this.adminRegisterForm.get('country');
  }

  get passwordControl() {
    return this.adminRegisterForm.get('password');
  }

  get passwordConfirmationControl() {
    return this.adminRegisterForm.get('password_confirmation');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submitAdminRegister(): void {
    if (this.adminRegisterForm.invalid || this.isSubmitting) return;
    this.isSubmitting = true;
    this.submitErrorKey = null;

    this.authService.adminRegister(this.adminRegisterForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl('/admin/users');
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        if (mapApiValidationErrorsToForm(this.adminRegisterForm, error)) return;
        this.submitErrorKey = 'error_server';
      },
    });
  }
}
