import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareRequirementsComponent } from './hardware-requirements.component';

describe('HardwareRequirementsComponent', () => {
  let component: HardwareRequirementsComponent;
  let fixture: ComponentFixture<HardwareRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HardwareRequirementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
