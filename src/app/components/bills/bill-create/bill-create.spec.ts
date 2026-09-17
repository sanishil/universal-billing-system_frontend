import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillCreate } from './bill-create';

describe('BillCreate', () => {
  let component: BillCreate;
  let fixture: ComponentFixture<BillCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(BillCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
