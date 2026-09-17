import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillEdit } from './bill-edit';

describe('BillEdit', () => {
  let component: BillEdit;
  let fixture: ComponentFixture<BillEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(BillEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
