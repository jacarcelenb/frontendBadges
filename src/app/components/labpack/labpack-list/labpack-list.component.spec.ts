import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabpackListComponent } from './labpack-list.component';

describe('LabpackListComponent', () => {
  let component: LabpackListComponent;
  let fixture: ComponentFixture<LabpackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabpackListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabpackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
