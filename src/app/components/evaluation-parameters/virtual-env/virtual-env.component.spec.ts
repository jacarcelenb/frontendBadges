import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualEnvComponent } from './virtual-env.component';

describe('VirtualEnvComponent', () => {
  let component: VirtualEnvComponent;
  let fixture: ComponentFixture<VirtualEnvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualEnvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualEnvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
