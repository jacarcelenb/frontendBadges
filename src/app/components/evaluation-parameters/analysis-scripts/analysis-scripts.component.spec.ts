import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisScriptsComponent } from './analysis-scripts.component';

describe('AnalysisScriptsComponent', () => {
  let component: AnalysisScriptsComponent;
  let fixture: ComponentFixture<AnalysisScriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisScriptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
