import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuratedDataComponent } from './curated-data.component';

describe('CuratedDataComponent', () => {
  let component: CuratedDataComponent;
  let fixture: ComponentFixture<CuratedDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuratedDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuratedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
