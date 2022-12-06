import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentDashboardComponent } from './experiment-dashboard.component';

describe('ExperimentDashboardComponent', () => {
  let component: ExperimentDashboardComponent;
  let fixture: ComponentFixture<ExperimentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
