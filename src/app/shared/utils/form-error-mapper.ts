import { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { IApiError } from '../../core/models/i-api-error.model';

export function mapApiValidationErrorsToForm(form: FormGroup, error: HttpErrorResponse): boolean {
  if (error.status !== 422) return false;
  const payload = error.error as IApiError | undefined;
  if (!payload?.errors) return false;

  Object.entries(payload.errors).forEach(([fieldName, messages]) => {
    const control = form.get(fieldName);
    if (control && messages.length > 0) {
      const existingErrors = control.errors ?? {};
      control.setErrors({ ...existingErrors, server: messages[0] });
      control.markAsTouched();
    }
  });

  return true;
}
