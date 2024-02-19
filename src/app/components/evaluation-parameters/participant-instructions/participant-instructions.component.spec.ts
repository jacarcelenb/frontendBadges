import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantInstructionsComponent } from './participant-instructions.component';

describe('ParticipantInstructionsComponent', () => {
  let component: ParticipantInstructionsComponent;
  let fixture: ComponentFixture<ParticipantInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantInstructionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
