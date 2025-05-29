import { AbstractControl, ValidationErrors } from "@angular/forms";

export function validURL(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  try {
    const url = new URL(value.startsWith("http") ? value : "https://" + value);
    // El hostname debe tener al menos un punto y extensión de 2 a 6 letras
    const domainPattern = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+\.[a-zA-Z]{2,6}$/;
    if (!domainPattern.test(url.hostname)) {
      return { invalidUrl: true };
    }
    return null;
  } catch (_) {
    return { invalidUrl: true };
  }
}
