import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { BillService } from '../../../services/bill.service';
import { ToastService } from '../../../services/toast.service';

/** To / CC / message / attach-PDF form → POST /bills/:id/send-email */
@Component({
  selector: 'app-send-bill-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-bill-dialog.html',
  styleUrl: './send-bill-dialog.css'
})
export class SendBillDialogComponent implements OnInit {
  private billService = inject(BillService);
  private toast = inject(ToastService);

  @Input({ required: true }) billId!: string;
  /** Pre-fills "To"; usually the customer's email */
  @Input() defaultTo = '';

  @Output() closed = new EventEmitter<void>();
  /** Emits after the backend accepts the email (status QUEUED) */
  @Output() sent = new EventEmitter<void>();

  to = '';
  cc = '';
  message = '';
  attachPdf = true;
  isSending = false;

  ngOnInit(): void {
    this.to = this.defaultTo;
  }

  send(): void {
    const to = this.to.trim();
    if (!to) {
      this.toast.error('Please enter the recipient email address.');
      return;
    }

    const cc = this.cc.split(',').map(e => e.trim()).filter(Boolean);
    this.isSending = true;
    this.billService.sendEmail(this.billId, {
      to,
      cc: cc.length ? cc : undefined,
      message: this.message.trim() || undefined,
      attachPdf: this.attachPdf
    })
    .pipe(finalize(() => { this.isSending = false; }))
    .subscribe({
      next: () => {
        this.toast.success(`Bill is being sent to ${to}`);
        this.sent.emit();
        this.closed.emit();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Could not send the bill. Please try again.');
      }
    });
  }
}
