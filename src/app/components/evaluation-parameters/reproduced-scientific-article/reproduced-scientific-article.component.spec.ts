import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproducedScientificArticleComponent } from './reproduced-scientific-article.component';

describe('ReproducedScientificArticleComponent', () => {
  let component: ReproducedScientificArticleComponent;
  let fixture: ComponentFixture<ReproducedScientificArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReproducedScientificArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproducedScientificArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
