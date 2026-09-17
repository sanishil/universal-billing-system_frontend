import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillList } from './bill-list';

describe('BillList', () => {
  let component: BillList;
  let fixture: ComponentFixture<BillList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillList],
    }).compileComponents();

    fixture = TestBed.createComponent(BillList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
