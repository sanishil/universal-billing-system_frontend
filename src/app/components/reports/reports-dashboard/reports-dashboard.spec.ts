import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsDashboard } from './reports-dashboard';

describe('ReportsDashboard', () => {
  let component: ReportsDashboard;
  let fixture: ComponentFixture<ReportsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
