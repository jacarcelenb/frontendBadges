import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareExecutionResultsComponent } from './software-execution-results.component';

describe('SoftwareExecutionResultsComponent', () => {
  let component: SoftwareExecutionResultsComponent;
  let fixture: ComponentFixture<SoftwareExecutionResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoftwareExecutionResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareExecutionResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
