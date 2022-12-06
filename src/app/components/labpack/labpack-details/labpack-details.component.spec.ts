import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabpackDetailsComponent } from './labpack-details.component';

describe('LabpackDetailsComponent', () => {
  let component: LabpackDetailsComponent;
  let fixture: ComponentFixture<LabpackDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabpackDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabpackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
