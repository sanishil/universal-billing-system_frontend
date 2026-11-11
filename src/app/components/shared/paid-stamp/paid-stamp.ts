import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Red "PAID / THANK YOU" rubber-stamp seal used as the watermark on paid invoices.
 * Inline SVG (not an <img>), so print and the PDF download capture it without fetching a file.
 */
@Component({
  selector: 'app-paid-stamp',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './paid-stamp.html',
  styles: [':host { display: block; } .paid-stamp-svg { display: block; width: 100%; height: auto; }']
})
export class PaidStampComponent {}
