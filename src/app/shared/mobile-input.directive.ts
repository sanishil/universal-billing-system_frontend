import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/** Indian mobile number: 10 digits starting 6–9 (same rule as the backend) */
export const MOBILE_PATTERN = /^[6-9]\d{9}$/;
export const MOBILE_ERROR = 'Enter a 10-digit mobile number, e.g. 9876543210.';

/**
 * Keeps digits only and drops a +91 / 91 / 0 prefix, then caps at 10 digits.
 * "+91 98765-43210" → "9876543210".
 */
export function toMobileDigits(value: string | null | undefined): string {
  let digits = (value ?? '').replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length > 10 && digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/**
 * <input appMobileInput> — a mobile number box that only ever holds up to 10 digits.
 * Works with [(ngModel)] and formControlName. Typing letters or an 11th digit does nothing,
 * and a pasted "+91 98765 43210" becomes "9876543210".
 */
@Directive({
  selector: 'input[appMobileInput]',
  standalone: true,
  host: {
    type: 'tel',
    inputmode: 'numeric',
    maxlength: '15', // room to paste "+91 98765 43210"; trimmed to 10 straight away
    autocomplete: 'tel-national'
  }
})
export class MobileInputDirective {
  private el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    const clean = toMobileDigits(input.value);
    if (clean === input.value) return;
    input.value = clean;
    // Fire input again so ngModel / reactive forms pick up the cleaned value
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
