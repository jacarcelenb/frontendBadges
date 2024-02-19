import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingArtifactsComponent } from './training-artifacts.component';

describe('TrainingArtifactsComponent', () => {
  let component: TrainingArtifactsComponent;
  let fixture: ComponentFixture<TrainingArtifactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingArtifactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingArtifactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
