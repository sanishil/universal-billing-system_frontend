import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Bill } from '../models/bill';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  generatePdf(bill: Bill): Observable<{ url: string; filename: string }> {
    const filename = `Invoice-${bill.id}.pdf`;
    return of({
      url: '#',
      filename
    });
  }

  printInvoice(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
