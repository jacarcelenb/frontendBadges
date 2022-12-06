import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmArtifactsCreateComponent } from './acm-artifacts-create.component';

describe('AcmArtifactsCreateComponent', () => {
  let component: AcmArtifactsCreateComponent;
  let fixture: ComponentFixture<AcmArtifactsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcmArtifactsCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcmArtifactsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
