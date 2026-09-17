import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareLink } from './share-link';

describe('ShareLink', () => {
  let component: ShareLink;
  let fixture: ComponentFixture<ShareLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareLink],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareLink);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
