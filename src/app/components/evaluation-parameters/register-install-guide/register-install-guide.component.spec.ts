import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterInstallGuideComponent } from './register-install-guide.component';

describe('RegisterInstallGuideComponent', () => {
  let component: RegisterInstallGuideComponent;
  let fixture: ComponentFixture<RegisterInstallGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterInstallGuideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterInstallGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
