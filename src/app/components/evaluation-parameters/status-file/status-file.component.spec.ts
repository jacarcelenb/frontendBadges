import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusFileComponent } from './status-file.component';

describe('StatusFileComponent', () => {
  let component: StatusFileComponent;
  let fixture: ComponentFixture<StatusFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
