import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validURL(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  try {
    const url = new URL(value.startsWith('http') ? value : 'https://' + value);
    return null;
  } catch (_) {
    return { invalidUrl: true };
  }
}
