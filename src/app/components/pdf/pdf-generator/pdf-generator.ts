import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pdf-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pdf-generator.html',
  styleUrl: './pdf-generator.css'
})
export class PdfGeneratorComponent {
  selectedBill = '';
  emailPdf = true;
  smsPdf = false;
  downloadPdf = false;
  template = 'standard';
  language = 'en';
  letterhead = true;
  signature = false;
  watermark = false;

  previewPdf() {
    // Preview logic here
    console.log('Preview PDF for:', this.selectedBill);
  }

  generateAndSend() {
    if (!this.selectedBill) return;
    console.log('Generating PDF for:', this.selectedBill, {
      email: this.emailPdf,
      sms: this.smsPdf,
      download: this.downloadPdf,
      template: this.template,
      language: this.language
    });
  }
}