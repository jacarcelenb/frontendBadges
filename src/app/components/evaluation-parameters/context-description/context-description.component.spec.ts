import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextDescriptionComponent } from './context-description.component';

describe('ContextDescriptionComponent', () => {
  let component: ContextDescriptionComponent;
  let fixture: ComponentFixture<ContextDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContextDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
