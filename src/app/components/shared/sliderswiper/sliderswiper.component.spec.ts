import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderswiperComponent } from './sliderswiper.component';

describe('SliderswiperComponent', () => {
  let component: SliderswiperComponent;
  let fixture: ComponentFixture<SliderswiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderswiperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderswiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
