import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { AuthLayoutComponent } from '../../../shared/components/auth-layout/auth-layout.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { mapApiValidationErrorsToForm } from '../../../shared/utils/form-error-mapper';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthLayoutComponent, TranslatePipe],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  submitErrorKey: string | null = null;
  showPassword = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        country: [''],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator('password', 'password_confirmation') }
    );
  }

  get nameControl() {
    return this.registerForm.get('name');
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get phoneControl() {
    return this.registerForm.get('phone');
  }

  get countryControl() {
    return this.registerForm.get('country');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  get passwordConfirmationControl() {
    return this.registerForm.get('password_confirmation');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submitRegister(): void {
    if (this.registerForm.invalid || this.isSubmitting) return;
    this.isSubmitting = true;
    this.submitErrorKey = null;

    this.authService.customerRegister(this.registerForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl('/cars');
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        if (mapApiValidationErrorsToForm(this.registerForm, error)) return;
        this.submitErrorKey = 'error_server';
      },
    });
  }
}
