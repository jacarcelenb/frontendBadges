import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelevanceArtifactComponent } from './relevance-artifact.component';

describe('RelevanceArtifactComponent', () => {
  let component: RelevanceArtifactComponent;
  let fixture: ComponentFixture<RelevanceArtifactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelevanceArtifactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelevanceArtifactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
