import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareResultsRegisterComponent } from './software-results-register.component';

describe('SoftwareResultsRegisterComponent', () => {
  let component: SoftwareResultsRegisterComponent;
  let fixture: ComponentFixture<SoftwareResultsRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoftwareResultsRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareResultsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
