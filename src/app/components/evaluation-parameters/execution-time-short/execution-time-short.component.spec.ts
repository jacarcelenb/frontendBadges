import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionTimeShortComponent } from './execution-time-short.component';

describe('ExecutionTimeShortComponent', () => {
  let component: ExecutionTimeShortComponent;
  let fixture: ComponentFixture<ExecutionTimeShortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutionTimeShortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionTimeShortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
