import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignDescriptionComponent } from './design-description.component';

describe('DesignDescriptionComponent', () => {
  let component: DesignDescriptionComponent;
  let fixture: ComponentFixture<DesignDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
