import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproducedNarrativeFileComponent } from './reproduced-narrative-file.component';

describe('ReproducedNarrativeFileComponent', () => {
  let component: ReproducedNarrativeFileComponent;
  let fixture: ComponentFixture<ReproducedNarrativeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReproducedNarrativeFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproducedNarrativeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
