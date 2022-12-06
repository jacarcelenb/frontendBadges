import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinConfigComponent } from './min-config.component';

describe('MinConfigComponent', () => {
  let component: MinConfigComponent;
  let fixture: ComponentFixture<MinConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
