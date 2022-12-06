import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificationFileReplicatedComponent } from './justification-file-replicated.component';

describe('JustificationFileReplicatedComponent', () => {
  let component: JustificationFileReplicatedComponent;
  let fixture: ComponentFixture<JustificationFileReplicatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JustificationFileReplicatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JustificationFileReplicatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
