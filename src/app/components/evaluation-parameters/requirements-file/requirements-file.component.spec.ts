import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementsFileComponent } from './requirements-file.component';

describe('RequirementsFileComponent', () => {
  let component: RequirementsFileComponent;
  let fixture: ComponentFixture<RequirementsFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequirementsFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementsFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
