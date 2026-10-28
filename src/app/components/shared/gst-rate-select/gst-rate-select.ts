import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DEFAULT_GST_RATES } from '../../../services/settings.service';

/**
 * "No GST" + allowed rates. Value is number | null, where null = No GST.
 * Options use [ngValue] so "No GST" emits a real null, not the string "null".
 */
@Component({
  selector: 'app-gst-rate-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <select
      class="ubs-select"
      [ngModel]="value"
      (ngModelChange)="select($event)"
      (blur)="onTouched()"
      [disabled]="disabled"
    >
      <option [ngValue]="null">No GST (Bill of Supply)</option>
      <option *ngFor="let r of rates" [ngValue]="r">{{ r }}% GST</option>
    </select>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GstRateSelectComponent), multi: true }
  ]
})
export class GstRateSelectComponent implements ControlValueAccessor {
  /** Allowed rates from System Settings */
  @Input() rates: number[] = DEFAULT_GST_RATES;

  value: number | null = null;
  disabled = false;

  private onChange: (value: number | null) => void = () => {};
  onTouched: () => void = () => {};

  select(value: number | null): void {
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: number | null | undefined): void {
    this.value = value ?? null;
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
