import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseFileComponent } from './license-file.component';

describe('LicenseFileComponent', () => {
  let component: LicenseFileComponent;
  let fixture: ComponentFixture<LicenseFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenseFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
