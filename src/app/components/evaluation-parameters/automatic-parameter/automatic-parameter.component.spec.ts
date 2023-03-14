import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticParameterComponent } from './automatic-parameter.component';

describe('AutomaticParameterComponent', () => {
  let component: AutomaticParameterComponent;
  let fixture: ComponentFixture<AutomaticParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomaticParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomaticParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
