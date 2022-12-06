import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentsOutletComponent } from './experiments-outlet.component';

describe('ExperimentsOutletComponent', () => {
  let component: ExperimentsOutletComponent;
  let fixture: ComponentFixture<ExperimentsOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentsOutletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentsOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
