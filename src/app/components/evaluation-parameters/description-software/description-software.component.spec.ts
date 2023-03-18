import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionSoftwareComponent } from './description-software.component';

describe('DescriptionSoftwareComponent', () => {
  let component: DescriptionSoftwareComponent;
  let fixture: ComponentFixture<DescriptionSoftwareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionSoftwareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
