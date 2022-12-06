import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionTimeCompleteComponent } from './execution-time-complete.component';

describe('ExecutionTimeCompleteComponent', () => {
  let component: ExecutionTimeCompleteComponent;
  let fixture: ComponentFixture<ExecutionTimeCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutionTimeCompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionTimeCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
