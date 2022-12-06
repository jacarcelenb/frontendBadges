import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadmeDocComponent } from './readme-doc.component';

describe('ReadmeDocComponent', () => {
  let component: ReadmeDocComponent;
  let fixture: ComponentFixture<ReadmeDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadmeDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadmeDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
