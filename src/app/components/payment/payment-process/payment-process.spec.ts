import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentProcess } from './payment-process';

describe('PaymentProcess', () => {
  let component: PaymentProcess;
  let fixture: ComponentFixture<PaymentProcess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentProcess],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentProcess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
