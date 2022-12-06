import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmArtifactsListComponent } from './acm-artifacts-list.component';

describe('AcmArtifactsListComponent', () => {
  let component: AcmArtifactsListComponent;
  let fixture: ComponentFixture<AcmArtifactsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcmArtifactsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcmArtifactsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
