import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfGenerator } from './pdf-generator';

describe('PdfGenerator', () => {
  let component: PdfGenerator;
  let fixture: ComponentFixture<PdfGenerator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfGenerator],
    }).compileComponents();

    fixture = TestBed.createComponent(PdfGenerator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
