import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallFileComponent } from './install-file.component';

describe('InstallFileComponent', () => {
  let component: InstallFileComponent;
  let fixture: ComponentFixture<InstallFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
