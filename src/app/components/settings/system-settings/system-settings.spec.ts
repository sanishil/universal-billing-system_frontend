import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemSettings } from './system-settings';

describe('SystemSettings', () => {
  let component: SystemSettings;
  let fixture: ComponentFixture<SystemSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
