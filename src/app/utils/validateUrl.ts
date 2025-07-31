import { AbstractControl, ValidationErrors } from '@angular/forms';
import { environment } from '@env/environment';

export function validURL(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  try {
    const url = new URL(value.startsWith('http') ? value : 'https://' + value);
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

// Utilidad para validar links externos de producto
// /utils/validateUrl.ts

/**
 * Valida si un link es válido para DOME Marketplace.
 * - El dominio debe coincidir con environment.DOME_MARKETPLACE
 * - Debe terminar con un UUID v4 válido
 * @param link string
 * @returns boolean
 */
export function isValidExternalProductLink(link: string): boolean {
  if (!link || typeof link !== 'string') return false;
  try {
    const url = new URL(link);
    // Validar dominio
    const expectedDomain = environment.DOME_MARKETPLACE.replace(/\/$/, '');
    const actualDomain = `${url.protocol}//${url.host}`;
    if (actualDomain !== expectedDomain) return false;
    // Validar UUID v4 al final del path
    const uuidV4Regex =
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return uuidV4Regex.test(url.pathname);
  } catch {
    return false;
  }
}
