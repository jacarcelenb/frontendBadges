import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproducedCriticSummaryComponent } from './reproduced-critic-summary.component';

describe('ReproducedCriticSummaryComponent', () => {
  let component: ReproducedCriticSummaryComponent;
  let fixture: ComponentFixture<ReproducedCriticSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReproducedCriticSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproducedCriticSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
