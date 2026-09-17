import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RedirectIfAuthenticatedGuard } from './redirect-if-authenticated.guard';

describe('RedirectIfAuthenticatedGuard', () => {
  let component: RedirectIfAuthenticatedGuard;
  let fixture: ComponentFixture<RedirectIfAuthenticatedGuard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirectIfAuthenticatedGuard],
    }).compileComponents();

    fixture = TestBed.createComponent(RedirectIfAuthenticatedGuard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
