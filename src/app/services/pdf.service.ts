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
    if (typeof window === 'undefined') return;

    const invoiceEl = document.querySelector('.ubs-invoice-sheet') as HTMLElement;
    if (!invoiceEl) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    // Collect all stylesheet links and style tags from the current page
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(el => el.outerHTML)
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Invoice</title>
          ${styles}
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { background: #fff; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .ubs-invoice-sheet { box-shadow: none !important; border-radius: 0 !important; padding: 40px !important; max-width: 100% !important; }
            .ubs-watermark span { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { margin: 10mm; size: A4; }
          </style>
        </head>
        <body>
          ${invoiceEl.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for fonts/styles to load then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }
}
