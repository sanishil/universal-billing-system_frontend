import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationHistory } from './notification-history';

describe('NotificationHistory', () => {
  let component: NotificationHistory;
  let fixture: ComponentFixture<NotificationHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
