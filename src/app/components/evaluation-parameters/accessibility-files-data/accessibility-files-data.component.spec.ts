import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityFilesDataComponent } from './accessibility-files-data.component';

describe('AccessibilityFilesDataComponent', () => {
  let component: AccessibilityFilesDataComponent;
  let fixture: ComponentFixture<AccessibilityFilesDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessibilityFilesDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilityFilesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
