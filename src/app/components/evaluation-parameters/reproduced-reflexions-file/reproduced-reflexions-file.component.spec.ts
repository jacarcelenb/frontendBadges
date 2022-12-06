import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproducedReflexionsFileComponent } from './reproduced-reflexions-file.component';

describe('ReproducedReflexionsFileComponent', () => {
  let component: ReproducedReflexionsFileComponent;
  let fixture: ComponentFixture<ReproducedReflexionsFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReproducedReflexionsFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproducedReflexionsFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
