import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationFileComponent } from './citation-file.component';

describe('CitationFileComponent', () => {
  let component: CitationFileComponent;
  let fixture: ComponentFixture<CitationFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitationFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
