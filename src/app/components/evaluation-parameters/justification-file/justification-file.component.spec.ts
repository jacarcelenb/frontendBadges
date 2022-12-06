import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificationFileComponent } from './justification-file.component';

describe('JustificationFileComponent', () => {
  let component: JustificationFileComponent;
  let fixture: ComponentFixture<JustificationFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JustificationFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JustificationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
