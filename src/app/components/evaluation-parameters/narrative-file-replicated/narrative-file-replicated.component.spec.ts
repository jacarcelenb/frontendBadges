import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NarrativeFileReplicatedComponent } from './narrative-file-replicated.component';

describe('NarrativeFileReplicatedComponent', () => {
  let component: NarrativeFileReplicatedComponent;
  let fixture: ComponentFixture<NarrativeFileReplicatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NarrativeFileReplicatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NarrativeFileReplicatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
