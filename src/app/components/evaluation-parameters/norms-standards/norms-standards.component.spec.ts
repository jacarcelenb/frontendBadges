import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormsStandardsComponent } from './norms-standards.component';

describe('NormsStandardsComponent', () => {
  let component: NormsStandardsComponent;
  let fixture: ComponentFixture<NormsStandardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NormsStandardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NormsStandardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
