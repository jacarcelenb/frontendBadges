import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScientificArticleReplicatedComponent } from './scientific-article-replicated.component';

describe('ScientificArticleReplicatedComponent', () => {
  let component: ScientificArticleReplicatedComponent;
  let fixture: ComponentFixture<ScientificArticleReplicatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScientificArticleReplicatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScientificArticleReplicatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
