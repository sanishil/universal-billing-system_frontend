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

            @page {
              size: A4 portrait;
              margin: 8mm 10mm;
            }

            * { box-sizing: border-box; }

            html, body {
              margin: 0;
              padding: 0;
              background: #fff;
              font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
              font-size: 11px;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            /* Scale down the invoice sheet to fit one page */
            .ubs-invoice-sheet {
              box-shadow: none !important;
              border-radius: 0 !important;
              padding: 20px 24px !important;
              max-width: 100% !important;
              width: 100% !important;
              page-break-inside: avoid;
            }

            /* Tighten header */
            .ubs-sheet-company   { font-size: 0.95rem !important; }
            .ubs-sheet-subtext   { font-size: 0.7rem !important; }
            .ubs-meta-badge      { font-size: 0.75rem !important; }
            .ubs-meta-id         { font-size: 1rem !important; }
            .ubs-meta-line       { font-size: 0.7rem !important; }
            .ubs-meta-copy-type  { font-size: 0.65rem !important; }

            /* Divider */
            .ubs-sheet-divider   { margin: 12px 0 !important; }

            /* Address blocks */
            .ubs-sheet-addresses { margin-bottom: 12px !important; }
            .ubs-block-name      { font-size: 0.85rem !important; }
            .ubs-block-line      { font-size: 0.7rem !important; margin-bottom: 1px !important; }
            .ubs-block-label     { font-size: 0.6rem !important; }

            /* Table */
            .ubs-sheet-table-wrap { margin-bottom: 14px !important; }
            .ubs-sheet-table th  { padding: 7px 10px !important; font-size: 0.65rem !important; }
            .ubs-sheet-table td  { padding: 7px 10px !important; font-size: 0.75rem !important; }
            .ubs-hsn-badge       { font-size: 0.65rem !important; padding: 1px 5px !important; }
            .ubs-item-name       { font-size: 0.75rem !important; }

            /* Bottom section */
            .ubs-sheet-bottom    { gap: 16px !important; }

            /* Notes / bank / UPI */
            .ubs-amount-words-box { padding: 5px 8px !important; margin-bottom: 8px !important; }
            .ubs-words-label     { font-size: 0.6rem !important; }
            .ubs-words-val       { font-size: 0.72rem !important; }
            .ubs-wire-info       { font-size: 0.65rem !important; padding: 6px 8px !important; line-height: 1.6 !important; }
            .ubs-upi-box         { padding: 8px 10px !important; margin-top: 8px !important; gap: 10px !important; }
            .ubs-upi-qr svg      { width: 52px !important; height: 52px !important; }
            .ubs-upi-title       { font-size: 0.7rem !important; }
            .ubs-upi-id          { font-size: 0.7rem !important; }
            .ubs-upi-sub         { font-size: 0.62rem !important; }

            /* Totals */
            .ubs-sheet-totals    { width: 260px !important; gap: 4px !important; }
            .ubs-total-line      { font-size: 0.75rem !important; padding: 2px 0 !important; }
            .ubs-grand-total     { font-size: 0.9rem !important; padding: 8px 0 5px !important; }
            .ubs-grand-total span:last-child { font-size: 1.1rem !important; }

            /* Signature */
            .ubs-signature-area  { margin-top: 12px !important; padding-top: 10px !important; }
            .ubs-sign-company    { font-size: 0.7rem !important; margin-bottom: 6px !important; }
            .ubs-sign-stamp-placeholder { padding: 4px 14px !important; margin: 3px 0 5px !important; }
            .ubs-stamp-badge     { font-size: 0.62rem !important; }
            .ubs-stamp-date      { font-size: 0.58rem !important; }
            .ubs-sign-label      { font-size: 0.65rem !important; }

            /* Watermark */
            .ubs-watermark span {
              font-size: 5rem !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          </style>
        </head>
        <body>
          ${invoiceEl.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }
}
