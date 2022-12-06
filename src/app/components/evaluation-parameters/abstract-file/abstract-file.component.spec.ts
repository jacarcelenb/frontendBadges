import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractFileComponent } from './abstract-file.component';

describe('AbstractFileComponent', () => {
  let component: AbstractFileComponent;
  let fixture: ComponentFixture<AbstractFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbstractFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
