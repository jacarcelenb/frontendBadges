import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentTasksReportComponent } from './experiment-tasks-report.component';

describe('ExperimentTasksReportComponent', () => {
  let component: ExperimentTasksReportComponent;
  let fixture: ComponentFixture<ExperimentTasksReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentTasksReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentTasksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
