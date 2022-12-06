import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractArticleReplicatedComponent } from './abstract-article-replicated.component';

describe('AbstractArticleReplicatedComponent', () => {
  let component: AbstractArticleReplicatedComponent;
  let fixture: ComponentFixture<AbstractArticleReplicatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbstractArticleReplicatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractArticleReplicatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
