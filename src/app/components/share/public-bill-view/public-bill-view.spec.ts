import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicBillView } from './public-bill-view';

describe('PublicBillView', () => {
  let component: PublicBillView;
  let fixture: ComponentFixture<PublicBillView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicBillView],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicBillView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
