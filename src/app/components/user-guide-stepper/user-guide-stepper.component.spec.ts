import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGuideStepperComponent } from './user-guide-stepper.component';

describe('UserGuideStepperComponent', () => {
  let component: UserGuideStepperComponent;
  let fixture: ComponentFixture<UserGuideStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGuideStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGuideStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
