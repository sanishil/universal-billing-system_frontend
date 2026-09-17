import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfPreview } from './pdf-preview';

describe('PdfPreview', () => {
  let component: PdfPreview;
  let fixture: ComponentFixture<PdfPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(PdfPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
