import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticSummaryReplicatedComponent } from './critic-summary-replicated.component';

describe('CriticSummaryReplicatedComponent', () => {
  let component: CriticSummaryReplicatedComponent;
  let fixture: ComponentFixture<CriticSummaryReplicatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriticSummaryReplicatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticSummaryReplicatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
