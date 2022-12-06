import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadmeFileComponent } from './readme-file.component';

describe('ReadmeFileComponent', () => {
  let component: ReadmeFileComponent;
  let fixture: ComponentFixture<ReadmeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadmeFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadmeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
