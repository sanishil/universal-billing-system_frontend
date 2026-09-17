import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationSettings } from './notification-settings';

describe('NotificationSettings', () => {
  let component: NotificationSettings;
  let fixture: ComponentFixture<NotificationSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
