import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuredArtifactsComponent } from './structured-artifacts.component';

describe('StructuredArtifactsComponent', () => {
  let component: StructuredArtifactsComponent;
  let fixture: ComponentFixture<StructuredArtifactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StructuredArtifactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructuredArtifactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
