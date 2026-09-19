import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css'
})
export class PaymentSuccessComponent {
  transactionId = `TXN-UPI-${Math.floor(100000 + Math.random() * 900000)}`;
  utrNumber = `UTR${Date.now().toString().slice(-10)}`;
  processedDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}