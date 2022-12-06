import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproducedAuthorsFileComponent } from './reproduced-authors-file.component';

describe('ReproducedAuthorsFileComponent', () => {
  let component: ReproducedAuthorsFileComponent;
  let fixture: ComponentFixture<ReproducedAuthorsFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReproducedAuthorsFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproducedAuthorsFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
