import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantDemographicComponent } from './participant-demographic.component';

describe('ParticipantDemographicComponent', () => {
  let component: ParticipantDemographicComponent;
  let fixture: ComponentFixture<ParticipantDemographicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantDemographicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantDemographicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
