import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentArtifactsReportComponent } from './experiment-artifacts-report.component';

describe('ExperimentArtifactsReportComponent', () => {
  let component: ExperimentArtifactsReportComponent;
  let fixture: ComponentFixture<ExperimentArtifactsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentArtifactsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentArtifactsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
