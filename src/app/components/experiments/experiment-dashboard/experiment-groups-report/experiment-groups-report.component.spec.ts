import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentGroupsReportComponent } from './experiment-groups-report.component';

describe('ExperimentGroupsReportComponent', () => {
  let component: ExperimentGroupsReportComponent;
  let fixture: ComponentFixture<ExperimentGroupsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentGroupsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentGroupsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
