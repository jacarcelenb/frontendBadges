import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentProgressReportComponent } from './experiment-progress-report.component';

describe('ExperimentProgressReportComponent', () => {
  let component: ExperimentProgressReportComponent;
  let fixture: ComponentFixture<ExperimentProgressReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentProgressReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentProgressReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
