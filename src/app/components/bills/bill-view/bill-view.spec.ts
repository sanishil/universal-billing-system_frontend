import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillView } from './bill-view';

describe('BillView', () => {
  let component: BillView;
  let fixture: ComponentFixture<BillView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillView],
    }).compileComponents();

    fixture = TestBed.createComponent(BillView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
