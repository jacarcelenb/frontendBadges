import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionGuideDownloadComponent } from './instruction-guide-download.component';

describe('InstructionGuideDownloadComponent', () => {
  let component: InstructionGuideDownloadComponent;
  let fixture: ComponentFixture<InstructionGuideDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructionGuideDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionGuideDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
