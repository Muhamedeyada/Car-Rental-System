import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(passwordKey: string, confirmKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const passwordControl = group.get(passwordKey);
    const confirmControl = group.get(confirmKey);
    if (!passwordControl || !confirmControl) return null;

    const passwordValue = passwordControl.value;
    const confirmValue = confirmControl.value;

    if (passwordValue && confirmValue && passwordValue !== confirmValue) {
      const existingErrors = confirmControl.errors ?? {};
      confirmControl.setErrors({ ...existingErrors, passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmControl.errors && confirmControl.errors['passwordMismatch']) {
      const updatedErrors = { ...confirmControl.errors };
      delete updatedErrors['passwordMismatch'];
      confirmControl.setErrors(Object.keys(updatedErrors).length > 0 ? updatedErrors : null);
    }

    return null;
  };
}
