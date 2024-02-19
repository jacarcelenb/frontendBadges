import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptualModelsComponent } from './conceptual-models.component';

describe('ConceptualModelsComponent', () => {
  let component: ConceptualModelsComponent;
  let fixture: ComponentFixture<ConceptualModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConceptualModelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptualModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
