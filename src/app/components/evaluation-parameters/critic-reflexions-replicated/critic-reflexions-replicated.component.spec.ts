import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticReflexionsReplicatedComponent } from './critic-reflexions-replicated.component';

describe('CriticReflexionsReplicatedComponent', () => {
  let component: CriticReflexionsReplicatedComponent;
  let fixture: ComponentFixture<CriticReflexionsReplicatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriticReflexionsReplicatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticReflexionsReplicatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
