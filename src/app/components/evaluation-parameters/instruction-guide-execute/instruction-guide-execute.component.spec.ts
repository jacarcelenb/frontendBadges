import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionGuideExecuteComponent } from './instruction-guide-execute.component';

describe('InstructionGuideExecuteComponent', () => {
  let component: InstructionGuideExecuteComponent;
  let fixture: ComponentFixture<InstructionGuideExecuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructionGuideExecuteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionGuideExecuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
